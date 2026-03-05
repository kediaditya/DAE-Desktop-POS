
export enum ViewState {
  LOGIN = 'LOGIN',
  POS_HOME = 'POS_HOME',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}

export enum MenuCategory {
  FUEL = 'FUEL',
  NON_FUEL = 'NON_FUEL',
  KEYPAD = 'KEYPAD',
  PAYMENT = 'PAYMENT',
  DATA = 'DATA',
  SYSTEM = 'SYSTEM'
}

export enum OverlayType {
  REFUND = 'REFUND',
  GIFT_CARD = 'GIFT_CARD',
  LAKALA_SCAN = 'LAKALA_SCAN',
  VOUCHER_SCAN = 'VOUCHER_SCAN',
  MEMBER_CHECK = 'MEMBER_CHECK',
  FUEL_UPDATE = 'FUEL_UPDATE',
  AUTHORIZATION = 'AUTHORIZATION',
  SETTLEMENT_CONFIRM = 'SETTLEMENT_CONFIRM',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  FUELING_STATUS = 'FUELING_STATUS',
  END_SHIFT = 'END_SHIFT',
  FIND_TRANSACTION = 'FIND_TRANSACTION'
}

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  isFuel?: boolean;
  pumpNo?: number;
}

export interface Transaction {
  id: string;
  date: string;
  cashier: string;
  posId: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Refunded';
}
