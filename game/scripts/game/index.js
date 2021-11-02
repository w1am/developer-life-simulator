let isAuthed = customStorage.getter(
  null,
  AUTHENTICATION_STORAGE.AUTHENTICATED_USER
);
if (!isAuthed) window.location.pathname = "/developer-life-simulator";

var gridCanvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector("#grid")
);
var objectsCanvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector("#objects")
);
var devCanvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector("#dev")
);
var labelsCanvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector("#labels")
);

const gridCtx = gridCanvas.getContext("2d");
const objectsCtx = objectsCanvas.getContext("2d");
const devCtx = devCanvas.getContext("2d");
const labelsCtx = labelsCanvas.getContext("2d");

const PIXELS = 2;
const TILE_SIZE = PIXELS * 32;
const [TILE_WIDTH_COUNT, TILE_HEIGHT_COUNT] = [10, 10];
const AUTHENTICATED_USER = customStorage.getter({}, AUTHENTICATION_STORAGE.AUTHENTICATED_USER);

let shopActive = false;
let grabbed = false;
let cursor = [1, 1];
let tab = [TABS.SERVER];
let newBalance = null

// On mount
customStorage.setter(STORAGE.TASKS, {
  0: new Job(
    0,
    "Coffee review Website",
    10000,
    "frestea",
    3.1,
    [
      new Requirement("Python", "", "PY", ["#173248", "white"]),
      new Requirement("Javascript", "", "JS", ["#EAD41B", "#000000"]),
    ],
    25
  ),
  1: new Job(
    1,
    "Ecommerce Website",
    45000,
    "econovu",
    0.1,
    [new Requirement("Javascript", "", "JS", ["#EAD41B", "#000000"])],
    30
  ),
  2: new Job(
    2,
    "Alt coin trading platform",
    75000,
    "traderex",
    0.1,
    [
      new Requirement("Scala", "", "Scala", ["#D12F2D", "#000000"]),
      new Requirement("Java", "", "Java", ["#E97B18", "#4A738E"]),
    ],
    45
  ),
});

document.querySelector("#level").firstElementChild.innerHTML = `LEVEL ${getAccountProperty(STORAGE.LEVEL)}`;
document.getElementById("balance-amount").innerText = formatNumber(getAccountProperty(STORAGE.BALANCE) || 0);

function updateLevel(before, after) {
  const levelProgress = document.getElementById("level-progress-bar");
  animateValue(levelProgress, before, (200 / 100) * after, 1000, true);
};

updateLevel(0, getAccountProperty(STORAGE.LEVEL_PROGRESS));

document.addEventListener("mousemove", (event) => {
  clearRect();
  let selected = customStorage.getter(null, STORAGE.SELECTED);
  const { coordX, coordY } = relativeCoordinates(event);
  if (detectObject(coordX, coordY)) return;

  gridCtx.strokeStyle = "white";
  gridCtx.lineWidth = 3;
  gridCtx.strokeRect(
    coordX * TILE_SIZE,
    coordY * TILE_SIZE,
    TILE_SIZE * cursor[0],
    TILE_SIZE * cursor[1]
  );
  if (grabbed)
    drawImage(
      gridCtx,
      INVENTORY[selected],
      coordX,
      coordY,
      cursor[0],
      cursor[1]
    );
});

function updateAccountProperty(field, newValue) {
  let accounts = customStorage.getter({}, AUTHENTICATION_STORAGE.ACCOUNTS);
  accounts[AUTHENTICATED_USER][field] = newValue;
  customStorage.setter(AUTHENTICATION_STORAGE.ACCOUNTS, accounts);
}

function getAccountProperty(field) {
  if (!isAuthed) return
  let accounts = customStorage.getter({}, AUTHENTICATION_STORAGE.ACCOUNTS);
  return accounts[AUTHENTICATED_USER][field];
}

// Load account products and developers on mount
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
}, 100);

document.getElementById("map").addEventListener("click", function (event) {
  if (shopActive || !grabbed) return;
  const { coordX, coordY } = relativeCoordinates(event);

  if (detectObject(coordX, coordY)) return;

  let selected = customStorage.getter(null, STORAGE.SELECTED);
  if (selected == null) return

  let layout = getAccountProperty(STORAGE.LAYOUT);
  let objects = getAccountProperty(STORAGE.OBJECTS);
  let product = PRODUCT_LIST[selected]

  drawImage(objectsCtx, INVENTORY[selected], coordX, coordY, cursor[0], cursor[1]);

  objects[product.id] = {
    x: coordX,
    y: coordY,
    cursor,
    isDeveloper: product.type === TYPES.DEVELOPER,
    selected: selected,
    name: product.name,
    id: product.id,
  };

  layout.push([[coordX, coordX + cursor[0] - 1], [coordY, coordY + cursor[1] - 1]]);

  updateAccountProperty(STORAGE.LAYOUT, layout);
  updateAccountProperty(STORAGE.OBJECTS, objects);

  let assets = getAccountProperty(STORAGE.ASSETS);
  let balance = getAccountProperty(STORAGE.BALANCE);
  let balanceAmountElement = document.getElementById("balance-amount");

  updateAccountProperty(STORAGE.BALANCE, newBalance);
  updateAccountProperty(STORAGE.ASSETS, (assets += product.price));
  animateValue(balanceAmountElement, Number(balance), Number(newBalance), 1000);

  if (PRODUCT_LIST[selected].type === TYPES.DEVELOPER) {
    let developers = getAccountProperty(STORAGE.DEVELOPERS);

    developers[product.id] = {
      id: product.id,
      skills: product.skills,
      active: false,
      jobId: null,
      tile: [coordX, coordY],
      cursor,
      image: selected,
    };

    updateAccountProperty(STORAGE.DEVELOPERS, developers);
  }

  customStorage.remover(STORAGE.SELECTED);
  renderJobs();
  grabbed = false;
  cursor = [1, 1];
});

let products = {
  [TABS.SERVER]: [product0, product1, product2],
  [TABS.DEVELOPER]: [
    product3,
    product4,
    product5,
    product6,
    product7,
    product8,
  ],
  [TABS.ENTERTAINMENT]: [product9, product10],
  [TABS.SERVICE]: [],
};

const isJobDisabled = function (work) {
  let developers = getAccountProperty(TABS.DEVELOPER);
  let jobs = getAccountProperty(STORAGE.ACTIVE_JOBS);

  const requirements = work.requirements;

  // disable to the button if no developers match programming language
  let pass = false;
  requirements.forEach((requirement, count) => {
    Object.keys(developers).forEach((developer) => {
      if (
        developers[developer].skills.includes(requirement.title) &&
        !developers[developer].active &&
        count == requirements.length - 1
      )
        pass = true;
    });
  });

  if ((jobs[work.id] && !jobs[work.id].ended) || !pass) return true;
  return false;
};

const findDeveloper = (requirements) => {
  let developers = getAccountProperty(STORAGE.DEVELOPERS);

  let pass = false;
  let selected = null;

  requirements.forEach((requirement, count) => {
    Object.keys(developers).forEach((id) => {
      if (
        developers[id].skills.includes(requirement.title) &&
        count == requirements.length - 1 &&
        !developers[id].active
      ) {
        pass = true;
        selected = id;
      }
    });
  });

  if (pass) {
    return selected;
  } else {
    return null;
  }
};

const makeWorkerBusy = (requirements, jobId) => {
  let developers = getAccountProperty(STORAGE.DEVELOPERS);

  let selected = findDeveloper(requirements);

  if (!selected) return false;

  updateLog({
    timestamp: moment().format("LT"),
    message: `${PRODUCT_LIST[selected].name} started working`,
  });

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

  updateAccountProperty(STORAGE.DEVELOPERS, developers);
};

const makeWorkerFree = (jobId) => {
  let developers = getAccountProperty(STORAGE.DEVELOPERS);
  let selected = null;

  return Object.keys(developers).forEach((id) => {
    if (developers[id].jobId === jobId) {
      selected = Number(id);

      updateLog({
        timestamp: moment().format("LT"),
        message: `${PRODUCT_LIST[selected].name} stopped working`,
      });

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

      updateAccountProperty(STORAGE.DEVELOPERS, developers);
      return;
    }
  });
};

const renderJobs = () => {
  const job = document.getElementById("job");
  job.innerHTML = null;

  let activeJobs = getAccountProperty(STORAGE.ACTIVE_JOBS);

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
      if (jobEnded) {
        claimReward(activeJobs, work, tasks[work].reward);
        renderJobs();
      } else {
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

const renderProducts = (tab) => {
  const shop = document.getElementById("shop");
  shop.innerHTML = null;
  let developers = getAccountProperty(STORAGE.DEVELOPERS);
  let objects = getAccountProperty(STORAGE.OBJECTS);
  let balance = getAccountProperty(STORAGE.BALANCE);

  products[tab].forEach((product) => {
    let isAlreadyHired = Object.keys(developers).includes(String(product.id));
    let isProductOnMap = Object.keys(objects).includes(String(product.id));

    const item = document.createElement("div");

    const buy = document.createElement("button");
    buy.innerText =
      tab === TABS.DEVELOPER
        ? isAlreadyHired
          ? "FIRE"
          : "HIRE"
        : isProductOnMap
          ? "SELL"
          : "BUY";
    buy.className = isAlreadyHired || isProductOnMap ? "remove" : "item-buy";

    if (product.price > balance) {
      buy.disabled = true;
    }

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

    if (product.skills) {
      let formattedSkills = "";

      product.skills.forEach((skill, i) => {
        if (i === product.skills.length - 1) {
          formattedSkills += `${skill}`;
        } else {
          formattedSkills += `${skill}, `;
        }
      });
      const skills = document.createElement("p");
      skills.style.margin = 0;
      skills.style.fontSize = "12px";
      skills.style.paddingTop = "5px";
      skills.style.paddingBottom = "5px";
      skills.innerText = formattedSkills;

      content.appendChild(skills);
    }

    const imageContainer = document.createElement("div");
    imageContainer.appendChild(product.icon);
    product.icon.style.maxWidth = "100%";

    item.className = "item";
    item.id = product.id;
    item.appendChild(imageContainer);
    item.appendChild(content);
    item.appendChild(buy);

    buy.onclick = function () {
      if (isAlreadyHired || isProductOnMap) {
        let assets = getAccountProperty(STORAGE.ASSETS);
        let newBalance = balance;
        let balanceAmountElement = document.getElementById("balance-amount");

        let accountLayouts = getAccountProperty(STORAGE.LAYOUT);

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

        objectsCtx.clearRect(
          objects[product.id].x * TILE_SIZE,
          objects[product.id].y * TILE_SIZE,
          objects[product.id].cursor[0] * TILE_SIZE,
          objects[product.id].cursor[1] * TILE_SIZE
        );

        let newLayout = accountLayouts.filter((layout) => String(layout) !== String(layoutToRemove));

        delete objects[product.id];

        if (product.type === TYPES.DEVELOPER) {
          newBalance = Number(balance) - 2000;
          delete developers[product.id];
          updateAccountProperty(STORAGE.DEVELOPERS, developers);
        } else {
          newBalance = Number(balance) + parseInt(product.price / 2);
        }

        updateAccountProperty(STORAGE.LAYOUT, newLayout);
        updateAccountProperty(STORAGE.OBJECTS, objects);
        updateAccountProperty(STORAGE.BALANCE, newBalance);
        updateAccountProperty(STORAGE.ASSETS, Number(assets) - Number(product.price));

        renderProducts(tab);

        animateValue(balanceAmountElement, Number(balance), Number(newBalance), 1000);

        updateLog({
          timestamp: moment().format("LT"),
          message:
            product.type === "developer"
              ? `-$ ${formatNumber(2000)} severance pay`
              : `sold on used marketplace for $ ${formatNumber(
                parseInt(product.price / 2)
              )}`,
        });
      } else {
        if (product.price <= balance) {
          customStorage.setter(STORAGE.SELECTED, product.id);
          cursor = product.cursor;
          shopActive = false;
          grabbed = true;

          newBalance = balance - product.price;

          handleShopClose();
        }
      }
    };

    shop.append(item);
  });
};

function setTab(newTab) {
  tab = newTab;

  Object.values(TABS).forEach((tab) => {
    let active = tab === newTab;
    if (active) renderProducts(tab);
    document.getElementById(`item-${tab}`).setAttribute("active", active);
  });
}

const claimReward = function (activeJobs, job, reward, expense) {
  let balance = getAccountProperty(STORAGE.BALANCE);
  let levelProgress = getAccountProperty(STORAGE.LEVEL_PROGRESS);
  let level = getAccountProperty(STORAGE.LEVEL);
  let tasks = customStorage.getter({}, STORAGE.TASKS);
  let newBalance = balance + reward - expense;

  let newLevelProgress = levelProgress + tasks[job].points;

  // When progress bar reaches or surpasses level 100
  if (newLevelProgress >= 100) {
    let updatedLevel = level + 1;

    updateLevel(0, newLevelProgress - 100);
    updateAccountProperty(STORAGE.LEVEL_PROGRESS, newLevelProgress - 100);
    updateAccountProperty(STORAGE.LEVEL, updatedLevel);
    document.querySelector("#level").firstElementChild.innerHTML = `LEVEL ${updatedLevel}`;
  } else {
    updateLevel(levelProgress, newLevelProgress);
    updateAccountProperty(STORAGE.LEVEL_PROGRESS, newLevelProgress);
  }

  const balanceAmountElement = document.getElementById("balance-amount");

  updateLog({ timestamp: moment().format("LT"), message: `$ ${formatNumber(reward)} claimed` });
  updateLog({ timestamp: moment().format("LT"), message: `-$ ${formatNumber(expense)} in expense` });

  delete activeJobs[job];
  updateAccountProperty(STORAGE.ACTIVE_JOBS, activeJobs);
  updateAccountProperty(STORAGE.BALANCE, newBalance);
  animateValue(balanceAmountElement, Number(balance), Number(newBalance), 1000);
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
    // renderJobs();

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

document.addEventListener("mousedown", (e) => {
  let activeJobs = getAccountProperty(STORAGE.ACTIVE_JOBS);
  if (e.target.className === "bar") {
    let completed = e.target.getAttribute("completed");

    if (completed === "false") return;

    let job = Number(e.target.getAttribute("job"));
    let reward = Number(e.target.getAttribute("reward"));

    claimReward(
      activeJobs,
      job,
      reward,
      PRODUCT_LIST[Number(activeJobs[job].developer)].expense
    );
    renderJobs();
    renderActiveJobs();
  }
});

const renderActiveJobs = function () {
  let activeJobs = getAccountProperty(STORAGE.ACTIVE_JOBS);

  const empty = document.createElement("p");
  empty.style.color = "rgba(0,0,0,0.8)";
  empty.style.margin = 0;
  empty.style.padding = "10px 20px";
  empty.innerText = "No active job";

  const activeJobsContent = document.getElementById("active-jobs-content");
  activeJobsContent.innerHTML = null;

  if (Object.keys(activeJobs).length === 0) return activeJobsContent.append(empty);

  Object.keys(activeJobs).forEach((id) => {
    let job = activeJobs[id];

    const timeDiff = moment().diff(job.finish, "second");

    let jobItem = document.createElement("div");
    jobItem.className = "job-item";

    const jobTitle = document.createElement("p");
    jobTitle.innerText = job.title;
    jobTitle.className = "title";

    const developerName = document.createElement("p");
    developerName.innerText = PRODUCT_LIST[job.developer].name;
    developerName.className = "id-developer";

    const progress = renderProgressbar(job.duration * 60, timeDiff, job.reward, id);

    jobItem.append(jobTitle, developerName);

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

/**
 * Represents a book.
 * @param {Object} log - log object with timestamp and message
 */
const updateLog = (log) => {
  let content = document.getElementById("logs");

  let heading = document.createElement("p");
  heading.className = "heading";
  let timestamp = document.createElement("p");
  timestamp.className = "timestamp";

  let container = document.createElement("div");

  heading.append(log.message);
  timestamp.append(log.timestamp);

  container.append(heading, timestamp);

  container.className = "item";

  content.append(container);

  let logs = document.getElementById("logs");
  logs.scrollTop = logs.scrollHeight;
};

/** Clear item from selection on ESC key press */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    grabbed = false;
    cursor = [1, 1];
  }
});

window.setInterval(() => renderActiveJobs(), 200);

function moveGameMap() {
  let elm = document.getElementById('frame');

  elm.onmousedown = (e) => {
    if (e.button !== 0) return

    document.onmousemove = (i) => {
      elm.style.top = `${i.clientY - (e.offsetY + 90)}px`
      elm.style.left = `${i.clientX - (e.offsetX + 30)}px`
    }

    document.onmouseup = () => {
      document.onmousedown = null;
      document.onmousemove = null;
    }
  }
}

moveGameMap();