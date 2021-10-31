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

let shopActive = false;
let grabbed = false;
let newPrice = 0;
let cursor = [1, 1];
let tab = [TABS.SERVER];

// On mount
customStorage.setter(STORAGE.EVENTS, {
  0: new Job(0, "Coffee review Website", 10000, "frestea", 5, [
    new Requirement("Python", "", "PY", ["#173248", "white"]),
    new Requirement("Javascript", "", "JS", ["#EAD41B", "#000000"]),
  ], 80),
  1: new Job(1, "Ecommerce Website", 45000, "econovu", 0.1, [
    new Requirement("Javascript", "", "JS", ["#EAD41B", "#000000"]),
  ], 90),
  2: new Job(2, "Alt coin trading platform", 75000, "traderex", 0.1, [
    new Requirement("Scala", "", "Scala", ["#D12F2D", "#000000"]),
    new Requirement("Java", "", "Java", ["#E97B18", "#4A738E"]),
  ], 60),
});

let authed_user = customStorage.getter(
  {},
  AUTHENTICATION_STORAGE.AUTHENTICATED_USER
);

let balance = getAccountProperty(STORAGE.BALANCE);

let level = getAccountProperty(STORAGE.LEVEL);
document.querySelector("#level").firstElementChild.innerHTML = `LEVEL ${level}`

const updateLevel = (before, after) => {
  const levelProgress = document.getElementById("level-progress-bar");

  animateValue(levelProgress, before, (200 / 100) * after, 1000, true)
}

updateLevel(0, getAccountProperty(STORAGE.LEVEL_PROGRESS));

document.getElementById("balance-amount").innerText = formatNumber(balance);

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
  accounts[authed_user][field] = newValue;
  customStorage.setter(AUTHENTICATION_STORAGE.ACCOUNTS, accounts);
}

function getAccountProperty(field) {
  if (isAuthed) {
    let accounts = customStorage.getter({}, AUTHENTICATION_STORAGE.ACCOUNTS);
    return accounts[authed_user][field];
  }
}

let objects = getAccountProperty(STORAGE.OBJECTS);

setTimeout(() => {
  let developers = getAccountProperty(STORAGE.DEVELOPERS);

  Object.keys(objects).map((coords) => {
    drawText(objects[coords].name, "green", objects[coords].x, objects[coords].y, objects[coords].cursor)

    if (
      objects[coords].isDeveloper &&
      developers[parseInt(objects[coords].selected)].active
    ) {
      drawImage(
        objectsCtx,
        DISABLED_INVENTORY[parseInt(objects[coords].selected)],
        objects[coords].x,
        objects[coords].y,
        objects[coords].cursor[0],
        objects[coords].cursor[1]
      );
    } else {
      drawImage(
        objectsCtx,
        INVENTORY[parseInt(objects[coords].selected)],
        objects[coords].x,
        objects[coords].y,
        objects[coords].cursor[0],
        objects[coords].cursor[1]
      );
    }
  });
}, 100);

document.getElementById("map").addEventListener("click", function (event) {
  if (shopActive || !grabbed) return;
  const { coordX, coordY } = relativeCoordinates(event);

  if (detectObject(coordX, coordY)) return;

  let layout = getAccountProperty(STORAGE.LAYOUT);
  let objects = getAccountProperty(STORAGE.OBJECTS);

  updateAccountProperty(STORAGE.BALANCE, newPrice);
  let obj = document.getElementById("balance-amount");

  animateValue(obj, Number(balance), Number(newPrice), 1000);

  const storageSelected = localStorage.getItem(STORAGE.SELECTED);

  drawImage(
    objectsCtx,
    INVENTORY[storageSelected],
    coordX,
    coordY,
    cursor[0],
    cursor[1]
  );

  drawText(PRODUCT_LIST[storageSelected].name, "green", coordX, coordY, cursor)

  objects[[coordX, coordY]] = {
    x: coordX,
    y: coordY,
    cursor,
    isDeveloper: PRODUCT_LIST[storageSelected].type === TYPES.DEVELOPER,
    selected: storageSelected,
    name: PRODUCT_LIST[storageSelected].name
  };

  layout.push([
    [coordX, coordX + cursor[0] - 1],
    [coordY, coordY + cursor[1] - 1],
  ]);

  updateAccountProperty(STORAGE.LAYOUT, layout);
  updateAccountProperty(STORAGE.OBJECTS, objects);

  if (PRODUCT_LIST[storageSelected].type === TYPES.DEVELOPER) {
    let developers = getAccountProperty(STORAGE.DEVELOPERS);

    developers[PRODUCT_LIST[storageSelected].id] = {
      id: PRODUCT_LIST[storageSelected].id,
      skills: PRODUCT_LIST[storageSelected].skills,
      active: false,
      jobId: null,
      tile: [coordX, coordY],
      cursor,
      image: storageSelected,
    };

    updateAccountProperty(STORAGE.DEVELOPERS, developers);
  }

  localStorage.removeItem(STORAGE.SELECTED);

  grabbed = false;
  cursor = [1, 1];
});

let products = {
  [TABS.SERVER]: [product0, product1, product2],
  [TABS.DEVELOPER]: [product3, product4, product5, product6, product7],
  [TABS.ENTERTAINMENT]: [product8, product9],
  [TABS.SERVICE]: [],
};

const isJobDisabled = function (work) {
  let developers = getAccountProperty(TABS.DEVELOPER);
  let jobs = getAccountProperty(STORAGE.JOBS);

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
        count == requirements.length - 1
      ) {
        pass = true;
        selected = id;
      }
    });
  });

  if (pass) return selected
  else return null
}

const makeWorkerBusy = (requirements, jobId) => {
  let developers = getAccountProperty(STORAGE.DEVELOPERS);

  // let pass = false;
  // let selected = null;

  // requirements.forEach((requirement, count) => {
  //   Object.keys(developers).forEach((id) => {
  //     if (
  //       developers[id].skills.includes(requirement.title) &&
  //       count == requirements.length - 1
  //     ) {
  //       pass = true;
  //       selected = id;
  //     }
  //   });
  // });

  let selected = findDeveloper(requirements)

  if (!selected) return false

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

  let storageJobs = getAccountProperty(STORAGE.JOBS);

  let events = customStorage.getter({}, "events");

  Object.keys(events).forEach((work) => {
    const item = document.createElement("div");
    item.className = "job-item";

    const title = document.createElement("p");
    title.innerText = events[work].title;
    title.className = "title";

    const reward = document.createElement("p");
    reward.innerText = "$ " + formatNumber(events[work].reward);

    const company = document.createElement("company");
    company.innerText = "By " + events[work].company;
    company.className = "company";

    const flow = document.createElement("div");
    flow.className = "flow";
    const duration = (document.createElement("p").innerText =
      events[work].duration + " Minutes");

    const clock = document.createElement("i");
    clock.className = "fa fa-clock-o clock";

    flow.append(clock, duration);

    const requirements = document.createElement("div");
    requirements.className = "requirements";

    events[work].requirements.forEach((requirement) => {
      const requirementItem = document.createElement("div");
      requirementItem.className = "requirements-item";
      requirementItem.innerText = requirement.prefix;

      requirementItem.style.backgroundColor = requirement.palette[0];
      requirementItem.style.color = requirement.palette[1];

      requirements.append(requirementItem);
    });

    const accept = document.createElement("button");

    let jobEnded = storageJobs[work] && storageJobs[work].ended;

    accept.innerText = jobEnded ? "Claim reward" : "Accept job";
    accept.setAttribute("status", jobEnded ? "claim" : "open");
    if (!jobEnded) accept.disabled = isJobDisabled(events[work]);
    accept.onclick = function () {
      if (jobEnded) {
        claim(storageJobs, work, events[work].reward);
        renderJobs();
      } else {
        let selected = findDeveloper(events[work].requirements);

        storageJobs[work] = {
          title: events[work].title,
          reward: events[work].reward,
          requirements: events[work].requirements,
          finish: moment().add(events[work].duration, "minute"),
          duration: events[work].duration,
          ended: false,
          developer: selected
        };

        updateAccountProperty(STORAGE.JOBS, storageJobs);

        const jobMenu = document.getElementById("job-menu");
        jobMenu.hidden = true;

        renderActiveJobs();

        makeWorkerBusy(events[work].requirements, work);
        isJobDisabled(events[work]);
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

  products[tab].forEach((product) => {
    const item = document.createElement("div");

    const buy = document.createElement("button");
    buy.id = "item-buy";
    buy.innerText = tab === TABS.DEVELOPER ? "HIRE" : "BUY";

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
      if (product.price <= balance) {
        cursor = product.cursor;

        shopActive = false;
        grabbed = true;

        localStorage.setItem(STORAGE.SELECTED, product.id);

        document.getElementById("shop-menu").hidden = true;
        document.getElementById("grid").hidden = false;

        newPrice = balance - product.price;

        let assets = getAccountProperty(STORAGE.ASSETS);
        updateAccountProperty(STORAGE.ASSETS, (assets += product.price));
      }
    };

    shop.append(item);
  });
};

document
  .getElementById("content-shop")
  .parentElement.addEventListener("click", () => {
    shopActive = true;

    document.getElementById("shop-menu").hidden = false;
    document.getElementById("grid").hidden = true;

    renderProducts(tab);
  });

document
  .getElementById("content-job")
  .parentElement.addEventListener("click", () => {
    document.getElementById("job-menu").hidden = false;
    renderJobs();
  });

const handleJobClose = () =>
  (document.getElementById("job-menu").hidden = true);

const handleShopClose = () => {
  shopActive = false;
  document.getElementById("shop-menu").hidden = true;
  document.getElementById("grid").hidden = false;
};

function setTab(newTab) {
  tab = newTab;

  Object.values(TABS).forEach((tab) => {
    let active = tab === newTab;
    if (active) renderProducts(tab);
    document.getElementById(`item-${tab}`).setAttribute("active", active);
  });
}

const claim = function (storageJobs, job, reward, expense) {
  let events = customStorage.getter({}, STORAGE.EVENTS);
  const newBalance = (balance + Number(reward)) - expense;
  updateAccountProperty(STORAGE.BALANCE, newBalance);

  let levelProgress = getAccountProperty(STORAGE.LEVEL_PROGRESS);
  let level = getAccountProperty(STORAGE.LEVEL);

  let newLevelProgress = levelProgress + events[job].points;

  if (newLevelProgress >= 100) {
    let newLevel = level + 1

    updateLevel(0, newLevelProgress - 100)
    updateAccountProperty(STORAGE.LEVEL_PROGRESS, newLevelProgress - 100)
    document.querySelector("#level").firstElementChild.innerHTML = `LEVEL ${newLevel}`
    updateAccountProperty(STORAGE.LEVEL, newLevel)
  } else {
    updateLevel(levelProgress, newLevelProgress);
    updateAccountProperty(STORAGE.LEVEL_PROGRESS, newLevelProgress)
  }

  const obj = document.getElementById("balance-amount");

  updateLog({
    timestamp: moment().format("LT"),
    message: `$ ${formatNumber(reward)} claimed`
  });

  updateLog({
    timestamp: moment().format("LT"),
    message: `-$ ${formatNumber(expense)} in expense`
  });

  delete storageJobs[job];
  updateAccountProperty(STORAGE.JOBS, storageJobs);

  // delete events[job];
  // localStorage.setItem(STORAGE.EVENTS, JSON.stringify(events));

  animateValue(obj, Number(balance), Number(newBalance), 1000);
};

const endJob = (workId) => {
  let jobs = getAccountProperty(STORAGE.JOBS);
  jobs[workId] = { ...jobs[workId], ended: true };
  updateAccountProperty(STORAGE.JOBS, jobs);
};

const renderProgressbar = function (final, current, reward, job) {
  let storageJobs = getAccountProperty(STORAGE.JOBS);

  const container = document.createElement("div");
  container.className = "progressbar";

  const bar = document.createElement("div");
  bar.className = "bar";
  bar.setAttribute("completed", false);

  if (current >= 0) {
    makeWorkerFree(job);
    endJob(job);
    renderJobs();

    bar.style.backgroundColor = "green";
    bar.style.cursor = "pointer";
    bar.onclick = function (event) {
      event.preventDefault();
      claim(storageJobs, job, reward, PRODUCT_LIST[parseInt(storageJobs[job].developer)].price);
      renderJobs();
    };
    bar.setAttribute("completed", true);
    bar.innerText = "Claim reward";
  } else {
    bar.style.width = `${100 - (100 / final) * Math.abs(current)}%`;
    bar.style.backgroundColor = "#6d0cce";
  }

  container.append(bar);

  return container;
};

const renderActiveJobs = function () {
  let storageJobs = getAccountProperty(STORAGE.JOBS);

  const empty = document.createElement("p");
  empty.style.color = "rgba(0,0,0,0.8)";
  empty.style.margin = 0;
  empty.style.padding = "10px 20px";
  empty.innerText = "No active job";

  const activeJobsContent = document.getElementById("active-jobs-content");
  activeJobsContent.innerHTML = null;

  if (Object.keys(storageJobs).length === 0) {
    activeJobsContent.append(empty);
  } else {
    Object.keys(storageJobs).forEach((job) => {
      const timeDiff = moment().diff(storageJobs[job].finish, "second");

      let jobItem = document.createElement("div");
      jobItem.className = "job-item";

      const jobTitle = document.createElement("p");
      jobTitle.innerText = storageJobs[job].title;
      jobTitle.className = "title";

      const progress = renderProgressbar(
        storageJobs[job].duration * 60,
        timeDiff,
        storageJobs[job].reward,
        job
      );

      jobItem.append(jobTitle);

      const requirements = document.createElement("div");
      requirements.className = "requirements";
      requirements.style.marginBottom = "8px";
      storageJobs[job].requirements.forEach((requirement) => {
        const requirementItem = document.createElement("div");
        requirementItem.style.backgroundColor = requirement.palette[0];
        requirementItem.style.color = requirement.palette[1];
        requirementItem.className = "requirements-item";
        requirementItem.innerText = requirement.prefix;
        requirements.append(requirementItem);
      });

      jobItem.append(requirements);
      jobItem.append(progress);

      activeJobsContent.append(jobItem);
    });
  }
};

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
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    grabbed = false;
    cursor = [1, 1];
  }
})

window.setInterval(() => renderActiveJobs(), 1000);

window.setInterval(function () {
  var elem = document.getElementById('logs');
  elem.scrollTop = elem.scrollHeight;
}, 200);

let menus = ["shop-menu", "job-menu"]
let dragged = null

function dragMenu(menuId) {
  let elm = document.querySelector(`#${menuId}`).querySelector(".header")

  elm.lastElementChild.onmousedown = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  elm.lastElementChild.onmousemove = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  elm.onmousedown = (e) => {
    let menu = document.querySelector(`#${menuId}`)
    dragged = menuId

    menus.forEach((m, mIndex) => {
      if (menus[mIndex] === dragged) {
        menu.style.zIndex = "9999999999999999999999"
        menu.querySelector(".header").setAttribute('active', true)
      } else {
        document.querySelector(`#${m}`).style.zIndex = "99999999"
        document.querySelector(`#${m}`).querySelector(".header").setAttribute('active', false)
      }
    })

    document.onmousemove = (i) => {
      if (i.clientY - e.offsetY < 0) {
        menu.style.top = '0px'
      } else {
        menu.style.top = `${i.clientY - e.offsetY}px`
      }

      if (i.clientY + 440 > window.innerHeight) {
        menu.style.top = `${window.innerHeight - 440}px`
      }

      if (i.clientX - e.offsetX < 0) {
        menu.style.left = '0px'
      } else {
        menu.style.left = `${i.clientX - e.offsetX}px`
      }

      if (i.clientX + (600 - e.offsetX) > window.innerWidth) {
        menu.style.left = `${window.innerWidth - 600}px`
      }
    }

    document.onmouseup = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}

dragMenu("shop-menu")
dragMenu("job-menu")