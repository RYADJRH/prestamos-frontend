import { defineStore } from 'pinia';
import { Errors, Message } from '@/interfaces/errors.interface';

interface State {
    message: Message,
    errors: Errors
}

export const useErrorStore = defineStore('error',
    {
        state: (): State => ({
            message: null,
            errors: {}
        })
    })