"use strict"

import { AUTHENTICATION_STORAGE, customStorage } from "../../common/index.js";
import { AUTHENTICATED_USER } from "../../game/scripts/main.js";

/**
 * Get and Update user account properties
 * 
 * @param {string} field - account object property key field
 * @param {any} newValue - updated value
*/
export function updateAccountProperty(field, newValue) {
  let accounts = customStorage.getter({}, AUTHENTICATION_STORAGE.ACCOUNTS);
  accounts[AUTHENTICATED_USER][field] = newValue;
  customStorage.setter(AUTHENTICATION_STORAGE.ACCOUNTS, accounts);
}

/**
 * Get an account property
 * 
 * @param {string} field - account object property key field
*/
export function getAccountProperty(field) {
  let accounts = customStorage.getter({}, AUTHENTICATION_STORAGE.ACCOUNTS);
  return accounts[AUTHENTICATED_USER][field];
}