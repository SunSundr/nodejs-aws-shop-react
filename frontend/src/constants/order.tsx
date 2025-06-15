export enum OrderStatus {
  OPEN = 'OPEN',
  APPROVED = 'APPROVED',
  CONFIRMED = 'CONFIRMED',
  SENT = 'SENT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  // WAITING = 'WAITING',
}

export enum CartStatus {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
  CANCELLED = 'CANCELLED',
}

export const ORDER_STATUS_FLOW = Object.values(OrderStatus);
