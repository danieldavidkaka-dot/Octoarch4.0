// src/core/library.ts
// EL CEREBRO LÓGICO (Solo Funciones)
// v5.3 - Elite Solutions Architect (Full Agency Mode)

// 👇 IMPORTANTE: Importamos los datos desde el archivo templates.ts
import { ARCH_LIBRARY } from './templates';

/**
 * 🕵️‍♂️ DETECTOR DE INTENCIÓN (v5.3)
 * Analiza el prompt del usuario y decide qué template usar.
 */
export function detectIntent(prompt: string): string {
    const p = prompt.toLowerCase();
    
    // --- 0. INTERACCIÓN HUMANA ---
    if (p.match(/^(hola|hi|hello|buenos|saludos|hey|qué tal)/)) return "CHAT";
    if (p.includes("ayuda") || p.includes("help") || p.includes("qué puedes hacer")) return "README_GOD";

    // --- 1. AGENCIA & NEGOCIO (Marketing, Finanzas, Legal) ---
    // Finanzas (CFO)
    if (p.includes("costo") || p.includes("presupuesto") || p.includes("financiero") || p.includes("roi") || p.includes("burn rate")) return "CFO_ADVISOR";
    // Marketing (CMO)
    if (p.includes("marketing") || p.includes("mercado") || p.includes("go-to-market") || p.includes("lanzamiento")) return "MARKETING_GURU";
    if (p.includes("seo") || p.includes("ranking") || p.includes("keyword") || p.includes("palabras clave")) return "SEO_AUDIT";
    if (p.includes("copy") || p.includes("texto persuasivo") || p.includes("blog") || p.includes("post") || p.includes("artículo")) return "COPYWRITER";
    if (p.includes("email") && (p.includes("venta") || p.includes("frío") || p.includes("cold"))) return "COLD_EMAIL";
    // Legal
    if (p.includes("legal") || p.includes("contrato") || p.includes("términos") || p.includes("privacidad")) return "LEGAL_DRAFT";
    
    // --- 2. GESTIÓN Y PRODUCTO ---
    if (p.includes("prd") || p.includes("requisitos") || p.includes("user stories") || p.includes("historias de usuario") || p.includes("pitch")) return "PRD_MASTER";
    if (p.includes("api") || p.includes("swagger") || p.includes("endpoint") || p.includes("openapi")) return "API_DESIGNER";
    
    // --- 3. INFRAESTRUCTURA Y DOCS ---
    if (p.includes("docker") || p.includes("deploy") || p.includes("ci/cd") || p.includes("pipeline") || p.includes("nube")) return "DEVOPS_PRO";
    if (p.includes("readme") || p.includes("documentación") || p.includes("manual") || p.includes("guía")) return "README_GOD";

    // --- 4. INVESTIGACIÓN Y NAVEGACIÓN ---
    if (p.includes("navega") || p.includes("visita") || p.includes("url") || p.includes("lee la web") || p.includes("http")) return "RESEARCHER";

    // --- 5. SEGURIDAD Y MANTENIMIENTO ---
    if (p.includes("seguridad") || p.includes("vulnerable") || p.includes("owasp")) return "LOGIC";
    if (p.includes("error") || p.includes("bug") || p.includes("fix") || p.includes("repara")) return "FIX";
    if (p.includes("review") || p.includes("revisa") || p.includes("calidad") || p.includes("lint")) return "CODE_REVIEW";
    if (p.includes("legacy") || p.includes("migrar") || p.includes("refactorizar")) return "LEGACY_MODERNIZER";
    if (p.includes("test") || p.includes("prueba") || p.includes("qa") || p.includes("coverage")) return "UNIT_TEST";
    
    // --- 6. DATOS Y LÓGICA ---
    if (p.includes("piensa") || p.includes("analiza") || p.includes("razona") || p.includes("investiga")) return "R1_THINK";
    if (p.includes("base de datos") || p.includes("sql") || p.includes("schema") || p.includes("db")) return "DB_ARCHITECT";
    if (p.includes("arquitectura") || p.includes("estructura") || p.includes("blueprint")) return "BLUEPRINT";
    if (p.includes("scrap") || p.includes("extraer") || p.includes("crawler")) return "SCRAPER";
    if (p.includes("datos falsos") || p.includes("mock") || p.includes("generar datos")) return "DATA";
    if (p.includes("ffmpeg") || p.includes("video") || p.includes("audio")) return "FFMPEG_WIZARD";
    
    // --- 7. DISEÑO & UI/UX ---
    if (p.includes("móvil") || p.includes("react native") || p.includes("ios") || p.includes("android")) return "MOBILE_DEV";
    if (p.includes("diseño") || p.includes("ui") || p.includes("ux") || p.includes("figma")) return "UI/UX";
    if (p.includes("email html") || p.includes("newsletter")) return "Qt_EMAIL";
    if (p.includes("componente") || p.includes("tailwind") || p.includes("css")) return "FRONTEND_MASTER";
    if (p.includes("diagrama") || p.includes("flujo")) return "FLOW";

    // Default: Modo Constructor Generalista
    return "DEV"; 
}

/**
 * 🏭 PROCESADOR DE TEMPLATES
 * 1. Inyecta el INPUT del usuario.
 * 2. Resuelve las variables {{VAR}} tomando la primera opción por defecto.
 */
export function applyTemplate(key: string, userInput: string): string {
    // Fallback seguro: Si la key no existe, usa DEV
    let template = (ARCH_LIBRARY as any)[key] || ARCH_LIBRARY["DEV"];

    if (!template) return `TASK: ${userInput}`;

    // 1. Inyectar el Input
    template = template.replace("{{INPUT}}", userInput);

    // 2. Procesar Variables {{VAR:Nombre:Opcion1,Opcion2}}
    const varRegex = /{{VAR:[^:]+:([^,}]*)[^}]*}}/g;
    template = template.replace(varRegex, "$1");

    return template;
}

/**
 * 🧠 CONSTRUCTOR DEL CEREBRO (v5.3 - AGENCY EDITION)
 * Define la personalidad de Agencia Digital completa.
 */
export function buildSystemPrompt(memory: string, context: string, task: string): string {
    return `
    ERES OCTOARCH (v5.3 - Elite Solutions Architect & Agency Director).
    
    [TU PERFIL]:
    Eres una Agencia Digital completa en una sola IA.
    No estás limitado al código. Dependiendo de la tarea, adoptas el rol de:
    - Eres un Ingeniero Staff y Arquitecto de Soluciones de Élite. 
    Eres un experto políglota: dominas CUALQUIER lenguaje de programación (Python, Rust, C++, Go, Java, Swift, etc.) y frameworks de backend, frontend, sistemas o IA.
    Tu prioridad es usar la tecnología que mejor resuelva el problema, no la más popular. (Tech Lead)
    - Director de Marketing (CMO)
    - Director Financiero (CFO)
    - Abogado Corporativo o Diseñador de Producto.
    
    [TU MENTALIDAD]:
    1. AGNOSTICISMO: No asumas nada que no esté en la MEMORIA.
    2. PROFESIONALISMO: Usa el tono adecuado para cada rol (Ej: CFO = Serio/Analítico, Marketing = Persuasivo).
    3. EFICIENCIA: Prefieres soluciones simples y robustas (KISS/YAGNI).
    4. HONESTIDAD: Si te piden editar un archivo, PRIMERO usa 'read' para ver si existe. No crees archivos 'dummy' sin permiso.
    5. SEGURIDAD: Nunca intentes leer fuera del workspace o acceder a credenciales (.env).

    [TUS HERRAMIENTAS]:
    1. FILESYSTEM: 
       - 'read': IMPRESCINDIBLE leer archivos antes de editarlos para entender el contexto.
       - 'create': Para crear o sobrescribir archivos con código completo.
    
    2. TERMINAL: 
       - 'execute': Comandos seguros (npm, node, git, ls).

    3. BROWSER:
       - 'inspect': Para leer documentación técnica, investigar errores o buscar datos en tiempo real.
    
    [CONTEXTO (MEMORIA DE SESIÓN)]:
    ${memory}

    [ESTADO ACTUAL DEL WORKSPACE]:
    ${context}

    [TAREA A REALIZAR]:
    ${task}

    ---------------------------------------------------
    [PROTOCOLO DE RESPUESTA - STRICT JSON]:
    Para actuar, DEBES responder EXCLUSIVAMENTE con este formato JSON.
    
    {
        "thought": "1. Analizaré los requisitos. 2. Crearé el archivo de estrategia.",
        "operations": [
            { "action": "read", "path": "src/config.ts" },
            { "action": "execute", "command": "npm install axios" },
            { "action": "create", "path": "marketing/plan.md", "content": "# Estrategia..." }
        ]
    }

    [REGLAS]:
    1. Si el modo es 'R1_THINK', ignora el JSON y usa formato <think>...</think>.
    2. Si editas código, devuelve el archivo COMPLETO, no solo diffs.
    3. Asegúrate de que el JSON sea válido (escapa comillas dobles dentro del contenido).
    `;
}