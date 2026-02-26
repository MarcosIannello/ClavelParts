export interface CreateOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  items: CreateOrderItem[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  notes?: string;
  total: number;
}

export interface OrderConfirmation {
  id: string;
  orderNumber: string;
  createdAt: string;
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<OrderConfirmation> {
  const now = new Date();
  const orderNumber = `CP-${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getTime().toString().slice(-5)}`;

  return Promise.resolve({
    id: `mock-order-${now.getTime()}`,
    orderNumber,
    createdAt: now.toISOString(),
  });
}

