/**
 * Octoarch v4.0 - Core Library Manager
 * Copyright (c) 2026 Daniel David Barrios
 * Licensed under GNU GPLv3
 */

import { ARCH_LIBRARY } from './templates';

// Re-exportamos para mantener la compatibilidad con el resto del sistema
export { detectIntent } from './intents';
export { buildSystemPrompt } from './system';

/**
 * 🏭 PROCESADOR DE TEMPLATES
 * Inyecta variables y inputs en las plantillas crudas.
 */
export function applyTemplate(key: string, userInput: string): string {
    // Busca el template o usa DEV por defecto
    let template = (ARCH_LIBRARY as any)[key] || ARCH_LIBRARY["DEV"];

    if (!template) return `TASK: ${userInput}`;

    // 1. Inyectar el Input del usuario
    template = template.replace("{{INPUT}}", userInput);

    // 2. Procesar Variables dinámicas {{VAR:Nombre:Opcion1,Opcion2}}
    const varRegex = /{{VAR:[^:]+:([^,}]*)[^}]*}}/g;
    template = template.replace(varRegex, "$1");

    return template;
}