import axios from 'axios';
import { Borrower } from '@/interfaces/borrower.interface';
const PREFIX_API = import.meta.env.VITE_PREFIX_API;

const apiSaveBorrower = async (data: Borrower) => {
    const formData = new FormData();
    formData.append('name_borrower', data.name_borrower);
    formData.append('last_name_borrower', data.last_name_borrower);
    formData.append('id_beneficiary', data.id_beneficiary.toString());

    const name_ine_file = data.name_file_ine_borrower == null ? '' : data.name_file_ine_borrower;
    const name_file_proof_address = data.name_file_proof_address_borrower == null ? '' : data.name_file_proof_address_borrower;

    formData.append('name_file_ine_borrower', name_ine_file);
    formData.append('name_file_proof_address_borrower', name_file_proof_address);

    return await axios({
        method: 'POST',
        url: `${PREFIX_API}borrower`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

const apiGetBorrowers = async (id_beneficiary: number, page: number, search: string = '') => {
    return await axios.get(`${PREFIX_API}borrower/beneficiary/${id_beneficiary}?page=${page}&search=${search}`);
}

const apiDeleteBorrower = async (id_borrower: number) => {
    return await axios.delete(`${PREFIX_API}borrower/${id_borrower}`);
}

const apiUpdateBorrower = async (data: Borrower, id_borrower: number) => {
    const formData = new FormData();
    formData.append('name_borrower', data.name_borrower);
    formData.append('last_name_borrower', data.last_name_borrower);
    formData.append('id_beneficiary', data.id_beneficiary.toString());

    if (data.remove_file_ine_borrower) {
        formData.append('remove_file_ine_borrower', Number(data.remove_file_ine_borrower).toString());
    } else {
        const name_ine_file = data.name_file_ine_borrower == null ? '' : data.name_file_ine_borrower;
        formData.append('name_file_ine_borrower', name_ine_file);
    }

    if (data.remove_file_proof_address_borrower) {
        formData.append('remove_file_proof_address_borrower', Number(data.remove_file_proof_address_borrower).toString());
    } else {
        const name_file_proof_address = data.name_file_proof_address_borrower == null ? '' : data.name_file_proof_address_borrower;
        formData.append('name_file_proof_address_borrower', name_file_proof_address);
    }

    return await axios({
        method: 'POST',
        url: `${PREFIX_API}borrower/${id_borrower}`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

export {
    apiSaveBorrower,
    apiGetBorrowers,
    apiDeleteBorrower,
    apiUpdateBorrower
}