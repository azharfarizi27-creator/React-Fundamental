// Order status options
export const ORDER_STATUS = {
  PENDING: 'Pending',
  PREPARING: 'Preparing',
  READY: 'Ready',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_CONFIG = {
  Pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    badge: 'warning',
  },
  Preparing: {
    label: 'Preparing',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    badge: 'info',
  },
  Ready: {
    label: 'Ready to Serve',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    badge: 'secondary',
  },
  Completed: {
    label: 'Completed',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    badge: 'success',
  },
  Cancelled: {
    label: 'Cancelled',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    badge: 'danger',
  },
};

// Table status options
export const TABLE_STATUS = {
  AVAILABLE: 'Available',
  OCCUPIED: 'Occupied',
  RESERVED: 'Reserved',
};

export const TABLE_STATUS_CONFIG = {
  Available: {
    label: 'Available',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800',
    border: 'border-emerald-300',
  },
  Occupied: {
    label: 'Occupied',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    border: 'border-amber-300',
  },
  Reserved: {
    label: 'Reserved',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-800',
    border: 'border-indigo-300',
  },
};

// Order Types
export const ORDER_TYPES = {
  DINE_IN: 'DineIn',
  TAKE_AWAY: 'TakeAway',
};

// User Roles
export const ROLES = {
  ADMIN: 'Admin',
  CASHIER: 'Cashier',
};
