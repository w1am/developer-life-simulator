"use strict";

/**
 *
 * Global variables that will be used often and never change
 *
 * */

import ITEMS from "../game/scripts/items.js";
import { Requirement } from "../game/scripts/models.js";

// Authentication
export const AUTHENTICATION_STORAGE = {
  ACCOUNTS: "accounts",
  AUTHENTICATED_USER: "authed_user",
};

// Shop menu tab section
export const TABS = {
  SERVER: "servers",
  DEVELOPER: "developers",
  ENTERTAINMENT: "entertainments",
};

// Related to javascript's localStorage object
export const STORAGE = {
  LAYOUT: "layout",
  BALANCE: "balance",
  ACTIVE_JOBS: "activeJobs",
  DEVELOPERS: "developers",
  TASKS: "tasks",
  OBJECTS: "objects",
  ASSETS: "assets",
  LEVEL_PROGRESS: "level_progress",
  LEVEL: "level",
  ACTIVE_JOBS_STORAGE_LIMIT: "activeJobsStorageLimit",
  TYPE: "type",
};

// Item type
export const TYPES = {
  PRODUCT: "product",
  DEVELOPER: "developer",
  JOB: "job",
  REQUIREMENT: "requirement",
};

// Sounds elements
export const SOUNDS = {
  START_JOB: "audio-start",
  CLAIM: "audio-claim",
  LEVEL_UP: "audio-level-up",
  COIN: "audio-coin",
  THREAT: "audio-threat",
};

// Images that are displayed when developers switch to active / working mode.
export const DISABLED_INVENTORY = {
  3: ITEMS.desk1Off,
  4: ITEMS.desk2Off,
  5: ITEMS.desk3Off,
  6: ITEMS.desk4Off,
  7: ITEMS.desk5Off,
  8: ITEMS.desk6Off,
};

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
  10: ITEMS.bordRoomImage,
  11: ITEMS.tableTennisImage,
};

export const WELCOME_MESSAGES = [
  "I can’t wait to be a part of your team",
  "Thank you very much for the opportunity",
  "I look forward to bringing my experience, skills and network of contacts to your company",
  "With my years of experience in this industry, I am confident that I can help your company expand",
];

// The first 5 levels are easy to advance. Earning points becomes harder as the player progresses
export const POINTS_REWARDS = {
  1: 10,
  2: 5,
  3: 2.5,
  4: 2,
  5: 1.25,
};

// The first 5 levels are easy to advance. Earning points becomes harder as the player progresses
export const COMPANY_TYPE = {
  1: "micro",
  2: "small",
  3: "medium",
  4: "large",
  5: "enterprise",
};

export const LANGUAGES = {
  PYTHON: new Requirement("Python", "PY", ["#173248", "white"]),
  JS: new Requirement("Javascript", "JS", ["#EAD41B", "#000000"]),
  SCALA: new Requirement("Scala", "Scala", ["#D12F2D", "#000000"]),
  JAVA: new Requirement("Java", "Java", ["#E97B18", "#4A738E"]),
  CPP: new Requirement("C++", "C++", ["#486694", "#f7f7f7"]),
  REACTJS: new Requirement("ReactJS", "ReactJS", ["#61DAFB", "#222222"]),
  SQL: new Requirement("SQL", "SQL", ["#F10000", "white"]),
  AWS: new Requirement("AWS", "AWS", ["#F79400", "#222E3C"])
}
