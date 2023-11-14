import { TypePeriod } from '@/interfaces/utils/TypePeriodsLoans.interface';

interface BorrowerAddLoans {
    id_borrower: number,
    name_borrower: string,
    last_name_borrower: string,
    slug: string,
    full_name: string
}

interface CalculatedAmortizationLoans {
    amount_borrow: number,
    amount_interest: number,
    amount_payment_period: number,
    date_init_payment: string,
    type_period: TypePeriod,
    payment_every_n: number
}
interface AmortizationLoans {
    num_payment: number,
    date_payment: string,
    amount_payment_period: number,
    remaining_balance: number
}

interface AddLoans {
    id_borrower: number,
    amount_borrow: number,
    amount_interest: number,
    amount_payment_period: number,
    date_init_payment: string,
    type_period: TypePeriod,
    payment_every_n: number
}

interface AmountsLoans {
  number_loans: number;
  amount_borrow: number;
  amount_interest: number;
  amount_pay: number;
  amount_charged: number;
  amount_diff_total_charged:number;
}

interface Loans {
  id_borrow: number;
  id_borrower: number;
  full_name: string;
  slug: string;
  amount_borrow: number;
  amount_interest: number;
  amount_pay: number;
  amount_payment_total: number;
  amount_diff_total_charged:number;
  number_payments: string;
  state_borrow: string;
}


export {
    AddLoans,
    BorrowerAddLoans,
    AmortizationLoans,
    CalculatedAmortizationLoans,
    AmountsLoans,
    Loans
}