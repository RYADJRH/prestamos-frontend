import {
  apiListShopping,
  apiDeleteShopping,
  apiSaveShopping,
  apiUpdateShopping,
} from "./../servicesApi/shopping.service";
import { defineStore } from "pinia";
import { State } from "@/interfaces/shopping.interface";
import { Shopping } from "../interfaces/shopping.interface";

export const useShoppingStore = defineStore("shopping", {
  state: (): State => ({
    currentPage: 1,
    totalPages: 1,
    shoppings: [],
    totalShoppings: 0,
  }),
  getters: {
    getShoppings: (state) => state.shoppings,
    getCurrentPage: (state) => state.currentPage,
    getTotalPages: (state) => state.totalPages,
  },
  actions: {
    setCurrentPage(page: number) {
      this.currentPage = page;
    },
    setTotalPage(pages: number) {
      this.totalPages = pages;
    },
    async getApiShopping(id_beneficiary: number, inputSearch: string) {
      return await apiListShopping(
        this.currentPage,
        id_beneficiary,
        inputSearch
      )
        .then((response) => {
          const data = response.data.shoppings;
          this.currentPage = data.current_page;
          this.totalPages = data.last_page;
          this.shoppings = data.data;
          return Promise.resolve(response);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    async deleteShopping(id: number) {
      return await apiDeleteShopping(id)
        .then((response) => {
          this.shoppings = [...this.shoppings].filter(
            (sh) => sh.id_shopping !== id
          );
          return Promise.resolve(response);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    async saveShopping(data: Shopping) {
      return await apiSaveShopping(data)
        .then((response) => {
          this.shoppings.push(response.data.shopping);

          return Promise.resolve(response);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    async updateShopping(data: Shopping) {
      return await apiUpdateShopping(data)
        .then((response) => {
          this.shoppings = [...this.shoppings].map((sh) => {
            if (sh.id_shopping == data.id) return response.data.shopping;
            return sh;
          });

          return Promise.resolve(response);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
  },
});
