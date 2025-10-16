const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const juice = require('juice');
const sendEmail = async (options) => {
    const templatePath = path.join(__dirname, `../email_templates/${options.template}.html`);
    let html = fs.readFileSync(templatePath, 'utf-8');

    if (options.replacements) {
        Object.keys(options.replacements).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, options.replacements[key]);
        });
    }
    
    // 3. Convertir el CSS a estilos en línea
    const htmlWithInlineCss = juice(html);
    
    // 4. Configurar el transporter (igual que antes)
    const transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        secure: false,
    });

    // 5. Definir las opciones del correo
    const mailOptions = {
        from: '"ElectroShop" <noreply@electroshop.com>',
        to: options.email,
        subject: options.subject,
        html: htmlWithInlineCss // Usamos el HTML procesado
    };

    // 6. Enviar el correo
    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo con plantilla enviado exitosamente a:', options.email);
    } catch (error) {
        console.error('Error al enviar el correo con plantilla:', error);
    }
};

module.exports = sendEmail;