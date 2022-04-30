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


export {
    Payslip,
    AddPayslip
}