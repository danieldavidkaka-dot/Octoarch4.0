import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { Logger } from '../utils/logger';

// 🛡️ SEGURIDAD: Lista blanca de números autorizados (Déjala vacía para probar)
const WHITELIST: string[] = [];

export class WhatsAppService {
    private static client: Client;
    private static isReady: boolean = false;

    static async initialize() {
        Logger.info("📱 Iniciando servicio de WhatsApp (Modo Robusto)...");

        this.client = new Client({
            restartOnAuthFail: true, 
            authStrategy: new LocalAuth({
                clientId: "octoarch_v4_session", 
                dataPath: 'workspace/auth_wa'
            }),
            // 🛠️ FIX 1: Forzar una versión estable de WhatsApp Web
            webVersionCache: {
                type: 'remote',
                remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
            },
            puppeteer: {
                headless: true,
                // 🛠️ FIX 2: Aumentar el timeout para que no desespere
                timeout: 60000, 
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage', 
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--disable-gpu' 
                ]
            }
        });

        // 1. GENERACIÓN DE QR
        this.client.on('qr', (qr: string) => {
            // 🛠️ FIX 3: Desactivar console.clear() temporalmente para no perder el QR visualmente
            // console.clear(); 
            Logger.info("📱 ¡NUEVO QR! Escanea este RÁPIDO con tu celular:");
            qrcode.generate(qr, { small: true });
        });

        // 2. ESTADOS DE CONEXIÓN
        this.client.on('authenticated', () => {
            Logger.info("🔑 ¡Autenticado correctamente! Cargando chats...");
        });

        this.client.on('auth_failure', (msg) => {
            Logger.error("❌ Falló la autenticación. Borra la carpeta 'auth_wa' y reinicia.", msg);
        });

        this.client.on('ready', () => {
            Logger.info("✅ ¡CONECTADO! Octoarch v4.0 ya tiene WhatsApp.");
            this.isReady = true;
        });

        // 3. ESCUCHA DE MENSAJES
        this.client.on('message_create', async (msg: Message) => {
            if (WHITELIST.length > 0 && !WHITELIST.includes(msg.from)) {
                return;
            }

            Logger.info(`🔎 [Chat] ${msg.from} dice: "${msg.body}"`);

            if (msg.body === '!ping') {
                Logger.info("🏓 ¡Ping detectado! Enviando respuesta...");
                await msg.reply('🐙 Octoarch v4.0 Online & Ready.');
            }
        });

        // 4. INICIALIZACIÓN
        try {
            await this.client.initialize();
        } catch (error) {
            Logger.error("❌ Error fatal iniciando WhatsApp", error);
        }
    }

    static async sendMessage(to: string, message: string) {
        if (!this.isReady) {
            Logger.error("⚠️ WhatsApp no está listo para enviar mensajes.");
            return;
        }
        try {
            await this.client.sendMessage(to, message);
            Logger.info(`📤 Mensaje enviado a ${to}`);
        } catch (error) {
            Logger.error("❌ Error enviando mensaje", error);
        }
    }
}