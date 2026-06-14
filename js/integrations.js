import { CONFIG } from './constants.js';

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : String(value ?? '');
}

function buildWhatsAppMessage(orderData) {
  const nombre = normalizeText(orderData.nombre);
  const cantidad = Number(orderData.cantidad) || 0;
  const metodoEntrega = normalizeText(orderData.metodoEntrega);
  const detalleEntrega = normalizeText(orderData.detalleEntrega);
  const metodoPago = normalizeText(orderData.metodoPago);
  const total = Number(orderData.total) || 0;

  const envioGratisTag = cantidad >= CONFIG.FREE_SHIPPING_THRESHOLD ? ' (¡Aplica Envío Gratis!)' : '';
  const entregaLinea = metodoEntrega.toLowerCase() === 'domicilio'
    ? `🏠 *Dirección:* ${detalleEntrega}`
    : `🏪 *Ubicación:* ${detalleEntrega}`;

  let cierre = '';
  if (metodoPago.toLowerCase() === 'transferencia bancaria') {
    cierre = '*Quedo a la espera del costo de envío final y los datos de tu CLABE para realizar la transferencia y agendar mi entrega.*';
  } else {
    cierre = '*Pasaré a recoger mi pedido o esperaré mi entrega en el horario establecido. ¿Me confirman que tienen disponibilidad?*';
  }

  return `¡Hola Pure Honey! Quiero confirmar un pedido desde la página web. 🍯
👤 *Cliente:* ${nombre}
📦 *Cantidad:* ${cantidad} Litros de Miel
💰 *Total Miel:* $${total.toFixed(2)} MXN${envioGratisTag}
📍 *Entrega:* ${metodoEntrega}
${entregaLinea}
💳 *Método de Pago:* ${metodoPago}

${cierre}`;
}

export function formatAndSendWhatsApp(orderData) {
  const message = buildWhatsAppMessage(orderData);
  const text = encodeURIComponent(message);
  const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(CONFIG.WHATSAPP_PHONE)}&text=${text}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export async function postToFormspree(orderData) {
  try {
    const response = await fetch(CONFIG.FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    return response.ok;
  } catch (error) {
    console.error('Formspree request failed:', error);
    return false;
  }
}
