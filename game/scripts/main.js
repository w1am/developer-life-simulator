"use strict";

/**
 * This is the main javascript scripting file for the game page
 * Only the important / less obvious functionalities are commented
 *
 * ===========/ Important Functions /=============:
 * renderJobs()
 * renderProducts()
 * findDeveloper()
 * makeWorkerBusy()
 * makeWorkerFree()
 *
 * ===========/ Other Functions /=============:
 * updateLog()
 *
 */

import {
  TYPES,
  TABS,
  STORAGE,
  INVENTORY,
  DISABLED_INVENTORY,
  SOUNDS,
  AUTHENTICATION_STORAGE,
  customStorage,
  formatNumber,
} from "../../common/index.js";
import {
  product0,
  product1,
  product2,
  product3,
  product4,
  product5,
  product6,
  product7,
  product8,
  product9,
  product10,
  product11,
} from "./products.js";
import {
  clearRect,
  detectObject,
  relativeCoordinates,
  drawImage,
  playSound,
  updateLevel,
  updateBalance,
  createConfetti
} from "./utils/index.js";
import { getAccountProperty, updateAccountProperty } from "./account.js";
import { WELCOME_MESSAGES, POINTS_REWARDS, COMPANY_TYPE } from "../../common/constants.js";
import { Notification, Log } from "./models.js";

const notification = new Notification();
const log = new Log();

const isAuthed = customStorage.getter(
  null,
  AUTHENTICATION_STORAGE.AUTHENTICATED_USER
);
if (!isAuthed)
  window.location.href =
    "/developer-life-simulator/authentication/login?source=failed";

const gridCanvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector("#grid")
);
const objectsCanvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector("#objects")
);

/** Audio object that tracks each developers keyboard sound effect */
const AUDIOS = {};

export const gridCtx = gridCanvas.getContext("2d");
export const objectsCtx = objectsCanvas.getContext("2d");

export const TILE_SIZE = 2 * 32;
export const [TILE_WIDTH_COUNT, TILE_HEIGHT_COUNT] = [10, 10];
export const SECURITY_INTERVALS = [150000, 270000, 180000];
export const AUTHENTICATED_USER = customStorage.getter(
  {},
  AUTHENTICATION_STORAGE.AUTHENTICATED_USER
);
export const PRODUCT_LIST = [
  product0,
  product1,
  product2,
  product3,
  product4,
  product5,
  product6,
  product7,
  product8,
  product9,
  product10,
  product11,
];

export const PRODUCTS = {
  [TABS.SERVER]: [product0, product1, product2],
  [TABS.DEVELOPER]: [
    product3,
    product4,
    product5,
    product6,
    product7,
    product8,
  ],
  [TABS.ENTERTAINMENT]: [product9, product10, product11],
};

export const GAME_PROPERTIES = {
  shopActive: false,
  grabbed: false,
  selected: null,
  cursor: [1, 1],
  tab: [TABS.SERVER],
  subtractedAmount: null,
  securityRiskStatus: false,
};

/** Highlight current tile on mouse move */
document.addEventListener("mousemove", (event) => {
  clearRect(gridCtx);
  const { coordX, coordY } = relativeCoordinates(event);

  if (detectObject(coordX, coordY, GAME_PROPERTIES.cursor)) return;

  gridCtx.strokeStyle = "white";
  gridCtx.lineWidth = 3;
  gridCtx.strokeRect(
    coordX * TILE_SIZE,
    coordY * TILE_SIZE,
    TILE_SIZE * GAME_PROPERTIES.cursor[0],
    TILE_SIZE * GAME_PROPERTIES.cursor[1]
  );
  if (GAME_PROPERTIES.grabbed)
    drawImage(
      gridCtx,
      INVENTORY[GAME_PROPERTIES.selected],
      coordX,
      coordY,
      GAME_PROPERTIES.cursor[0],
      GAME_PROPERTIES.cursor[1]
    );
});

/** Reset all states and update balance when object is placed on the map */
document.getElementById("map").addEventListener("click", function (event) {
  // if (shopActive || !GAME_PROPERTIES.grabbed) return;
  if (!GAME_PROPERTIES.grabbed) return;
  const { coordX, coordY } = relativeCoordinates(event);

  if (coordX === undefined || coordY === undefined) {
    GAME_PROPERTIES.grabbed = false;
    GAME_PROPERTIES.cursor = [1, 1];
    GAME_PROPERTIES.subtractedAmount = 0;
    return;
  }

  if (detectObject(coordX, coordY, GAME_PROPERTIES.cursor)) return;

  if (GAME_PROPERTIES.selected == null) return;

  let layout = getAccountProperty(STORAGE.LAYOUT);
  let objects = getAccountProperty(STORAGE.OBJECTS);
  let product = PRODUCT_LIST[GAME_PROPERTIES.selected];

  drawImage(
    objectsCtx,
    INVENTORY[GAME_PROPERTIES.selected],
    coordX,
    coordY,
    GAME_PROPERTIES.cursor[0],
    GAME_PROPERTIES.cursor[1]
  );

  // Get object properties using the product id
  objects[product.id] = {
    x: coordX,
    y: coordY,
    cursor: GAME_PROPERTIES.cursor,
    isDeveloper: product.type === TYPES.DEVELOPER,
    selected: GAME_PROPERTIES.selected,
    name: product.name,
    id: product.id,
  };

  layout.push([
    [coordX, coordX + GAME_PROPERTIES.cursor[0] - 1],
    [coordY, coordY + GAME_PROPERTIES.cursor[1] - 1],
  ]);

  updateAccountProperty(STORAGE.LAYOUT, layout);
  updateAccountProperty(STORAGE.OBJECTS, objects);
  updateBalance(GAME_PROPERTIES.subtractedAmount * -1);

  const selectedProduct = PRODUCT_LIST[GAME_PROPERTIES.selected];

  // Add developer to the user account's developers list if product is of type developer
  if (selectedProduct.type === TYPES.DEVELOPER) {
    let developers = getAccountProperty(STORAGE.DEVELOPERS);

    developers[product.id] = {
      id: product.id,
      skills: product.skills,
      active: false,
      jobId: null,
      tile: [coordX, coordY],
      cursor: GAME_PROPERTIES.cursor,
      image: GAME_PROPERTIES.selected,
    };

    updateAccountProperty(STORAGE.DEVELOPERS, developers);

    notification.sendNotification(
      `${product.name} 👋`,
      WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]
    );
  } else if (selectedProduct.type === TYPES.PRODUCT) {
    let activeJobsStorageLimit = getAccountProperty(
      STORAGE.ACTIVE_JOBS_STORAGE_LIMIT
    );
    let storageCount = document.getElementById("storage-count");

    if (selectedProduct.id < 3) {
      updateAccountProperty(
        STORAGE.ACTIVE_JOBS_STORAGE_LIMIT,
        activeJobsStorageLimit + 1
      );
      storageCount.innerText = activeJobsStorageLimit + 1;
    }
  }

  playSound(SOUNDS.COIN);
  renderJobs();
  GAME_PROPERTIES.selected = null;
  GAME_PROPERTIES.grabbed = false;
  GAME_PROPERTIES.cursor = [1, 1];
});

/** Disable to the button if no developers match programming language */
const isJobDisabled = function (work) {
  let jobs = getAccountProperty(STORAGE.ACTIVE_JOBS);

  const { id, requirements } = work;

  if ((jobs[id] && !jobs[id].ended) || !findDeveloper(requirements))
    return true;
  return false;
};

/** Look for a developer who meets the job specifications. */
const findDeveloper = function (requirements) {
  let developers = getAccountProperty(STORAGE.DEVELOPERS);

  let developerMatched = false;
  let selectedDeveloper = null;

  requirements.forEach((requirement) => {
    Object.keys(developers).forEach((id) => {
      const developer = developers[id];

      if (developer.skills.length === requirements.length) {
        developerMatched =
          String(developer.skills.sort()) ===
          String(requirements.map((req) => req.title).sort());
      } else {
        developerMatched = developer.skills.includes(requirement.title);
      }

      if (developerMatched && !developer.active) {
        selectedDeveloper = id;
      }
    });
  });

  return selectedDeveloper;
};

/** When a developer is working, change character image to "working" */
const makeWorkerBusy = (requirements, jobId) => {
  // const audio = new Audio('/developer-life-simulator/assets/keyboard.wav');

  let developers = getAccountProperty(STORAGE.DEVELOPERS);
  // Find available worker based on job requirements. For eg. If job needs javascript dev, function looks for javascript developer.
  let selected = findDeveloper(requirements);

  if (!selected) return false;

  log.pushLog(`${PRODUCT_LIST[selected].name} started working`)

  objectsCtx.clearRect(
    developers[selected].tile[0] * TILE_SIZE,
    developers[selected].tile[1] * TILE_SIZE,
    TILE_SIZE * developers[selected].cursor[0],
    TILE_SIZE * developers[selected].cursor[1]
  );
  objectsCtx.drawImage(
    DISABLED_INVENTORY[developers[selected].image],
    developers[selected].tile[0] * TILE_SIZE,
    developers[selected].tile[1] * TILE_SIZE,
    TILE_SIZE * developers[selected].cursor[0],
    TILE_SIZE * developers[selected].cursor[1]
  );
  developers[selected] = { ...developers[selected], active: true, jobId };

  AUDIOS[selected] = new Audio("/developer-life-simulator/assets/keyboard.wav");
  AUDIOS[selected].play();

  updateAccountProperty(STORAGE.DEVELOPERS, developers);
};

/** Update character image back to normal when job ends. */
const makeWorkerFree = (jobId) => {
  let developers = getAccountProperty(STORAGE.DEVELOPERS);
  let selected = null;

  return Object.keys(developers).forEach((id) => {
    if (developers[id].jobId === jobId) {
      selected = Number(id);

      log.pushLog(`${PRODUCT_LIST[selected].name} stopped working`)

      objectsCtx.clearRect(
        developers[selected].tile[0] * TILE_SIZE,
        developers[selected].tile[1] * TILE_SIZE,
        TILE_SIZE * developers[selected].cursor[0],
        TILE_SIZE * developers[selected].cursor[1]
      );
      objectsCtx.drawImage(
        INVENTORY[developers[selected].image],
        developers[selected].tile[0] * TILE_SIZE,
        developers[selected].tile[1] * TILE_SIZE,
        TILE_SIZE * developers[selected].cursor[0],
        TILE_SIZE * developers[selected].cursor[1]
      );

      developers[selected] = {
        ...developers[selected],
        active: false,
        jobId: null,
      };

      if (AUDIOS[selected]) {
        AUDIOS[selected].pause();
        AUDIOS[selected].currentTime = 0;
      }

      updateAccountProperty(STORAGE.DEVELOPERS, developers);
      return;
    }
  });
};

/** List all products when job menu window opens */
export const renderJobs = () => {
  const job = document.getElementById("job");
  job.innerHTML = null;

  let activeJobs = getAccountProperty(STORAGE.ACTIVE_JOBS);

  // Tasks are all jobs that are available on the market.
  let tasks = customStorage.getter({}, "tasks");

  Object.keys(tasks).forEach((work) => {
    const item = document.createElement("div");
    item.className = "job-item";

    const title = document.createElement("p");
    title.innerText = tasks[work].title;
    title.className = "title";

    const reward = document.createElement("p");
    reward.innerText = "$ " + formatNumber(tasks[work].reward);

    const company = document.createElement("company");
    company.innerText = "By " + tasks[work].company;
    company.className = "company";

    const flow = document.createElement("div");
    flow.className = "flow";
    const duration = (document.createElement("p").innerText =
      tasks[work].duration + " Minutes");

    const clock = document.createElement("i");
    clock.className = "fa fa-clock-o clock";

    flow.append(clock, duration);

    const requirements = document.createElement("div");
    requirements.className = "requirements";

    // Display job requirements
    tasks[work].requirements.forEach((requirement) => {
      const requirementItem = document.createElement("div");
      requirementItem.className = "requirements-item";
      requirementItem.innerText = requirement.prefix;

      requirementItem.style.backgroundColor = requirement.palette[0];
      requirementItem.style.color = requirement.palette[1];

      requirements.append(requirementItem);
    });

    const accept = document.createElement("button");

    let jobEnded = activeJobs[work] && activeJobs[work].ended;

    accept.innerText = jobEnded ? "Claim reward" : "Accept job";
    accept.setAttribute("status", jobEnded ? "claim" : "open");
    if (!jobEnded) accept.disabled = isJobDisabled(tasks[work]);
    accept.onclick = function () {
      // Claim rewards when job ends
      if (jobEnded) {
        claimReward(
          activeJobs,
          work,
          tasks[work].reward,
          PRODUCT_LIST[Number(activeJobs[work].developer)].expense
        );
        renderJobs();
      } else {
        let activeJobsStorageLimit = getAccountProperty(
          STORAGE.ACTIVE_JOBS_STORAGE_LIMIT
        );
        let activeJobs = getAccountProperty(STORAGE.ACTIVE_JOBS);

        const runningActiveJobs = Object.keys(activeJobs).filter(
          (job) => activeJobs[job].ended == false
        ).length;

        // Prevent new active jobs
        if (runningActiveJobs >= activeJobsStorageLimit) {
          notification.sendNotification(
            "Error",
            "You do not have enough servers. Go to shop > servers to increase capacity",
            true
          );
          return;
        }

        playSound(SOUNDS.START_JOB);

        // Accept job and store list in active jobs list
        // Also update developer state to active
        let selected = findDeveloper(tasks[work].requirements);

        activeJobs[work] = {
          title: tasks[work].title,
          reward: tasks[work].reward,
          requirements: tasks[work].requirements,
          finish: moment().add(tasks[work].duration, "minute"),
          duration: tasks[work].duration,
          ended: false,
          developer: selected,
        };

        updateAccountProperty(STORAGE.ACTIVE_JOBS, activeJobs);

        renderActiveJobs();

        makeWorkerBusy(tasks[work].requirements, work);
        isJobDisabled(tasks[work]);
        renderJobs();
      }
    };

    const requirementTitle = document.createElement("p");
    requirementTitle.className = "job-requirements-title";
    requirementTitle.innerText = "Requirements";

    item.append(
      title,
      reward,
      company,
      flow,
      requirementTitle,
      requirements,
      accept
    );
    job.append(item);
  });
};

/** List all products when shop menu window opens */
export const renderProducts = (tab) => {
  const shop = document.getElementById("shop");
  shop.innerHTML = null;
  let developers = getAccountProperty(STORAGE.DEVELOPERS);
  let objects = getAccountProperty(STORAGE.OBJECTS);
  let balance = getAccountProperty(STORAGE.BALANCE);

  PRODUCTS[GAME_PROPERTIES.tab].forEach((product) => {
    const isAlreadyHired = Object.keys(developers).includes(String(product.id));
    const isProductOnMap = Object.keys(objects).includes(String(product.id));
    const isFiredState = GAME_PROPERTIES.tab === TABS.DEVELOPER && isAlreadyHired;
    const isProductSellState = GAME_PROPERTIES.tab !== TABS.DEVELOPER && isProductOnMap;

    const item = document.createElement("div");

    // Update button text when required
    const buy = document.createElement("button");

    if (GAME_PROPERTIES.tab === TABS.DEVELOPER) {
      buy.innerText = isAlreadyHired ? "FIRE" : "HIRE"
    } else {
      buy.innerText = isProductOnMap ? "SELL" : "BUY"
    }

    buy.className = isAlreadyHired || isProductOnMap ? "remove" : "item-buy";

    // Disable when state is "sell" or "fire" 
    buy.disabled = (!isFiredState || !isProductSellState) && product.price > balance

    const content = document.createElement("div");
    content.style.display = "block";
    content.style.textAlign = "center";

    const title = document.createElement("p");
    title.style.margin = 0;
    title.style.fontWeight = "bold";
    title.innerText = product.name;

    const price = document.createElement("p");
    price.style.margin = 0;
    price.innerText = `$ ${formatNumber(product.price)}`;

    content.append(title, price);

    // Show skills when product has a list of skills
    if (product.skills) {
      const skills = document.createElement("p");
      skills.style.margin = 0;
      skills.style.fontSize = "12px";
      skills.style.paddingTop = "5px";
      skills.style.paddingBottom = "5px";
      skills.innerText = product.skills.join(", ");
      content.appendChild(skills);
    }

    const imageContainer = document.createElement("div");
    imageContainer.appendChild(product.icon);
    product.icon.style.maxWidth = "100%";

    item.className = "item";
    item.id = product.id;
    item.append(imageContainer, content, buy);

    buy.onclick = function () {
      // Fire developer or sell product when product or developer is already placed on the map
      if (isAlreadyHired || isProductOnMap) {
        if (
          product.type === TYPES.DEVELOPER &&
          getAccountProperty(STORAGE.DEVELOPERS)[product.id].active
        ) {
          notification.sendNotification(
            product.name,
            "Hey! I'm still working!"
          );
          return;
        }

        let accountLayouts = getAccountProperty(STORAGE.LAYOUT);

        // Initialise the layout
        let layoutToRemove = [
          [
            Number(objects[product.id].x),
            Number(objects[product.id].x) +
              Number(objects[product.id].cursor[0]) -
              1,
          ],
          [
            Number(objects[product.id].y),
            Number(objects[product.id].y) +
              Number(objects[product.id].cursor[1]) -
              1,
          ],
        ];

        // Remove product image from canvas
        objectsCtx.clearRect(
          objects[product.id].x * TILE_SIZE,
          objects[product.id].y * TILE_SIZE,
          objects[product.id].cursor[0] * TILE_SIZE,
          objects[product.id].cursor[1] * TILE_SIZE
        );

        // Remove layout. LAYOUT stores the position and size of the object that can be used for object detection
        let newLayout = accountLayouts.filter(
          (layout) => String(layout) !== String(layoutToRemove)
        );

        delete objects[product.id];

        // Take away 2000 in severance pay when a developer is fired.
        if (product.type === TYPES.DEVELOPER) {
          updateBalance(-2000);
          delete developers[product.id];
          updateAccountProperty(STORAGE.DEVELOPERS, developers);
        } else {
          // Update new balance based on the resale value. We always assume that the re sale value diminishes by 50%
          updateBalance(Number(product.price / 2));

          let activeJobsStorageLimit = getAccountProperty(
            STORAGE.ACTIVE_JOBS_STORAGE_LIMIT
          );

          let storageCount = document.getElementById("storage-count");

          if (product.id < 3) {
            updateAccountProperty(
              STORAGE.ACTIVE_JOBS_STORAGE_LIMIT,
              activeJobsStorageLimit - 1
            );
            storageCount.innerText = activeJobsStorageLimit - 1;
          }
        }

        updateAccountProperty(STORAGE.LAYOUT, newLayout);
        updateAccountProperty(STORAGE.OBJECTS, objects);
        renderProducts(GAME_PROPERTIES.tab);
        renderJobs();

        let logMessage = product.type === TYPES.DEVELOPER
          ? `-$ ${formatNumber(2000)} severance pay`
          : `sold on used marketplace for $ ${formatNumber(parseInt(product.price / 2))}`

        log.pushLog(logMessage)

        playSound(SOUNDS.COIN);
      } else {
        // When user clicks on buy or hire. Save selection and set GAME_PROPERTIES.cursor to the
        // object's width and height property. We need GAME_PROPERTIES.cursor to determine how
        // many tiles the object will occupy when placed on the map
        if (product.price > balance) return;
        GAME_PROPERTIES.selected = product.id;
        GAME_PROPERTIES.cursor = product.cursor;
        GAME_PROPERTIES.grabbed = true;
        GAME_PROPERTIES.subtractedAmount = Number(product.price);

        handleShopClose();
      }
    };

    shop.append(item);
  });
};

/** Update progress, level and balance when user clicks */
const claimReward = function (activeJobs, job, reward, expense) {
  playSound(SOUNDS.CLAIM);
  let levelProgress = getAccountProperty(STORAGE.LEVEL_PROGRESS);
  let level = getAccountProperty(STORAGE.LEVEL);
  let tasks = customStorage.getter({}, STORAGE.TASKS);

  let newLevelProgress =
    levelProgress + tasks[job].points * POINTS_REWARDS[level];

  // When progress bar reaches or surpasses level 100 reset to 0 and increment level
  if (newLevelProgress >= 100) {
    playSound(SOUNDS.LEVEL_UP);
    createConfetti()
    let updatedLevel = level + 1;
    let offsetProgress = newLevelProgress - 100;
    let companyType = updatedLevel > 5 ? "enterprise" : COMPANY_TYPE[updatedLevel]

    updateLevel(0, offsetProgress);
    updateAccountProperty(STORAGE.LEVEL_PROGRESS, offsetProgress);
    updateAccountProperty(STORAGE.LEVEL, updatedLevel);
    updateAccountProperty(STORAGE.TYPE, companyType);
    document.querySelector("#company-type").innerHTML = companyType;
    document.querySelector("#level").firstElementChild.innerHTML = `LEVEL ${updatedLevel}`;
    notification.sendNotification("Level up!", "Congratulations on reaching level " + updatedLevel);
  } else {
    updateLevel(levelProgress, newLevelProgress);
    updateAccountProperty(STORAGE.LEVEL_PROGRESS, newLevelProgress);
  }

  log.pushLog(`$ ${formatNumber(reward)} claimed`)
  log.pushLog(`-$ ${formatNumber(expense)} in expense`)

  delete activeJobs[job];
  updateAccountProperty(STORAGE.ACTIVE_JOBS, activeJobs);

  updateBalance(Number(reward) - Number(expense));
};

const endJob = (id) => {
  let jobs = getAccountProperty(STORAGE.ACTIVE_JOBS);
  jobs[id] = { ...jobs[id], ended: true };
  updateAccountProperty(STORAGE.ACTIVE_JOBS, jobs);
};

const renderProgressbar = function (final, current, reward, job) {
  const container = document.createElement("div");
  container.className = "progressbar";

  const bar = document.createElement("div");
  bar.className = "bar";
  bar.setAttribute("completed", false);
  bar.setAttribute("job", job);
  bar.setAttribute("reward", reward);

  if (current >= 0) {
    makeWorkerFree(job);
    endJob(job);

    bar.style.backgroundColor = "green";
    bar.style.cursor = "pointer";

    bar.setAttribute("completed", true);
    bar.innerText = "Claim reward";
  } else {
    bar.style.width = `${100 - (100 / final) * Math.abs(current)}%`;
    bar.style.backgroundColor = "#6d0cce";
  }

  container.append(bar);

  return container;
};

/**
 * A separate mouse click event listener to detect when user clicks on "Claim Reward" button
 * Accumulate job reward points using getAttribute and pass it into the claimReward function
 *
 * */
document.addEventListener("mousedown", (e) => {
  let activeJobs = getAccountProperty(STORAGE.ACTIVE_JOBS);

  if (e.target.className === "bar") {
    let completed = e.target.getAttribute("completed");

    if (completed === "false") return;

    let job = Number(e.target.getAttribute("job"));
    let reward = Number(e.target.getAttribute("reward"));

    if (activeJobs[job]) {
      claimReward(
        activeJobs,
        job,
        reward,
        PRODUCT_LIST[Number(activeJobs[job].developer)].expense
      );
    }

    // Re render jobs and active jobs window and pane after click
    renderJobs();
    renderActiveJobs();
  }
});

/** Display all active jobs */
const renderActiveJobs = function () {
  let activeJobs = getAccountProperty(STORAGE.ACTIVE_JOBS);

  const empty = document.createElement("p");
  empty.style.color = "rgba(0,0,0,0.8)";
  empty.style.margin = 0;
  empty.style.padding = "10px 20px";
  empty.innerText = "No active jobs";
  empty.style.textAlign = "center";

  const activeJobsContent = document.getElementById("active-jobs-content");
  activeJobsContent.innerHTML = null;
  activeJobsContent.style.overflowY = "auto";
  activeJobsContent.style.maxHeight = "500px";

  /** Show empty message when there is no active jobs */
  if (Object.keys(activeJobs).length === 0)
    return activeJobsContent.append(empty);

  Object.keys(activeJobs).forEach((id) => {
    let job = activeJobs[id];

    /** Get time left before active job ends */
    let timeDiff = moment().diff(job.finish, "second");

    let jobItem = document.createElement("div");
    jobItem.className = "job-item";

    const jobTitle = document.createElement("p");
    jobTitle.innerText = job.title;
    jobTitle.className = "title";

    const developerName = document.createElement("p");
    developerName.innerText = PRODUCT_LIST[job.developer].name;
    developerName.className = "id-developer";

    /** Update progress bar */
    let progress = renderProgressbar(
      job.duration * 60,
      timeDiff,
      job.reward,
      id
    );

    jobItem.append(jobTitle, developerName);

    /** Job requirements icons and generate color based on their color palettes */
    const requirements = document.createElement("div");
    requirements.className = "requirements";
    requirements.style.marginBottom = "8px";
    job.requirements.forEach((requirement) => {
      const requirementItem = document.createElement("div");
      requirementItem.style.backgroundColor = requirement.palette[0];
      requirementItem.style.color = requirement.palette[1];
      requirementItem.className = "requirements-item";
      requirementItem.innerText = requirement.prefix;
      requirements.append(requirementItem);
    });

    jobItem.append(requirements, progress);

    activeJobsContent.append(jobItem);
  });
};

const resolveSecurityRisk = function () {
  playSound(SOUNDS.THREAT);
  updateBalance(+200);

  const securityRiskButton = document.getElementById("security-risk-btn");

  log.pushLog("fixed security threat", "green")

  securityRiskButton.disabled = true;
  GAME_PROPERTIES.securityRiskStatus = false;

  log.pushLog("$200 reward for fixing security threat", "green")

  // Generate next security risk
  generateSecurityRisks();
};

const generateSecurityRisks = function () {
  setTimeout(() => {
    GAME_PROPERTIES.securityRiskStatus = true;

    const securityRiskButton = document.getElementById("security-risk-btn");

    log.pushLog("Security threat detected!", "red")

    securityRiskButton.disabled = false;
  }, SECURITY_INTERVALS[Math.floor(Math.random() * SECURITY_INTERVALS.length)]);
};

generateSecurityRisks();

/** Clear item from selection on ESC key press */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    GAME_PROPERTIES.grabbed = false;
    GAME_PROPERTIES.cursor = [1, 1];
  }
});

/** Draggable map element handler */ 
(function moveGameMap() {
  let elm = document.getElementById("frame");

  elm.onmousedown = (e) => {
    if (e.button !== 0) return;

    document.onmousemove = (i) => {
      elm.style.top = `${i.clientY - (e.offsetY + 90)}px`;
      elm.style.left = `${i.clientX - (e.offsetX + 30)}px`;
    };

    document.onmouseup = () => {
      document.onmousedown = null;
      document.onmousemove = null;
    };
  };
})();

window.setInterval(() => renderActiveJobs(), 200);
window.resolveSecurityRisk = resolveSecurityRisk;