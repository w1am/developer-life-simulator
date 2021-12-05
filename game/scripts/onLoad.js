"use strict"

/**
 * 
 * Initialize game with level / balance / items
 * 
*/

import { customStorage,  DISABLED_INVENTORY, INVENTORY, STORAGE, formatNumber  } from '../../common/index.js';
import { Job, Requirement } from './models.js';
import { getAccountProperty } from './account.js';
import { updateLevel, drawImage } from './utils/index.js';
import { objectsCtx } from './main.js';

// On mount. load available tasks/jobs
customStorage.setter(STORAGE.TASKS, {
  0: new Job(0, "Coffee review Website", 10000, "frestea", 0.1,
    [
      new Requirement("Python", "PY", ["#173248", "white"]),
      new Requirement("Javascript", "JS", ["#EAD41B", "#000000"]),
    ],
    25
  ),
  1: new Job(1, "Ecommerce Website", 45000, "econovu", 0.1,
    [new Requirement("Javascript", "JS", ["#EAD41B", "#000000"])],
    30
  ),
  2: new Job(2, "Alt coin trading platform", 75000, "traderex", 0.1,
    [
      new Requirement("Scala", "Scala", ["#D12F2D", "#000000"]),
      new Requirement("Java", "Java", ["#E97B18", "#4A738E"]),
    ],
    45
  ),
  3: new Job(3, "Game for the Metaverse", 120000, "meta", 0.1,
    [
      new Requirement("Python", "Python", ["#173248", "white"]),
      new Requirement("C++", "C++", ["#486694", "#f7f7f7"]),
    ],
    45
  ),
  4: new Job(4, "Agile Developer Tool", 25000, "brello", 0.1,
    [
      new Requirement("ReactJS", "ReactJS", ["#61DAFB", "#222222"]),
    ],
    45
  ),
  5: new Job(5, "Data science pharmaceutical", 12000, "algoexp", 0.1,
    [
      new Requirement("SQL", "SQL", ["#F10000", "white"]),
    ],
    45
  ),
  6: new Job(6, "Serverless payment gateway", 42000, "retrofin", 0.1,
    [
      new Requirement("AWS", "AWS", ["#F79400", "#222E3C"]),
    ],
    45
  ),
});

// Load balance and level
document.querySelector("#level").firstElementChild.innerHTML = `LEVEL ${getAccountProperty(STORAGE.LEVEL)}`;
document.getElementById("balance-amount").innerText = formatNumber(getAccountProperty(STORAGE.BALANCE) || 0);

updateLevel(0, getAccountProperty(STORAGE.LEVEL_PROGRESS));

// Load account products and developers
setTimeout(() => {
  let developers = getAccountProperty(STORAGE.DEVELOPERS), objects = getAccountProperty(STORAGE.OBJECTS);

  Object.keys(objects).map((id) => {
    let obj = objects[id]

    if (obj.isDeveloper && developers[Number(obj.selected)].active) {
      drawImage(
        objectsCtx,
        DISABLED_INVENTORY[Number(obj.selected)],
        obj.x,
        obj.y,
        obj.cursor[0],
        obj.cursor[1]
      );
    } else {
      drawImage(
        objectsCtx,
        INVENTORY[Number(obj.selected)],
        obj.x,
        obj.y,
        obj.cursor[0],
        obj.cursor[1]
      );
    }
  });
}, 500);

let storageCount = document.getElementById("storage-count")
storageCount.innerText = getAccountProperty(STORAGE.ACTIVE_JOBS_STORAGE_LIMIT)