# Bot de WhatsApp (`auth_wa`)

Un bot básico de WhatsApp diseñado para demostrar la integración con la plataforma de WhatsApp utilizando la biblioteca `whatsapp-web.js`. Este proyecto sirve como punto de partida para construir funcionalidades de automatización e interacción más complejas.

## Características

-   **Autenticación por Código QR**: Inicia sesión fácilmente escaneando un código QR con tu aplicación de WhatsApp.
-   **Gestión de Sesiones**: Sesiones persistentes para no tener que volver a autenticarte con frecuencia.
-   **Manejo Básico de Mensajes**: Responde a comandos simples como `!ping`, `!info` y `!echo <texto>`.

## Instalación

Para empezar con el bot, sigue estos pasos:

1.  **Navega al directorio del proyecto `auth_wa`**:
    ```bash
    cd auth_wa
    ```

2.  **Inicializa un proyecto npm (si aún no existe) e instala las dependencias**:
    ```bash
    npm init -y
    npm install whatsapp-web.js qrcode-terminal
    # Si utilizas TypeScript, también necesitarás los siguientes:
    npm install -D typescript ts-node @types/node
    ```

3.  **Configura TypeScript (si lo usas):**
    Crea un archivo `tsconfig.json` en la raíz del proyecto con la siguiente configuración:
    ```json
    {
      "compilerOptions": {
        "target": "es2016",
        "module": "commonjs",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true,
        "outDir": "./dist"
      },
      "include": ["src/**/*.ts"],
      "exclude": ["node_modules"]
    }
    ```

## Uso

1.  **Inicia el bot**:

    *   **Para TypeScript (recomendado para desarrollo):**
        ```bash
        npx ts-node src/whatsapp_bot.ts
        ```

    *   **Para JavaScript (después de compilar TypeScript):**
        ```bash
        npx tsc # Compila los archivos TypeScript a JavaScript
        node dist/whatsapp_bot.js # Ejecuta el archivo JavaScript compilado
        ```

2.  **Escanea el Código QR**: Un código QR aparecerá en tu terminal. Escanéalo usando la aplicación de WhatsApp de tu teléfono (Ajustes > Dispositivos vinculados > Vincular un dispositivo).

3.  **Interactúa**: Una vez conectado, el bot estará listo. Prueba a enviar `!ping`, `!info` o `!echo Hola Octoarch` al chat del bot.

## Estructura del Proyecto

```
auth_wa/
├── src/
│   └── whatsapp_bot.ts      # Lógica principal del bot
├── README.md                # Documentación del proyecto
├── package.json             # Dependencias del proyecto y scripts
├── package-lock.json        # Bloqueo de versiones de dependencias
└── tsconfig.json            # Configuración de TypeScript (si aplica)
└── .wwebjs_auth/            # Directorio para la sesión persistente del bot
```

## Contribuciones

¡Las contribuciones son bienvenidas! No dudes en abrir issues o enviar pull requests.

## Licencia

Este proyecto está bajo la licencia [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html). Consulta el archivo `LICENSE` (si existe) para más detalles.