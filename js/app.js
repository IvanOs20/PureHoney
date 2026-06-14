import { orderState } from './state.js';
import { updateStepper, toggleSegmentedControl, toggleContainers, renderShippingAlert } from './ui.js';
import { formatAndSendWhatsApp, postToFormspree } from './integrations.js';

const SELECTORS = {
  clientName: '#client-name',
  clientPhone: '#client-phone',
  quantityInput: '#quantity-input',
  decreaseButton: 'button[aria-label="Restar litros"]',
  increaseButton: 'button[aria-label="Sumar litros"]',
  btnDomicilio: '#btn-domicilio',
  btnSucursal: '#btn-sucursal',
  addressContainer: '#address-container',
  sucursalContainer: '#sucursal-container',
  clientAddress: '#client-address',
  sucursalSelect: '#sucursal-select',
  shippingAlert: '#shipping-alert',
  paymentEfectivo: '#payment-efectivo',
  paymentTransferencia: '#payment-transferencia',
  btnWhatsApp: '#btn-whatsapp',
  btnEmail: '#btn-email',
};

function query(selector) {
  return document.querySelector(selector);
}

function getSelectedSucursalText(selectElement) {
  return selectElement?.options[selectElement.selectedIndex]?.text?.trim() || '';
}

function buildOrderData() {
  const nombre = clientNameInput.value.trim();
  const telefono = clientPhoneInput.value.replace(/\D/g, '').trim();
  const cantidad = orderState.quantity;
  const metodoEntrega = orderState.deliveryMethod === 'domicilio' ? 'Domicilio' : 'Sucursal';
  const detalleEntrega = orderState.deliveryMethod === 'domicilio'
    ? clientAddress.value.trim()
    : getSelectedSucursalText(sucursalSelect);
  const metodoPago = orderState.paymentMethod === 'transferencia' ? 'Transferencia Bancaria' : 'Efectivo';
  const total = orderState.calculateTotal();

  return {
    nombre,
    telefono,
    cantidad,
    metodoEntrega,
    detalleEntrega,
    metodoPago,
    total,
  };
}

function validateForm() {
  const nombre = clientNameInput.value.trim();
  if (!nombre) {
    alert('Por favor ingresa tu nombre antes de continuar.');
    return false;
  }

  const telefono = clientPhoneInput.value.replace(/\D/g, '').trim();
  if (telefono.length !== 10) {
    alert('Por favor ingresa un teléfono válido de 10 dígitos.');
    return false;
  }

  if (orderState.deliveryMethod === 'domicilio') {
    const direccion = clientAddress.value.trim();
    if (!direccion) {
      alert('Por favor escribe la dirección de entrega para domicilio.');
      return false;
    }
  }

  return true;
}

// ✅ NUEVO: Función para limpiar el formulario y restablecer el estado original
function resetForm() {
  // Limpiar inputs de texto
  clientNameInput.value = '';
  clientPhoneInput.value = '';
  if (clientAddress) clientAddress.value = '';
  if (sucursalSelect) sucursalSelect.selectedIndex = 0;

  // Restablecer el estado lógico interno
  orderState.updateQuantity(1);
  orderState.updateDeliveryMethod('domicilio');
  orderState.updatePaymentMethod('efectivo');

  // Sincronizar y refrescar la interfaz visual
  updateStepper(quantityInput, orderState.quantity);
  updateDeliveryUI();
  updatePaymentUI();
}

function updateDeliveryUI() {
  const deliveryMethod = orderState.deliveryMethod;
  toggleContainers(deliveryMethod, addressContainer, sucursalContainer);
  toggleSegmentedControl(
    deliveryMethod === 'domicilio' ? btnDomicilio : btnSucursal,
    deliveryMethod === 'domicilio' ? btnSucursal : btnDomicilio
  );
  renderShippingAlert(shippingAlert, deliveryMethod === 'domicilio', orderState.checkFreeShipping(), orderState.getMissingLitres());
}

function updatePaymentUI() {
  toggleSegmentedControl(
    orderState.paymentMethod === 'transferencia' ? paymentTransferencia : paymentEfectivo,
    orderState.paymentMethod === 'transferencia' ? paymentEfectivo : paymentTransferencia
  );
}

function updateQuantity(value) {
  orderState.updateQuantity(value);
  updateStepper(quantityInput, orderState.quantity);
  renderShippingAlert(shippingAlert, orderState.deliveryMethod === 'domicilio', orderState.checkFreeShipping(), orderState.getMissingLitres());
}

// ✅ OPTIMIZADO: Ahora incluye un botón de acción para realizar un nuevo pedido sin recargar a mano
function renderConfirmation(orderData) {
  const confirmationHtml = `
    <div class="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm animate-fade-in">
      <p class="text-lg font-semibold">¡Pedido confirmado!</p>
      <p class="mt-3 text-sm leading-6 text-zinc-700">Tu orden ha sido enviada correctamente y pronto nos pondremos en contacto.</p>
      <div class="mt-5 space-y-3 text-sm text-zinc-700 border-t border-emerald-200/50 pt-4">
        <p><span class="font-semibold text-zinc-900">Cliente:</span> ${orderData.nombre}</p>
        <p><span class="font-semibold text-zinc-900">Teléfono:</span> ${orderData.telefono}</p>
        <p><span class="font-semibold text-zinc-900">Cantidad:</span> ${orderData.cantidad} Litros</p>
        <p><span class="font-semibold text-zinc-900">Entrega:</span> ${orderData.metodoEntrega}</p>
        <p><span class="font-semibold text-zinc-900">Detalle:</span> ${orderData.detalleEntrega}</p>
        <p><span class="font-semibold text-zinc-900">Pago:</span> ${orderData.metodoPago}</p>
        <p><span class="font-semibold text-zinc-900">Total:</span> $${orderData.total.toFixed(2)} MXN</p>
      </div>
      <button id="btn-order-again" type="button" class="mt-6 w-full bg-zinc-900 text-white text-sm font-medium p-3 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer text-center">
        Hacer otro pedido 
      </button>
    </div>
  `;

  formElement.innerHTML = confirmationHtml;

  // Escuchar el clic del nuevo botón para restablecer la aplicación por completo
  document.getElementById('btn-order-again').addEventListener('click', () => {
    window.location.reload(); // Recarga limpia: vacía memoria de módulos y restaura el formulario HTML original
  });
}

let clientNameInput;
let clientPhoneInput;
let quantityInput;
let decreaseButton;
let increaseButton;
let btnDomicilio;
let btnSucursal;
let addressContainer;
let sucursalContainer;
let clientAddress;
let sucursalSelect;
let shippingAlert;
let paymentEfectivo;
let paymentTransferencia;
let btnWhatsApp;
let btnEmail;
let formElement;

globalThis.addEventListener('DOMContentLoaded', () => {
  clientNameInput = query(SELECTORS.clientName);
  quantityInput = query(SELECTORS.quantityInput);
  decreaseButton = query(SELECTORS.decreaseButton);
  increaseButton = query(SELECTORS.increaseButton);
  btnDomicilio = query(SELECTORS.btnDomicilio);
  btnSucursal = query(SELECTORS.btnSucursal);
  addressContainer = query(SELECTORS.addressContainer);
  sucursalContainer = query(SELECTORS.sucursalContainer);
  clientAddress = query(SELECTORS.clientAddress);
  clientPhoneInput = query(SELECTORS.clientPhone);
  sucursalSelect = query(SELECTORS.sucursalSelect);
  shippingAlert = query(SELECTORS.shippingAlert);
  paymentEfectivo = query(SELECTORS.paymentEfectivo);
  paymentTransferencia = query(SELECTORS.paymentTransferencia);
  btnWhatsApp = query(SELECTORS.btnWhatsApp);
  btnEmail = query(SELECTORS.btnEmail);
  formElement = query('form');

  if (!formElement || !clientNameInput || !clientPhoneInput || !quantityInput || !btnDomicilio || !btnSucursal || !shippingAlert || !paymentEfectivo || !paymentTransferencia || !btnWhatsApp || !btnEmail) {
    console.error("Error: Algunos elementos esenciales del DOM no se encontraron en index.html.");
    return;
  }

  updateStepper(quantityInput, orderState.quantity);
  updateDeliveryUI();
  updatePaymentUI();

  decreaseButton.addEventListener('click', () => {
    updateQuantity(orderState.quantity - 1);
  });

  increaseButton.addEventListener('click', () => {
    updateQuantity(orderState.quantity + 1);
  });

  quantityInput.addEventListener('input', () => {
    updateQuantity(parseInt(quantityInput.value) || 1);
  });

  btnDomicilio.addEventListener('click', () => {
    orderState.updateDeliveryMethod('domicilio');
    updateDeliveryUI();
  });

  btnSucursal.addEventListener('click', () => {
    orderState.updateDeliveryMethod('sucursal');
    updateDeliveryUI();
  });

  sucursalSelect.addEventListener('change', () => {
    if (orderState.deliveryMethod === 'sucursal') {
      orderState.updateDeliveryDetail(getSelectedSucursalText(sucursalSelect));
    }
  });

  paymentEfectivo.addEventListener('click', () => {
    orderState.updatePaymentMethod('efectivo');
    updatePaymentUI();
  });

  paymentTransferencia.addEventListener('click', () => {
    orderState.updatePaymentMethod('transferencia');
    updatePaymentUI();
  });

  btnWhatsApp.addEventListener('click', () => {
    if (!validateForm()) {
      return;
    }

    orderState.updateClientName(clientNameInput.value.trim());
    if (orderState.deliveryMethod === 'domicilio') {
      orderState.updateDeliveryDetail(clientAddress.value.trim());
    } else {
      orderState.updateDeliveryDetail(getSelectedSucursalText(sucursalSelect));
    }

    const orderData = buildOrderData();
    formatAndSendWhatsApp(orderData);
    
    // ✅ CORREGIDO: Limpia el formulario inmediatamente después de abrir WhatsApp
    resetForm(); 
  });

  btnEmail.addEventListener('click', async () => {
    if (!validateForm()) {
      return;
    }

    orderState.updateClientName(clientNameInput.value.trim());
    if (orderState.deliveryMethod === 'domicilio') {
      orderState.updateDeliveryDetail(clientAddress.value.trim());
    } else {
      orderState.updateDeliveryDetail(getSelectedSucursalText(sucursalSelect));
    }

    const orderData = buildOrderData();
    btnEmail.disabled = true;
    btnEmail.textContent = 'Enviando...';

    const success = await postToFormspree(orderData);

    btnEmail.disabled = false;
    btnEmail.textContent = 'Correo';

    if (success) {
      renderConfirmation(orderData); // ✅ Llama a la UI optimizada con el botón de reinicio
    } else {
      alert('No se pudo enviar el pedido por correo. Intenta nuevamente más tarde.');
    }
  });
});