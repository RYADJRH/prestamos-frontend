import { Payment } from "./utils/Payment.interface"

interface PaymentsPayslip {
    id_payment: number,
    full_name: string,
    created_payment: string,
    amount_payment: number,
    amount_payment_decimal: number,
    state_payment: Payment
}

interface AddPayment {
    id_borrower: number,
    id_group_borrower: number,
    isSelected: boolean,
    full_name: string,
    amount_payment: number
}

export {
    PaymentsPayslip,
    AddPayment
}