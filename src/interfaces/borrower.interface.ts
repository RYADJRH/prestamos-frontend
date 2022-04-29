interface Borrower {
    name_borrower: string,
    last_name_borrower: string,
    name_file_ine_borrower: File | null,
    name_file_proof_address_borrower: File | null,
    name_file_ine_borrower_path: string | null,
    name_file_proof_address_borrower_path: string | null,
    remove_file_ine_borrower: boolean,
    remove_file_proof_address_borrower: boolean
    id_beneficiary: number
}

interface BorrrowerRequest {
    id_borrower: number,
    name_borrower: string,
    last_name_borrower: string,
    full_name: string,
    name_file_ine_borrower_path?: string | null,
    name_file_proof_address_borrower_path?: string | null,
    id_beneficiary: number
}

interface BorrowerGroupResponse {
    id_borrower: number,
    name_borrower: string,
    last_name_borrower: string,
    full_name: string,
    agregado: boolean
}


export {
    Borrower,
    BorrrowerRequest,
    BorrowerGroupResponse
}