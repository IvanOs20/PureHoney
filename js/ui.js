export function updateStepper(inputEl, quantity) {
  if (!(inputEl instanceof HTMLInputElement)) {
    return;
  }

  const value = Number(quantity);
  inputEl.value = Number.isFinite(value) && value >= 1 ? String(Math.max(1, Math.floor(value))) : '1';
}

export function toggleSegmentedControl(activeBtn, inactiveBtn) {
  if (!(activeBtn instanceof HTMLElement) || !(inactiveBtn instanceof HTMLElement)) {
    return;
  }

  activeBtn.classList.remove('bg-zinc-100', 'text-zinc-700');
  activeBtn.classList.add('bg-amber-500', 'text-white', 'shadow-sm', 'transition-all', 'duration-300');

  inactiveBtn.classList.remove('bg-amber-500', 'text-white', 'shadow-sm');
  inactiveBtn.classList.add('bg-zinc-100', 'text-zinc-700', 'transition-all', 'duration-300');
}

export function toggleContainers(deliveryMethod, addressDiv, sucursalDiv) {
  if (!(addressDiv instanceof HTMLElement) || !(sucursalDiv instanceof HTMLElement)) {
    return;
  }

  const isDomicilio = deliveryMethod === 'domicilio';

  if (isDomicilio) {
    addressDiv.classList.remove('hidden');
    sucursalDiv.classList.add('hidden');
  } else {
    addressDiv.classList.add('hidden');
    sucursalDiv.classList.remove('hidden');
  }
}

export function renderShippingAlert(alertDiv, isDomicilio, isFree, missingLitres) {
  if (!(alertDiv instanceof HTMLElement)) {
    return;
  }

  if (!isDomicilio) {
    alertDiv.innerHTML = '';
    alertDiv.classList.add('hidden');
    return;
  }

  alertDiv.classList.remove('hidden');

  if (isFree) {
    alertDiv.innerHTML = `
      <div class="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">
        ¡Envío gratis activado! Tu compra alcanza el mínimo de ${missingLitres === 0 ? 'envío gratuito' : 'envío gratis'}.
      </div>
    `;
    return;
  }

  alertDiv.innerHTML = `
    <div class="rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
      Suma ${missingLitres} litro${missingLitres === 1 ? '' : 's'} más para envío gratis a domicilio.
    </div>
  `;
}
