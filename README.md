# 🐙 OctoArch v4.0 - Autonomous Orchestration Engine

**OctoArch** es un motor de orquestación autónoma local impulsado por **Google Gemini 2.5 Flash**. Diseñado para operar como un "Sistema Operativo Cognitivo", permite la administración de servidores, automatización de tareas y navegación web compleja a través de interfaces de lenguaje natural (Web Terminal y WhatsApp).

## 🚀 Estado Actual (v4.0 - Stable)

El sistema ha evolucionado de un chatbot a un **Agente Autónomo** con capacidad de ejecución real y autocorrección.

### 🧠 Arquitectura Cognitiva
* **Intelligence Core:** Motor basado en Gemini 2.5 Flash.
* **Bucle Cognitivo (Cognitive Loop):** El sistema no solo ejecuta herramientas, sino que *lee* sus propios resultados técnicos (logs, HTML, errores) y formula una respuesta final humana basada en esa evidencia.
* **Espejo Bilingüe:** Detecta automáticamente el idioma del usuario (Español/Inglés) y fuerza el pensamiento interno (`thought`) y la respuesta externa en ese mismo idioma.
* **Protocolo Anti-Alucinación:** Reglas estrictas en el Kernel que prohíben inventar datos. Si no puede usar una herramienta, reporta el error en lugar de simularlo.

### 🛡️ Seguridad y Roles (RBAC)
El sistema implementa un Firewall lógico basado en roles para proteger el host:

| Rol | Alias (WhatsApp) | Permisos | Descripción |
| :--- | :--- | :--- | :--- |
| **AUTO / DEV** | `dev`, `root` | ✅ Todo | Acceso total: Shell, Filesystem (Write), Browser. |
| **RESEARCHER** | `research` | 👁️ Solo Lectura | Navegación Web (Puppeteer) y Lectura de Archivos. **Bloquea** escritura y terminal. |
| **CHAT** | `chat`, `seguro` | ❌ Ninguno | Modo seguro. Solo conversación. Herramientas desactivadas. |

### 🛠️ Herramientas Integradas (Toolchain)
1.  **BrowserTool (`inspect`):** Navegación *headless* con Puppeteer. Optimizado con *Stealth Mode* y tiempos de espera extendidos (45s) para leer sitios pesados o con protección anti-bot.
2.  **ShellTool (`execute`):** Ejecución de comandos de terminal (npm, git, python, etc.).
3.  **FileTool (`read`/`create`):** Gestión completa del sistema de archivos local.

---

## 📱 Interfaz Remota (WhatsApp)

OctoArch incluye un servidor de WhatsApp (`whatsapp-web.js`) que actúa como canal de comando remoto seguro.

### Sintaxis de Comandos
El sistema utiliza un **Enrutador de Intenciones** basado en la primera palabra del mensaje:

`octo [ROL] [INSTRUCCIÓN]`

#### Ejemplos de uso:

* **Investigación Web (Segura):**
    > `octo research USA LA HERRAMIENTA BROWSER para inspeccionar zerohedge.com y resumir los titulares.`
    *(Nota: El sistema rechazará intentos de usar la terminal en este modo).*

* **Desarrollo / DevOps (Root):**
    > `octo dev crea un archivo en src/test.ts con un hola mundo.`

* **Chat Casual (Sin Riesgos):**
    > `octo chat dame una idea para una cena rápida.`

* **Modo Auto (Cuidado):**
    > `octo revisa el servidor.`
    *(Si no se especifica rol, asume permisos totales).*

---

## 💻 Instalación y Despliegue

### Requisitos
* Node.js v18+
* Google Gemini API Key
* Cuenta de WhatsApp (para vincular)

### Iniciar el Cerebro (Backend + WhatsApp)
```bash
npm install
npm run dev