export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum Roles {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  BUYER = 'buyer',
  SELLER = 'seller',
  SUPPORT = 'support',
  MANAGER = 'manager',
  DELIVERY_AGENT = 'delivery',
}

export enum ProductStatus {
  EXISTS = 'exists',
  NOT_EXISTS = 'not exists',
}

export enum StoreStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  MAINTENANCE = 'maintenance',
  PAUSED = 'paused',
  INACTIVE = 'inactive',
}

export enum OrderStatus {
  COMPLETE = 'complete',
  FAILED = 'failed',
}
