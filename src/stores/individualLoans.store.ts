import { defineStore } from 'pinia';
import { AmountsLoans, Loans } from '@/interfaces/individualLoans.interface';
import { apiAmountsLoans, apiLoans, apiDeleteLoan } from '@/servicesApi/individualLoans.service';
import { Payment } from '@/interfaces/utils/Payment.interface';

interface State {
  amounts_loans: AmountsLoans;
  loans: {
    data: Loans[];
    currentPage: number;
    totalPages: number;
    totalLoans: number;
  };
  statusLoans: Payment;
}
const useInvidualLoansStore = defineStore('individualLoansStore', {
  state: (): State => ({
    amounts_loans: {
      number_loans: 0,
      amount_borrow: 0,
      amount_interest: 0,
      amount_pay: 0,
      amount_charged: 0,
      amount_diff_total_charged: 0,
    },
    loans: {
      data: [],
      currentPage: 1,
      totalPages: 1,
      totalLoans: 0,
    },
    statusLoans: Payment.inprocess,
  }),
  getters: {
    getAmountsLoans(state) {
      return state.amounts_loans;
    },
    getLoans(state) {
      return state.loans.data;
    },
    getTotalPagesLoans(state) {
      return state.loans.totalPages;
    },
    getCurrentPageLoans(state) {
      return state.loans.currentPage;
    },
    getStatusLoans(state) {
      return state.statusLoans;
    },
  },
  actions: {
    setStatusLoans(status: Payment) {
      this.statusLoans = status;
    },
    setTotalPageLoans(pages: number) {
      this.loans.totalPages = pages;
    },

    setCurrentPageLoans(page: number) {
      this.loans.currentPage = page;
    },
    setLoan(loan: Loans) {
      this.loans.totalLoans++;
      if (this.loans.data.length == 20) {
        this.loans.data.pop();
      }
      this.loans.data.unshift(loan);
      this.loans.totalPages = Math.ceil(this.loans.totalLoans / 20);
    },
    async getApiAmountsLoans(id_beneficiary: number) {
      return await apiAmountsLoans(id_beneficiary)
        .then((response) => {
          const amounts = response.data.amounts_loans;
          this.amounts_loans = amounts;
          return Promise.resolve(amounts);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },

    async getApiLoans(
      id_beneficiary: number,
      page: number,
      search: string,
      status: Payment = Payment.inprocess
    ) {
      return await apiLoans(id_beneficiary, page, search, status)
        .then((response) => {
          const data = response.data.loans;
          this.loans.currentPage = data.current_page;
          this.loans.totalPages = data.last_page;
          this.loans.totalLoans = data.total;
          this.loans.data = data.data;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    async deleteLoans(id_borrow: number) {
      return await apiDeleteLoan(id_borrow)
        .then((response) => {
          const isDeleted = response.data.isDeleted;
          if (isDeleted) {
            this.loans.totalLoans--;
            const newData = [...this.loans.data].filter((item) => item.id_borrow !== id_borrow);
            this.loans.data = newData;
            if (this.loans.data.length == 0 && this.loans.totalPages > 1) {
              this.setCurrentPageLoans(1);
            }
          }
          return Promise.resolve(isDeleted);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
  },
});

export { useInvidualLoansStore };
