import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import { FileTool } from '../tools/files';
import { ShellTool } from '../tools/shell';
import { MemorySystem } from './memory';
import { ConversationManager } from './conversation';
import { Logger } from '../utils/logger';
import { detectIntent, applyTemplate, buildSystemPrompt } from './library';

export class IntelligenceCore {
    private model: any;
    // @ts-ignore
    private conversationMgr: ConversationManager;

    constructor() {
        this.conversationMgr = new ConversationManager();
        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
        // Usamos gemini-2.5-flash porque es excelente y rápido para OCR Multimodal
        const modelName = "gemini-2.5-flash";
        
        this.model = genAI.getGenerativeModel({ 
            model: modelName,
            systemInstruction: `
            ERES OCTOARCH V4.0.
            
            1. REGLA DE IDIOMA (BILINGÜE):
            Analiza el idioma del usuario. Responde y PIENSA ('thought') estrictamente en ese idioma.

            2. REGLA DE HERRAMIENTAS (CRÍTICA):
            - Para NAVEGAR en internet: DEBES usar { "action": "inspect", "url": "..." }.
            - ESTÁ PROHIBIDO usar "execute" para ver webs. "execute" es SOLO para comandos de terminal (bash/powershell).
            - Si estás en modo RESEARCHER, solo puedes usar "inspect" y "read". NO intentes usar "execute".

            3. REGLA ANTI-ALUCINACIÓN:
            No inventes noticias ni datos. Si no puedes usar la herramienta, dilo. Si una imagen no es legible, dilo.
            `
        });
        
        Logger.info(`IntelligenceCore v4.1 (Multimodal Vision Ready) inicializado con ${modelName}`);
    }

    // Función auxiliar para formatear la imagen para Google Gemini
    private parseBase64Image(dataURI: string) {
        // Separa "data:image/jpeg;base64" del contenido real
        const split = dataURI.split(',');
        if (split.length !== 2) return null;
        
        const mimeString = split[0].split(':')[1].split(';')[0];
        const base64Data = split[1];
        
        return {
            inlineData: {
                data: base64Data,
                mimeType: mimeString
            }
        };
    }

    private async generateWithRetry(content: string | any[], retries = 3): Promise<any> {
        let delay = 5000;
        for (let i = 0; i < retries; i++) {
            try {
                // Ahora puede recibir un string o un Array (Texto + Imagen)
                return await this.model.generateContent(content);
            } catch (error: any) {
                if (error.message?.includes('429') || error.message?.includes('Quota')) {
                    Logger.warn(`Rate Limit. Esperando ${delay}ms... (Intento ${i + 1}/${retries})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                } else {
                    throw error;
                }
            }
        }
        throw new Error("❌ Se excedió el límite de reintentos.");
    }

    // 🚀 AHORA ACEPTA LA IMAGEN COMO TERCER PARÁMETRO
    async generateResponse(userPrompt: string, forcedIntent: string | null = null, imageBase64: string | null = null): Promise<string> {
        try {
            const fileList = await FileTool.listFiles('./');
            const memory = await MemorySystem.recall();
            
            const intent = forcedIntent ? forcedIntent : detectIntent(userPrompt);
            const enrichedPrompt = applyTemplate(intent, userPrompt);
            Logger.info('Intención Final Evaluada', { intent, isForced: !!forcedIntent, hasImage: !!imageBase64 });

            const systemPrompt = buildSystemPrompt(memory, fileList, enrichedPrompt);

            // 👁️ Lógica Multimodal (Visión)
            let promptContent: any = systemPrompt;
            if (imageBase64) {
                const imagePart = this.parseBase64Image(imageBase64);
                if (imagePart) {
                    Logger.info('🖼️ Inyectando imagen al prompt de Gemini...');
                    // Gemini requiere que le pasemos un Array cuando hay imágenes
                    promptContent = [systemPrompt, imagePart]; 
                } else {
                    Logger.warn('⚠️ Imagen recibida pero el formato Base64 es inválido.');
                }
            }

            const result = await this.generateWithRetry(promptContent);
            const responseText = result.response.text();
            
            return await this.processExecution(responseText, intent, forcedIntent);

        } catch (error: any) {
            Logger.error("❌ Error en Core:", error);
            return `❌ Error: ${error.message}. Verifica tu API Key o cuota.`;
        }
    }

    private async processExecution(responseText: string, intent: string, forcedIntent: string | null): Promise<string> {
        try {
            const firstBrace = responseText.indexOf('{');
            const lastBrace = responseText.lastIndexOf('}');

            if (firstBrace === -1 || lastBrace === -1) return responseText;

            const cleanJson = responseText.substring(firstBrace, lastBrace + 1);

            let parsed: any;
            try {
                parsed = JSON.parse(cleanJson);
            } catch (jsonError) {
                return responseText;
            }
            
            if (!parsed.operations || !Array.isArray(parsed.operations)) return parsed.thought || responseText;

            let toolOutputs = ""; 
            let operationsPerformed = false;
            const activeRole = forcedIntent || 'Auto';

            for (const op of parsed.operations) {
                let isAllowed = true;
                let denyReason = "";

                if (activeRole === 'CHAT') {
                    if (['execute', 'create', 'read', 'inspect'].includes(op.action)) {
                        isAllowed = false;
                        denyReason = "Modo Seguro (Chat) no permite herramientas.";
                    }
                } 
                else if ((activeRole === 'CFO_ADVISOR' || activeRole === 'RESEARCHER') && ['execute', 'create'].includes(op.action)) {
                    isAllowed = false;
                    denyReason = "Rol de Análisis no permite modificar el sistema (Read-Only).";
                }

                if (!isAllowed) {
                    Logger.warn(`🛡️ BLOCKED: ${op.action} en modo ${activeRole}`);
                    toolOutputs += `❌ [BLOCKED]: Operación '${op.action}' denegada por seguridad (${denyReason}).\n`;
                    continue; 
                }

                try {
                    if (op.action === 'read' && op.path) {
                        const content = await FileTool.readFile(op.path);
                        toolOutputs += `\n--- RESULTADO DE LEER ${op.path} ---\n${content.substring(0, 5000)}\n-----------------------------------\n`;
                        operationsPerformed = true;
                    }
                    else if (op.action === 'create' && op.path && op.content) {
                        const res = await FileTool.writeFile(op.path, op.content);
                        toolOutputs += `\n--- RESULTADO DE CREAR ARCHIVO ---\n${res}\n-----------------------------------\n`;
                        operationsPerformed = true;
                    }
                    else if (op.action === 'execute' && op.command) {
                        const output = await ShellTool.execute(op.command);
                        toolOutputs += `\n--- RESULTADO DE TERMINAL (${op.command}) ---\n${output.substring(0, 3000)}\n-----------------------------------\n`;
                        operationsPerformed = true;
                    }
                    else if (op.action === 'inspect' && op.url) {
                        const { BrowserTool } = require('../tools/browser');
                        const report = await BrowserTool.inspect(op.url);
                        toolOutputs += `\n--- RESULTADO DE NAVEGADOR (${op.url}) ---\n${report}\n-----------------------------------\n`;
                        operationsPerformed = true;
                    }
                } catch (opError: any) {
                    toolOutputs += `❌ [ERROR EJECUCIÓN]: ${opError.message}\n`;
                }
            }

            if (operationsPerformed) {
                Logger.info("🔄 Iniciando Bucle Cognitivo para interpretar resultados...");
                const loopPrompt = `
                [CONTEXTO]
                Actúas como: ${intent}.
                Tu pensamiento original fue: "${parsed.thought || 'N/A'}"
                
                [RESULTADOS TÉCNICOS OBTENIDOS]
                ${toolOutputs}

                [INSTRUCCIÓN]
                Analiza los resultados de arriba y responde al usuario final.
                - NO menciones que estás leyendo logs o JSON.
                - Si es una investigación web, resume los hallazgos clave de forma clara.
                - Responde en el mismo idioma que usaste en tu pensamiento original.
                `;

                const finalResponse = await this.generateWithRetry(loopPrompt);
                return finalResponse.response.text();
            }

            return `**Octoarch (${intent}):**\n${parsed.thought || ''}\n\n${toolOutputs}`;

        } catch (e) {
            return responseText;
        }
    }
}