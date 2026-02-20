import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

// Inicializar el cliente de WhatsApp con estrategia de autenticación local para persistencia de sesión
const client = new Client({
    authStrategy: new LocalAuth({ clientId: "octoarch-bot" })
});

// Evento 'qr': Se dispara cuando se genera un código QR para iniciar sesión
client.on('qr', (qr) => {
    console.log('QR RECIBIDO. Escanea este código con tu teléfono para iniciar sesión:');
    qrcode.generate(qr, { small: true });
});

// Evento 'ready': Se dispara cuando el cliente está listo y autenticado
client.on('ready', () => {
    console.log('¡Cliente de WhatsApp listo y conectado!');
});

// Evento 'authenticated': Se dispara después de una autenticación exitosa
client.on('authenticated', () => {
    console.log('¡Cliente autenticado con éxito!');
});

// Evento 'auth_failure': Se dispara si la autenticación falla
client.on('auth_failure', msg => {
    console.error('ERROR DE AUTENTICACIÓN', msg);
});

// Evento 'message': Se dispara cuando se recibe un mensaje
client.on('message', async message => {
    console.log(`Mensaje de ${message.from}: ${message.body}`);

    if (message.body === '!ping') {
        message.reply('pong');
    } else if (message.body === '!info') {
        let chat = await message.getChat();
        message.reply(`Este es el chat ${chat.name} (${chat.id._serialized}).`);
    } else if (message.body.startsWith('!echo ')) {
        const echoText = message.body.substring(6);
        message.reply(echoText);
    }
});

// Evento 'disconnected': Se dispara cuando el cliente se desconecta
client.on('disconnected', (reason) => {
    console.log('Cliente desconectado:', reason);
    // Opcional: Re-inicializar el cliente si la desconexión no es intencional
    // client.initialize();
});

// Iniciar el cliente de WhatsApp
client.initialize();
