interface groupResponse {
    id_group: number,
    name_group: string,
    created_group: Date,
    day_payment_name: string,
    id_beneficiary: number,
    state_archived_group: boolean
}

interface groupSend {
    name_group: string,
    created_group: Date,
    id_beneficiary: number,
}

export {
    groupResponse,
    groupSend
}