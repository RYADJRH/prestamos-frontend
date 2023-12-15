import { Payment } from './utils/Payment.interface';

interface AdjustPayment {
  id: number;
  before_amount: number;
  after_amount: number;
  date_adjust_payment: string;
  id_payment: number;
  created_at: string;
  updated_at: string;
  before_amount_decimal: number;
  after_amount_decimal: number;
}

interface Payments {
  id_payment: number;
  num_payment: number;
  date_payment: string;
  state_payment: Payment;
  amount_payment_period_decimal: number;
  remaining_balance_decimal: number;
  borrower: {
    id_borrower: number;
    name_borrower: string;
    last_name_borrower: string;
    slug: string;
    full_name: string;
  };
  adjust_payment: AdjustPayment[];
}

export { Payments, AdjustPayment };
