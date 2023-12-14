import { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue';
import { defineStore } from 'pinia';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/vue/24/solid';

export type VariantAlert = 'success' | 'error' | 'warning' | 'info' | 'question';

const icons: Record<VariantAlert, FunctionalComponent<HTMLAttributes & VNodeProps, {}>> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationCircleIcon,
  info: InformationCircleIcon,
  question: QuestionMarkCircleIcon,
};

interface OptionsDefault {
  title?: string;
  description?: string;
  variant: VariantAlert;
  confirm?: boolean;
}

interface State {
  open: boolean;
  resolve: (value: boolean | PromiseLike<boolean>) => void;
  optionsDefault: OptionsDefault;
}

const useDialogStore = defineStore('dialog', {
  state: (): State => ({
    open: false,
    resolve: () => {},
    optionsDefault: {
      title: '',
      description: '',
      variant: 'success',
      confirm: false,
    },
  }),
  getters: {
    icon(state) {
      return icons[state.optionsDefault.variant];
    },
  },
  actions: {
    show(options?: OptionsDefault) {
      if (options) this.optionsDefault = options;
      this.open = true;
      return new Promise<boolean>((resolve, reject) => {
        this.resolve = resolve;
      });
    },
    confirm() {
      this.resolve(true);
      this.$reset();
    },
    cancel() {
      this.resolve(false);
      this.$reset();
    },
  },
});

export { useDialogStore };
