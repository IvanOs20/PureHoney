import { CONFIG } from './constants.js';

export class OrderState {
  #clientName = '';
  #quantity = 1;
  #deliveryMethod = 'domicilio';
  #deliveryDetail = '';
  #paymentMethod = 'efectivo';

  get clientName() {
    return this.#clientName;
  }

  set clientName(value) {
    this.#clientName = typeof value === 'string' ? value.trim() : '';
  }

  get quantity() {
    return this.#quantity;
  }

  set quantity(value) {
    const numeric = Number(value);
    this.#quantity = Number.isFinite(numeric) && numeric >= 1 ? Math.max(1, Math.floor(numeric)) : 1;
  }

  get deliveryMethod() {
    return this.#deliveryMethod;
  }

  set deliveryMethod(value) {
    const allowed = ['domicilio', 'sucursal'];
    this.#deliveryMethod = allowed.includes(value) ? value : 'domicilio';
  }

  get deliveryDetail() {
    return this.#deliveryDetail;
  }

  set deliveryDetail(value) {
    this.#deliveryDetail = typeof value === 'string' ? value.trim() : '';
  }

  get paymentMethod() {
    return this.#paymentMethod;
  }

  set paymentMethod(value) {
    const allowed = ['efectivo', 'transferencia'];
    this.#paymentMethod = allowed.includes(value) ? value : 'efectivo';
  }

  updateClientName(value) {
    this.clientName = value;
    return this;
  }

  updateQuantity(value) {
    this.quantity = value;
    return this;
  }

  updateDeliveryMethod(value) {
    this.deliveryMethod = value;
    return this;
  }

  updateDeliveryDetail(value) {
    this.deliveryDetail = value;
    return this;
  }

  updatePaymentMethod(value) {
    this.paymentMethod = value;
    return this;
  }

  calculateTotal() {
    return this.quantity * CONFIG.PRICE_PER_LITRE;
  }

  checkFreeShipping() {
    return (
      this.deliveryMethod === 'domicilio' &&
      this.quantity >= CONFIG.FREE_SHIPPING_THRESHOLD
    );
  }

  getMissingLitres() {
    if (this.deliveryMethod !== 'domicilio') {
      return CONFIG.FREE_SHIPPING_THRESHOLD;
    }

    return Math.max(0, CONFIG.FREE_SHIPPING_THRESHOLD - this.quantity);
  }
}

export const orderState = new OrderState();
