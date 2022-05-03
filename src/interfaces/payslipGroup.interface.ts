interface Payslip {
    id_payslip: number,
    name_payslip: string,
    created_payslip: string,
    slug: string,
}

interface AddPayslip {
    name_payslip: string,
    created_payslip: string,
    slug_group: string
}

interface PayslipPayments {
    id_payslip: number,
    name_payslip: string,
    created_payslip: string,
    slug: string,
    slug_group: string
    number_payments: number,
    amount_payments: number
}



export {
    Payslip,
    AddPayslip,
    PayslipPayments,
}