"use strict"

/**
 * 
 * Global variables that will be used often and never change
 * 
 * */ 

import ITEMS from '../game/scripts/items.js'

// Authentication
export const AUTHENTICATION_STORAGE = {
  ACCOUNTS: 'accounts',
  AUTHENTICATED_USER: 'authed_user',
}

// Shop menu tab section
export const TABS = {
  SERVER: 'servers',
  DEVELOPER: 'developers',
  ENTERTAINMENT: 'entertainments',
  SERVICE: 'services'
}

// Related to javascript's localStorage object
export const STORAGE = {
  LAYOUT: 'layout',
  BALANCE: 'balance',
  ACTIVE_JOBS: 'activeJobs',
  DEVELOPERS: 'developers',
  TASKS: 'tasks',
  OBJECTS: 'objects',
  ASSETS: 'assets',
  LEVEL_PROGRESS: 'level_progress',
  LEVEL: 'level'
}

// Item type
export const TYPES = {
  PRODUCT: 'product',
  DEVELOPER: 'developer',
  JOB: 'job',
  REQUIREMENT: 'requirement',
}

// Sounds elements
export const SOUNDS = {
  START_JOB: 'audio-start',
  CLAIM: 'audio-claim',
  LEVEL_UP: 'audio-level-up',
  COIN: 'audio-coin',
  THREAT: 'audio-threat',
}

// Images that are displayed when developers switch to active / working mode. 
export const DISABLED_INVENTORY = {
  3: ITEMS.desk1Off,
  4: ITEMS.desk2Off,
  5: ITEMS.desk3Off,
  6: ITEMS.desk4Off,
  7: ITEMS.desk5Off,
  8: ITEMS.desk6Off,
}

// Products
export const INVENTORY = {
  0: ITEMS.amazonServer,
  1: ITEMS.azureServer,
  2: ITEMS.firebaseServer,
  3: ITEMS.desk1,
  4: ITEMS.desk2,
  5: ITEMS.desk3,
  6: ITEMS.desk4,
  7: ITEMS.desk5,
  8: ITEMS.desk6,
  9: ITEMS.cafeImage,
  10: ITEMS.bordRoomImage
}