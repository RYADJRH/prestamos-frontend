const moneyMxn = (currency: number = 0) => {
  return '$ ' + currency.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
};

export { moneyMxn };
