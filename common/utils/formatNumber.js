function formatNumber(number) {
  let x = String(Number(number));
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}