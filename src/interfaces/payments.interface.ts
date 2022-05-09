import { Payment } from "./utils/Payment.interface"

interface Payments {
    id_payment: number,
    num_payment: number,
    date_payment: string,
    state_payment: Payment,
    amount_payment_period_decimal: number,
    remaining_balance_decimal: number
    borrower: {
        id_borrower: number,
        name_borrower: string,
        last_name_borrower: string,
        slug: string,
        full_name: string
    },
    
}

export {
    Payments
}