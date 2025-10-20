// Ejemplo para PrivacyPolicyPage.jsx
import React from 'react';

function PrivacyPolicyPage() {
  return (
   <div className="container mx-auto p-8 bg-white shadow-md my-8 rounded-lg">
  <h1 className="text-3xl font-bold mb-6 border-b pb-4">Política de Tratamiento de Datos Personales (Política de Privacidad)</h1>
  <div className="prose max-w-none">

    <p><strong>Última actualización:</strong> 18 de Octubre de 2025</p>

    <p>Bienvenido a [Nombre de tu Tienda]. Tu privacidad es muy importante para nosotros. Esta Política describe cómo [Nombre de tu Tienda] ("nosotros", "nuestro") recopila, utiliza, almacena y protege tu información personal, en cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas concordantes en Colombia.</p>

    <h2>1. Responsable del Tratamiento</h2>
    <p>El responsable del tratamiento de tus datos personales es [Tu Nombre Completo o Razón Social], identificado con [Tu Cédula o NIT si aplica], con domicilio en [Tu Ciudad, ej: Bogotá D.C.], correo electrónico de contacto: [Tu Correo Electrónico de Contacto] y teléfono [Tu Número de Teléfono si aplica].</p>

    <h2>2. Información que Recopilamos</h2>
    <p>Recolectamos información personal que tú nos proporcionas directamente al realizar una compra o interactuar con nuestro sitio web, incluyendo, pero no limitándose a:</p>
    <ul>
      <li>Nombre completo</li>
      <li>Dirección de correo electrónico</li>
      <li>Número de teléfono</li>
      <li>Dirección de envío (incluyendo ciudad y departamento)</li>
      <li>Información relacionada con tus compras (productos, historial)</li>
    </ul>
    <p>No recopilamos ni almacenamos directamente información financiera sensible como números completos de tarjetas de crédito. Los pagos son procesados a través de pasarelas de pago seguras (ej. Mercado Pago) que cumplen con sus propias políticas de privacidad.</p>

    <h2>3. Finalidad del Tratamiento</h2>
    <p>Utilizamos tu información personal para las siguientes finalidades:</p>
    <ul>
      <li>Procesar y gestionar tus pedidos (facturación, envío, entrega).</li>
      <li>Comunicarnos contigo sobre el estado de tu pedido, consultas o soporte.</li>
      <li>Cumplir con obligaciones legales y fiscales colombianas.</li>
      <li>Prevenir fraudes y garantizar la seguridad de las transacciones.</li>
      <li>Mejorar nuestros productos, servicios y la experiencia en nuestro sitio web.</li>
      <li>(Opcional, si pides consentimiento explícito) Enviarte información promocional o newsletters sobre nuestros productos, si has aceptado recibirlas.</li>
    </ul>

    <h2>4. Derechos del Titular (Habeas Data)</h2>
    <p>Como titular de tus datos personales, tienes los siguientes derechos, de acuerdo con la Ley 1581 de 2012:</p>
    <ul>
      <li><strong>Conocer, actualizar y rectificar</strong> tus datos personales.</li>
      <li><strong>Solicitar prueba</strong> de la autorización otorgada para el tratamiento (salvo excepciones legales).</li>
      <li><strong>Ser informado</strong> sobre el uso que se le ha dado a tus datos personales.</li>
      <li><strong>Presentar quejas</strong> ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley de protección de datos.</li>
      <li><strong>Revocar la autorización</strong> y/o solicitar la supresión de tus datos cuando no se respeten los principios, derechos y garantías constitucionales y legales.</li>
      <li><strong>Acceder en forma gratuita</strong> a tus datos personales que hayan sido objeto de tratamiento.</li>
    </ul>
    <p>Puedes ejercer estos derechos enviando una solicitud clara y detallada a nuestro correo electrónico de contacto: [Tu Correo Electrónico de Contacto]. Responderemos a tu solicitud en los términos establecidos por la ley.</p>

    <h2>5. Transferencia y Transmisión de Datos</h2>
    <p>Compartimos tu información personal únicamente con terceros necesarios para cumplir con las finalidades descritas, tales como:</p>
    <ul>
      <li>Empresas de transporte para realizar el envío de tus productos.</li>
      <li>Pasarelas de pago (ej. Mercado Pago) para procesar tu pago de forma segura.</li>
      <li>Autoridades competentes cuando sea requerido por ley.</li>
    </ul>
    <p>Nos aseguramos de que estos terceros cumplan con estándares adecuados de protección de datos.</p>

    <h2>6. Seguridad de la Información</h2>
    <p>Implementamos medidas técnicas, humanas y administrativas razonables para proteger tu información personal contra acceso no autorizado, alteración, pérdida o destrucción. Sin embargo, ninguna transmisión por Internet o sistema de almacenamiento es 100% seguro.</p>

    <h2>7. Uso de Cookies</h2>
    <p>Nuestro sitio web puede utilizar cookies (pequeños archivos de texto) para mejorar tu experiencia de navegación, recordar tus preferencias (como el contenido de tu carrito) y analizar el tráfico del sitio. Puedes configurar tu navegador para rechazar las cookies, aunque esto podría afectar la funcionalidad del sitio.</p>

    <h2>8. Vigencia y Modificaciones</h2>
    <p>Tus datos personales serán tratados durante el tiempo necesario para cumplir con las finalidades para las cuales fueron recolectados y para cumplir con requisitos legales o contractuales. Esta Política de Privacidad está vigente a partir de la fecha de última actualización. Nos reservamos el derecho de modificarla en cualquier momento. Cualquier cambio será publicado en nuestro sitio web.</p>

    <h2>9. Contacto</h2>
    <p>Si tienes alguna pregunta sobre esta Política de Privacidad o el tratamiento de tus datos, por favor contáctanos a través de [Tu Correo Electrónico de Contacto].</p>
    <p>Para más información sobre la protección de datos en Colombia, puedes consultar el sitio web de la Superintendencia de Industria y Comercio (SIC).</p>

  </div>
</div>
  );
}
export default PrivacyPolicyPage;