import axios from "axios";
import { Shopping } from "../interfaces/shopping.interface";
const PREFIX_API = import.meta.env.VITE_PREFIX_API;

export const apiListShopping = async (
  currentPage: number,
  id_beneficiary: number,
  inputSearch: string
) => {
  return await axios.get(`${PREFIX_API}shopping/beneficiary/${id_beneficiary}`);
};

export const apiDeleteShopping = async (id: number) => {
  return await axios.delete(`${PREFIX_API}shopping/${id}`);
};

export const apiSaveShopping = async (data: Shopping) => {
  return await axios.post(`${PREFIX_API}shopping`, data);
};

export const apiUpdateShopping = async (data: Shopping) => {
  return await axios.patch(`${PREFIX_API}shopping/${data.id}`, data);
};
