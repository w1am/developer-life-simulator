"use strict"

/** Prettify number using regex eg. 4500 becomes 4,500 */ 
export function formatNumber(number) {
  let x = String(Number(number));
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}