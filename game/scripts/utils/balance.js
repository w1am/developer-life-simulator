"use strict"

import { animateValue, STORAGE } from "../../../common/index.js";
import { getAccountProperty, updateAccountProperty } from "../account.js";


/**
 * Update balance
 * 
 * @param {number | string}  newBalance
 */
export const updateBalance = function(newBalance) {
  const balanceAmountElement = document.getElementById("balance-amount");

  let balance = Number(getAccountProperty(STORAGE.BALANCE));
  let updateBalance = balance + Number(newBalance)

  updateAccountProperty(STORAGE.BALANCE, updateBalance);
  animateValue(balanceAmountElement, balance, Number(updateBalance), 1000);
}