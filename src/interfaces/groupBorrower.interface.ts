interface BorrowerAmounts {
    id_borrower: number,
    id_group: number,
    id_group_borrower: number,
    full_name: string,
    amount_borrow: number,
    amount_interest: number,
    amount_pay: number,
    amount_payment_total: number,
    state_borrow: string,
}

interface UpdateMember {
    id_group_borrower: number,
    amount_borrow: number,
    amount_interest: number
}
interface AddMember {
    id_borrower: number,
    slug_group: string,
    amount_borrow: number,
    amount_interest: number
}


export {
    BorrowerAmounts,
    AddMember,
    UpdateMember
}