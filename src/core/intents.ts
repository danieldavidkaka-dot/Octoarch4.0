/**
 * Octoarch v4.0 - Intent Detection Module
 * Copyright (c) 2026 Daniel David Barrios
 * Licensed under GNU GPLv3
 */

/**
 * 🕵️‍♂️ DETECTOR DE INTENCIÓN (v4.0)
 * Analiza el prompt del usuario y decide qué template usar.
 */
export function detectIntent(prompt: string): string {
    const p = prompt.toLowerCase();
    
    // --- 0. INTERACCIÓN HUMANA ---
    if (p.match(/^(hola|hi|hello|buenos|saludos|hey|qué tal)/)) return "CHAT";
    if (p.includes("ayuda") || p.includes("help") || p.includes("qué puedes hacer")) return "README_GOD";

    // --- 1. COMUNICACIÓN & MENSAJERÍA (✅ NUEVO: WhatsApp & Social) ---
    if (p.includes("whatsapp") || p.includes("mensaje") || p.includes("qr") || p.includes("chat")) return "WHATSAPP_LINK";
    
    // --- 2. AGENCIA & NEGOCIO ---
    // Finanzas (CFO)
    if (p.includes("costo") || p.includes("presupuesto") || p.includes("financiero") || p.includes("roi") || p.includes("burn rate")) return "CFO_ADVISOR";
    // Marketing (CMO)
    if (p.includes("marketing") || p.includes("mercado") || p.includes("go-to-market") || p.includes("lanzamiento")) return "MARKETING_GURU";
    if (p.includes("seo") || p.includes("ranking") || p.includes("keyword") || p.includes("palabras clave")) return "SEO_AUDIT";
    if (p.includes("copy") || p.includes("texto persuasivo") || p.includes("blog") || p.includes("post") || p.includes("artículo")) return "COPYWRITER";
    if (p.includes("email") && (p.includes("venta") || p.includes("frío") || p.includes("cold"))) return "COLD_EMAIL";
    // Legal
    if (p.includes("legal") || p.includes("contrato") || p.includes("términos") || p.includes("privacidad")) return "LEGAL_DRAFT";
    
    // --- 3. GESTIÓN Y PRODUCTO ---
    if (p.includes("prd") || p.includes("requisitos") || p.includes("user stories") || p.includes("historias de usuario") || p.includes("pitch")) return "PRD_MASTER";
    if (p.includes("api") || p.includes("swagger") || p.includes("endpoint") || p.includes("openapi")) return "API_DESIGNER";
    
    // --- 4. INFRAESTRUCTURA Y DOCS ---
    if (p.includes("docker") || p.includes("deploy") || p.includes("ci/cd") || p.includes("pipeline") || p.includes("nube")) return "DEVOPS_PRO";
    if (p.includes("readme") || p.includes("documentación") || p.includes("manual") || p.includes("guía")) return "README_GOD";

    // --- 5. INVESTIGACIÓN Y NAVEGACIÓN ---
    if (p.includes("navega") || p.includes("visita") || p.includes("url") || p.includes("lee la web") || p.includes("http")) return "RESEARCHER";

    // --- 6. SEGURIDAD Y MANTENIMIENTO ---
    if (p.includes("seguridad") || p.includes("vulnerable") || p.includes("owasp")) return "LOGIC";
    if (p.includes("error") || p.includes("bug") || p.includes("fix") || p.includes("repara")) return "FIX";
    if (p.includes("review") || p.includes("revisa") || p.includes("calidad") || p.includes("lint")) return "CODE_REVIEW";
    if (p.includes("legacy") || p.includes("migrar") || p.includes("refactorizar")) return "LEGACY_MODERNIZER";
    if (p.includes("test") || p.includes("prueba") || p.includes("qa") || p.includes("coverage")) return "UNIT_TEST";
    
    // --- 7. DATOS Y LÓGICA ---
    if (p.includes("piensa") || p.includes("analiza") || p.includes("razona") || p.includes("investiga")) return "R1_THINK";
    if (p.includes("base de datos") || p.includes("sql") || p.includes("schema") || p.includes("db")) return "DB_ARCHITECT";
    if (p.includes("arquitectura") || p.includes("estructura") || p.includes("blueprint")) return "BLUEPRINT";
    if (p.includes("scrap") || p.includes("extraer") || p.includes("crawler")) return "SCRAPER";
    if (p.includes("datos falsos") || p.includes("mock") || p.includes("generar datos")) return "DATA";
    if (p.includes("ffmpeg") || p.includes("video") || p.includes("audio")) return "FFMPEG_WIZARD";
    
    // --- 8. DISEÑO & UI/UX ---
    if (p.includes("móvil") || p.includes("react native") || p.includes("ios") || p.includes("android")) return "MOBILE_DEV";
    if (p.includes("diseño") || p.includes("ui") || p.includes("ux") || p.includes("figma")) return "UI/UX";
    if (p.includes("email html") || p.includes("newsletter")) return "Qt_EMAIL";
    if (p.includes("componente") || p.includes("tailwind") || p.includes("css")) return "FRONTEND_MASTER";
    if (p.includes("diagrama") || p.includes("flujo")) return "FLOW";

    // Default: Modo Experto Políglota
    return "DEV"; 
}