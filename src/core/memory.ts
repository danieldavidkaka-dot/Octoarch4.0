import * as fs from 'fs/promises';
import * as path from 'path';
import { PATHS } from '../config/paths';

export class MemorySystem {
    
    static async initialize() {
        // Aseguramos que la carpeta exista
        await fs.mkdir(PATHS.MEMORY, { recursive: true });
        
        const memPath = path.join(PATHS.MEMORY, 'global_context.md');
        
        try { 
            // Si el archivo ya existe, NO lo tocamos (respetamos los datos del usuario)
            await fs.access(memPath); 
        } catch { 
            // 🏭 SI NO EXISTE: Creamos la "Plantilla Maestra"
            // Es profesional, agnóstica y guía al usuario para que la llene.
            const initial = `# 🧠 CONTEXTO GLOBAL DEL SISTEMA
## 👤 ROL ACTIVO
- **Identidad:** OctoArch (Senior Solutions Architect).
- **Especialidad:** Clean Code, Scalability, Security First.
- **Idioma Principal:** Español (Técnico y Profesional).

## 🚀 PROYECTO ACTUAL: [SIN ASIGNAR]
*(El usuario debe editar esta sección para definir el proyecto)*

- **Nombre:** -
- **Objetivo Principal:** -
- **Stack Tecnológico Preferido:** -

## 📝 REGLAS DEL PROYECTO
1. **Calidad:** Todo código debe ser robusto y tipado (TypeScript por defecto).
2. **Seguridad:** Nunca exponer credenciales (.env).
3. **Estilo:** Seguir principios SOLID y DRY.
`;
            await fs.writeFile(memPath, initial);
        }
    }

    static async recall(): Promise<string> {
        try {
            return await fs.readFile(path.join(PATHS.MEMORY, 'global_context.md'), 'utf8');
        } catch { return ""; }
    }
}