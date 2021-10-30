function formatNumber(number) {
  let x = number.toString();
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}