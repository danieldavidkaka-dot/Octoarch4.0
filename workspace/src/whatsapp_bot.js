const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    // Genera y escanea este código con tu teléfono
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body.toLowerCase() === '!hola') {
        msg.reply('¡Hola! Soy OctoArch, tu asistente de IA. ¿En qué puedo ayudarte?');
    }
});

client.initialize();
