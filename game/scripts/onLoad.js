"use strict";

/**
 *
 * Initialize game with level / balance / items
 *
 */

import { customStorage, DISABLED_INVENTORY, INVENTORY, STORAGE, formatNumber, LANGUAGES } from "../../common/index.js";
import { Job } from "./models.js";
import { getAccountProperty } from "./account.js";
import { updateLevel, drawImage } from "./utils/index.js";
import { objectsCtx } from "./main.js";

const { AWS, CPP, JAVA, JS, PYTHON, REACTJS, SCALA, SQL } = LANGUAGES;

// On mount. load available tasks/jobs
customStorage.setter(STORAGE.TASKS, {
  0: new Job(0, "Coffee review Website", 10000, "frestea", 0.1, [PYTHON, JS], 2),
  1: new Job(1, "Ecommerce Website", 45000, "econovu", 0.1, [JS], 4),
  2: new Job(2, "Alt coin trading platform", 75000, "traderex", 0.1, [SCALA, JAVA], 4),
  3: new Job(3, "Game for the Metaverse", 120000, "meta", 0.1, [PYTHON, CPP], 2),
  4: new Job(4, "Agile Developer Tool", 25000, "brello", 0.1, [REACTJS], 1),
  5: new Job(5, "Data science pharmaceutical", 12000, "algoexp", 0.1, [SQL], 3),
  6: new Job(6, "Serverless payment gateway", 42000, "retrofin", 0.1, [AWS], 4),
});

// Load balance and level
document.querySelector("#level")
  .firstElementChild.innerHTML = `LEVEL ${getAccountProperty(STORAGE.LEVEL)}`;

document.getElementById("balance-amount").innerText = formatNumber(
  getAccountProperty(STORAGE.BALANCE) || 0
);

document.querySelector("#company-type").innerHTML = getAccountProperty(STORAGE.TYPE);

updateLevel(0, getAccountProperty(STORAGE.LEVEL_PROGRESS));

// Load account products and developers
setTimeout(() => {
  let developers = getAccountProperty(STORAGE.DEVELOPERS),
    objects = getAccountProperty(STORAGE.OBJECTS);

  Object.keys(objects).map((id) => {
    const { x, y, cursor, selected, isDeveloper } = objects[id];

    if (isDeveloper && developers[selected].active) {
      drawImage(objectsCtx, DISABLED_INVENTORY[selected], x, y, cursor[0], cursor[1]);
    } else {
      drawImage(objectsCtx, INVENTORY[selected], x, y, cursor[0], cursor[1]);
    }
  });
}, 500);

document.getElementById("storage-count").innerText = getAccountProperty(STORAGE.ACTIVE_JOBS_STORAGE_LIMIT);