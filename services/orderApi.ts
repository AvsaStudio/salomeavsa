type OrderStatus = "pending" | "paid" | "cancelled";

type PersistedOrderItem = {
  id: number;
  productName: string;
  size: "Small" | "Medium" | "Large";
  unitPrice: number;
  quantity: number;
  addOns: Array<{ id: number; name: string; price: number }>;
};

type PersistedOrder = {
  id: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: PersistedOrderItem[];
  accessToken?: string;
};

export type OrderCredentials = { id: string; accessToken: string };

export class OrderApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "OrderApiError";
  }
}

type OrderItemInput = {
  productName: string;
  size: "Small" | "Medium" | "Large";
  quantity?: number;
  addOns?: string[];
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new OrderApiError(
      body?.error ?? `Order request failed (${response.status})`,
      response.status
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function createOrder() {
  return request<PersistedOrder>("/api/orders", { method: "POST" });
}

function authenticatedOptions(accessToken: string, options?: RequestInit) {
  return {
    ...options,
    headers: { ...options?.headers, "X-Order-Token": accessToken },
  };
}

export function getOrder({ id, accessToken }: OrderCredentials) {
  return request<PersistedOrder>(
    `/api/orders/${id}`,
    authenticatedOptions(accessToken)
  );
}

export function updateOrderStatus(
  { id, accessToken }: OrderCredentials,
  status: OrderStatus
) {
  return request<PersistedOrder>(`/api/orders/${id}`, authenticatedOptions(accessToken, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  }));
}

export function deleteOrder({ id, accessToken }: OrderCredentials) {
  return request<void>(
    `/api/orders/${id}`,
    authenticatedOptions(accessToken, { method: "DELETE" })
  );
}

export function addOrderItem(
  { id, accessToken }: OrderCredentials,
  item: OrderItemInput
) {
  return request<PersistedOrder>(`/api/orders/${id}/items`, authenticatedOptions(accessToken, {
    method: "POST",
    body: JSON.stringify({ quantity: 1, addOns: [], ...item }),
  }));
}

export function updateOrderItem(
  { id, accessToken }: OrderCredentials,
  itemId: number,
  item: OrderItemInput
) {
  return request<PersistedOrder>(
    `/api/orders/${id}/items/${itemId}`,
    authenticatedOptions(accessToken, {
      method: "PATCH",
      body: JSON.stringify({ quantity: 1, addOns: [], ...item }),
    })
  );
}

export function removeOrderItem(
  { id, accessToken }: OrderCredentials,
  itemId: number
) {
  return request<PersistedOrder>(
    `/api/orders/${id}/items/${itemId}`,
    authenticatedOptions(accessToken, { method: "DELETE" })
  );
}
