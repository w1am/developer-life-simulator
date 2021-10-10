var canvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#grid'))
var objectsCanvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#objects'))
var devCanvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#dev'))
const ctx = canvas.getContext("2d");
const objectsCtx = objectsCanvas.getContext("2d");
const devCtx = devCanvas.getContext("2d");

localStorage.setItem('layout', JSON.stringify([]))

let shopActive = false
let grabbed = false
let newPrice = 0
let cursor = [1, 1]
const [TILE_WIDTH, TILE_HEIGHT] = [10, 10]
const TABS = ['servers', 'developers', 'entertainment', 'services']
let tab = [TABS[0]]

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// when game loads
localStorage.setItem('balance', 122000)
localStorage.setItem('developers', JSON.stringify({}))
document.getElementById('balance-amount').innerText = 122000
let balance = Number(localStorage.getItem('balance'))

// const table = document.createElement('img');
// table.onload = function () {
//   objectsCtx.drawImage(table, 2 * 64, 4 * 64, 192, 128)
// }
// table.src = "./table.png";
// [[2, 4], [4, 5]]

// const layout = [
//   [[2, 4], [4, 5]]
// ]

const getter = function (initialState, key) {
  let temp = initialState
  const previous = JSON.parse(localStorage.getItem(key))
  if (previous) temp = previous
  return temp
}

class Product {
  constructor(id, name, icon, price, cursor) {
    this.id = id
    this.name = name
    this.icon = icon
    this.price = price
    this.cursor = cursor
    this.type = 'product'
  }
}

class Developer {
  constructor(id, name, icon, price, skills, cursor) {
    this.id = id
    this.name = name
    this.icon = icon
    this.price = price
    this.cursor = cursor
    this.skills = skills
    this.type = 'developer'
  }
}

class Job {
  constructor(id, title, reward, company, duration, requirements) {
    this.id = id;
    this.title = title;
    this.reward = reward
    this.company = company
    this.duration = duration
    this.requirements = requirements
    this.type = 'job'
  }
}

class Requirement {
  constructor(title, icon, prefix, palette) {
    this.title = title
    this.icon = icon
    this.prefix = prefix
    this.palette = palette
    this.type = 'requirement'
  }
}

const jobs = [
  new Job(0, 'Coffee review Website', 10000, 'frestea', 0.2, [new Requirement('Python', '', 'PY', ["#173248", "white"]), new Requirement('Javascript', '', 'JS', ["#EAD41B", "#000000"])]),
  new Job(1, 'Ecommerce Website', 45000, 'econovu', 2, [new Requirement('Javascript', '', 'JS', ["#EAD41B", "#000000"])]),
  new Job(2, 'Alt coin trading platform', 75000, 'traderex', 5, [new Requirement('Scala', '', 'Scala', ["#D12F2D", "#000000"]), new Requirement('Java', '', 'Java', ["#E97B18", "#4A738E"])])
]

let products = [];

const pixels = 2;
const tileSize = 2 * 32;

// for (let i = 0; i < 10; i += 1) {
//   for (let j = 0; j < 10; j += 1) {
//     devCtx.strokeStyle = "red"
//     devCtx.strokeText(`${i}, ${j}`, (i * tileSize) + (tileSize / 2) - 10, (j * tileSize) + (tileSize / 2) + 5)
//   }
// }

const clearRect = function () {
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      ctx.clearRect(i * tileSize, j * tileSize, 64, 64)
    }
  }
}

const inRange = function (num, ranges) {
  const coordX = num[0]
  const coordY = num[1]

  if (coordX >= ranges[0][0] && coordX <= ranges[0][1] && coordY >= ranges[1][0] && coordY <= ranges[1][1]) {
    return true
  }
  return false
}


const objectExists = function (coordX, coordY) {
  let layout = JSON.parse(localStorage.getItem('layout'))
  let pass = false

  for (let i = 0; i < layout.length; i += 1) {
    if (inRange([coordX, coordY], layout[i])) {
      pass = true
    }
  }
  return pass
}

const detectObject = function (coordX, coordY) {
  let detected = false
  let layout = JSON.parse(localStorage.getItem('layout'))

  if (coordX + (cursor[0] - 1) >= TILE_WIDTH || coordY + (cursor[1] - 1) >= TILE_HEIGHT) return true

  if (layout.length === 0) return false

  for (let i = coordX; i <= coordX + cursor[0] - 1; i += 1) {
    for (let j = coordY; j <= coordY + cursor[1] - 1; j += 1) {
      if (objectExists(i, j)) detected = true
    }
  }
  return detected
}

document.addEventListener('mousemove', (event) => {
  clearRect()

  const selected = JSON.parse(localStorage.getItem('selected'))

  const map = document.getElementById('map').getBoundingClientRect();
  const [mouseX, mouseY] = [event.clientX, event.clientY]
  const { left, right, top, bottom } = map;

  if (mouseX >= left && mouseX < right && mouseY >= top && mouseY < bottom) {
    let mousex = event.clientX - map.left
    let mousey = event.clientY - map.top

    const [coordX, coordY] = [Math.floor(mousex / 64), Math.floor(mousey / 64)]

    if (!detectObject(coordX, coordY)) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.strokeRect(coordX * tileSize, coordY * tileSize, 64 * cursor[0], 64 * cursor[1]);

      if (grabbed) {
        ctx.drawImage(inventory[selected], coordX * tileSize, coordY * tileSize, 64 * cursor[0], 64 * cursor[1])
      }
    }

  }
})

const amazonServer = document.createElement('img');
amazonServer.src = "./rds.png";

const azureServer = document.createElement('img');
azureServer.src = "./server.png";

const firebaseServer = document.createElement('img');
firebaseServer.src = "./firebase.png";

const developer1 = document.createElement('img');
developer1.src = "./developer1.png";
const developer2 = document.createElement('img');
developer2.src = "./developer2.png";
const developer3 = document.createElement('img');
developer3.src = "./developer3.png";
const developer4 = document.createElement('img');
developer4.src = "./developer4.png";
const developer5 = document.createElement('img');
developer5.src = "./developer5.png";
const desk1 = document.createElement('img');
desk1.src = "./desk1.png";
const desk2 = document.createElement('img');
desk2.src = "./desk2.png";
const desk3 = document.createElement('img');
desk3.src = "./desk3.png";
const desk4 = document.createElement('img');
desk4.src = "./desk4.png";
const desk5 = document.createElement('img');
desk5.src = "./desk5.png";
const cafeImage = document.createElement('img');
cafeImage.src = "./cafe.png";
const bordRoomImage = document.createElement('img');
bordRoomImage.src = './boardroom.png'

const desk1Off = document.createElement('img');
desk1Off.src = "./desk1-off.png";
const desk2Off = document.createElement('img');
desk2Off.src = "./desk2-off.png";
const desk3Off = document.createElement('img');
desk3Off.src = "./desk3-off.png";
const desk4Off = document.createElement('img');
desk4Off.src = "./desk4-off.png";
const desk5Off = document.createElement('img');
desk5Off.src = "./desk5-off.png";

const disabledInventory = {
  3: desk1Off,
  4: desk2Off,
  5: desk3Off,
  6: desk4Off,
  7: desk5Off,
}

const inventory = {
  0: amazonServer,
  1: azureServer,
  2: firebaseServer,
  3: desk1,
  4: desk2,
  5: desk3,
  6: desk4,
  7: desk5,
  8: cafeImage,
  9: bordRoomImage
}

const product0 = new Product(0, "RDS", amazonServer, 1299, [1, 1])
const product1 = new Product(1, "Azure DB", azureServer, 2999, [1, 1])
const product2 = new Product(2, "Firebase", firebaseServer, 599, [1, 1])
const product3 = new Developer(3, "John", developer1, 30000, ['Python', 'Javascript'], [3, 2])
const product4 = new Developer(4, "Isabella", developer2, 15000, ['SQL', 'ReactJS'], [3, 2])
const product5 = new Developer(5, "Andrew", developer3, 20000, ['C++', 'ASP'], [3, 2])
const product6 = new Developer(6, "Bobby", developer4, 75000, ['Scala', 'Java'], [3, 2])
const product7 = new Developer(7, "Jade", developer5, 56000, ['AWS'], [3, 2])
const product8 = new Product(8, "Cafe", cafeImage, 45000, [3, 3])
const product9 = new Product(9, "Board Room", bordRoomImage, 25000, [3, 2])

const prods = [product0, product1, product2, product3, product4, product5, product6, product7, product8, product9]

document.getElementById('map').addEventListener('click', function (event) {
  if (shopActive) return
  if (!grabbed) return

  const map = document.getElementById('map').getBoundingClientRect();
  const [mouseX, mouseY] = [event.clientX, event.clientY]
  const { left, right, top, bottom } = map;

  if (mouseX >= left && mouseX < right && mouseY >= top && mouseY < bottom) {
    let mousex = event.clientX - map.left
    let mousey = event.clientY - map.top

    const [coordX, coordY] = [Math.floor(mousex / 64), Math.floor(mousey / 64)]

    if (!detectObject(coordX, coordY)) {
      let layout = JSON.parse(localStorage.getItem('layout'))

      localStorage.setItem('balance', newPrice)
      document.getElementById('balance-amount').innerText = newPrice

      const storageSelected = localStorage.getItem('selected');

      objectsCtx.drawImage(inventory[storageSelected], coordX * 64, coordY * 64, 64 * cursor[0], 64 * cursor[1])

      layout.push([[coordX, coordX + cursor[0] - 1], [coordY, coordY + cursor[1] - 1]])
      localStorage.setItem('layout', JSON.stringify(layout))

      if (prods[storageSelected].type === 'developer') {
        let developers = getter({}, 'developers')

        developers[prods[storageSelected].id] = {
          id: prods[storageSelected].id,
          skills: prods[storageSelected].skills,
          active: false,
          jobId: null,
          tile: [coordX, coordY],
          cursor,
          image: storageSelected
        }

        localStorage.setItem('developers', JSON.stringify(developers))
      }

      localStorage.removeItem('selected')
    }
    grabbed = false
    cursor = [1, 1]

  }
})

products = {
  'servers': [
    new Product(0, "RDS", amazonServer, 1299, [1, 1]),
    new Product(1, "Azure DB", azureServer, 2999, [1, 1]),
    new Product(2, "Firebase", firebaseServer, 599, [1, 1]),
  ],
  'developers': [
    new Developer(3, "John", developer1, 30000, ['Python', 'Javascript'], [3, 2]),
    new Developer(4, "Isabella", developer2, 15000, ['SQL', 'ReactJS'], [3, 2]),
    new Developer(5, "Andrew", developer3, 20000, ['C++', 'ASP'], [3, 2]),
    new Developer(6, "Bobby", developer4, 75000, ['Scala', 'Java'], [3, 2]),
    new Developer(7, "Jade", developer5, 56000, ['AWS'], [3, 2]),
  ],
  'entertainment': [
    new Product(8, "Cafe", cafeImage, 45000, [3, 3]),
    new Product(9, "Board Room", bordRoomImage, 25000, [3, 2]),
  ],
  'services': [

  ]
}

const checkJobAvailability = function (work) {
  let developers = getter({}, 'developers')
  let storageJobs = getter([], 'jobs')

  const requirements = work.requirements

  let pass = false
  requirements.forEach((requirement, count) => {
    Object.keys(developers).forEach((developer) => {
      if (developers[developer].skills.includes(requirement.title) && !developers[developer].active && count == requirements.length - 1) pass = true
    })
  })

  if (storageJobs[work.id]) {
    if (storageJobs[work.id].ended) {
      return false
    }
    return true
  } else if (!pass) {
    return true
  } else {
    return false
  }
}

const makeWorkerBusy = function (requirements, jobId) {
  let developers = getter({}, 'developers')

  let pass = false
  let selected = null
  requirements.forEach((requirement, count) => {
    Object.keys(developers).forEach((developer) => {
      if (developers[developer].skills.includes(requirement.title) && count == requirements.length - 1) {
        pass = true
        selected = developer
      }
    })
  })

  if (pass) {
    objectsCtx.clearRect(developers[selected].tile[0] * 64, developers[selected].tile[1] * 64, 64 * developers[selected].cursor[0], 64 * developers[selected].cursor[1])
    objectsCtx.drawImage(disabledInventory[developers[selected].image], developers[selected].tile[0] * 64, developers[selected].tile[1] * 64, 64 * developers[selected].cursor[0], 64 * developers[selected].cursor[1])
    developers[selected] = { ...developers[selected], active: true, jobId }
    localStorage.setItem('developers', JSON.stringify(developers))
  } else {
    return false
  }
}

const makeWorkerFree = function (jobId) {
  let developers = getter({}, 'developers')
  let selected = null

  Object.keys(developers).forEach((developer) => {
    if (developers[developer].jobId === Number(jobId)) {
      selected = developer
    }
  })

  if (!selected) return
  objectsCtx.clearRect(developers[selected].tile[0] * 64, developers[selected].tile[1] * 64, 64 * developers[selected].cursor[0], 64 * developers[selected].cursor[1])
  objectsCtx.drawImage(inventory[developers[selected].image], developers[selected].tile[0] * 64, developers[selected].tile[1] * 64, 64 * developers[selected].cursor[0], 64 * developers[selected].cursor[1])

  developers[selected] = { ...developers[selected], active: false, jobId: null }
  localStorage.setItem('developers', JSON.stringify(developers))
}

const renderJobs = function () {
  const job = document.getElementById('job');
  job.innerHTML = null

  let storageJobs = getter({}, 'jobs')

  jobs.forEach((work) => {
    const item = document.createElement('div')
    item.id = 'job-item'
    item.style.position = 'relative'

    // const locked = document.createElement('div')
    // locked.className = 'locked'
    // locked.innerText = 'Locked'

    // item.append(locked)

    const title = document.createElement('p')
    title.innerText = work.title
    title.id = 'job-item-title'

    const reward = document.createElement('p')
    reward.innerText = '$ ' + work.reward

    const company = document.createElement('company')
    company.innerText = 'By ' + work.company
    company.id = 'job-item-company'

    const flow = document.createElement('div')
    const duration = document.createElement('p')
    const clock = document.createElement('i')
    clock.className = 'fa fa-clock-o'
    clock.style.color = 'rgb(94, 94, 94)'
    flow.style.display = 'flex'
    flow.style.columnGap = '5px'
    duration.innerText = work.duration + ' Minutes'
    duration.style.color = 'rgb(94, 94, 94)'
    duration.style.fontWeight = 'bold'
    flow.append(clock)
    flow.append(duration)

    const requirements = document.createElement('div')
    requirements.className = 'job-item-requirements'
    requirements.style.marginBottom = '8px'
    work.requirements.forEach((requirement) => {
      const requirementItem = document.createElement('div')
      requirementItem.style.backgroundColor = requirement.palette[0]
      requirementItem.style.color = requirement.palette[1]
      requirementItem.className = 'job-item-requirements-item'
      requirementItem.innerText = requirement.prefix
      requirements.append(requirementItem)
    })

    const accept = document.createElement('button')
    accept.innerText = storageJobs[work.id] && storageJobs[work.id].ended ? 'Claim reward' : "Accept job"
    accept.setAttribute('status', storageJobs[work.id] && storageJobs[work.id].ended ? 'claim' : 'open')
    accept.disabled = checkJobAvailability(work);
    accept.onclick = function () {
      if (storageJobs[work.id] && storageJobs[work.id].ended) {
        claim(storageJobs, work.id, work.reward)

        renderJobs()
      } else {
        storageJobs[work.id] = {
          title: work.title,
          reward: work.reward,
          requirements: work.requirements,
          finish: moment().add(work.duration, 'minute'),
          duration: work.duration,
          ended: false
        }

        localStorage.setItem('jobs', JSON.stringify(storageJobs))

        const jobMenu = document.getElementById('job-menu');
        jobMenu.hidden = true
      }

      refreshJobs()

      makeWorkerBusy(work.requirements, work.id)
      checkJobAvailability(work)
    }

    const requirementTitle = document.createElement('p')
    requirementTitle.innerText = 'Requirements'
    requirementTitle.style.fontSize = '14px'
    requirementTitle.style.fontWeight = 'bold'
    requirementTitle.style.margin = '5px 0px'
    requirementTitle.style.paddingTop = '8px'
    requirementTitle.style.color = 'rgba(0, 0, 0, 0.8)'
    requirementTitle.style.borderTop = '1px solid rgba(0, 0, 0, 0.15)'

    item.append(title)
    item.append(reward)
    item.append(company)
    item.append(flow)
    item.append(requirementTitle)
    item.append(requirements)
    item.append(accept)

    job.append(item)
  })
}

const renderProducts = function (tab, balance) {
  const shop = document.getElementById('shop');

  shop.innerHTML = null

  products[tab].forEach((product) => {
    const item = document.createElement('div')

    const buy = document.createElement('button')
    buy.id = 'item-buy'
    buy.innerText = tab === 'developers' ? 'HIRE' : 'BUY'

    if (product.price > balance) {
      buy.disabled = true
    }

    const content = document.createElement('div')
    content.style.display = 'block'
    content.style.textAlign = 'center'

    const title = document.createElement('p')
    title.style.margin = 0
    title.style.fontWeight = 'bold'
    title.innerText = product.name

    const price = document.createElement('p')
    price.style.margin = 0
    price.innerText = `$ ${product.price}`

    content.appendChild(title)
    content.appendChild(price)

    if (product.skills) {
      let formattedSkills = ''

      product.skills.forEach((skill, i) => {
        if (i === product.skills.length - 1) {
          formattedSkills += `${skill}`
        } else {
          formattedSkills += `${skill}, `
        }
      })
      const skills = document.createElement('p')
      skills.style.margin = 0
      skills.style.fontSize = "12px"
      skills.style.paddingTop = "5px"
      skills.style.paddingBottom = "5px"
      skills.innerText = formattedSkills

      content.appendChild(skills)
    }

    const imageContainer = document.createElement('div');
    imageContainer.appendChild(product.icon);
    product.icon.style.maxWidth = '100%'

    item.className = "item"
    item.id = product.id
    item.appendChild(imageContainer)
    item.appendChild(content)
    item.appendChild(buy)
    buy.onclick = function () {
      if (product.price <= balance) {
        cursor = product.cursor

        shopActive = false
        grabbed = true

        localStorage.setItem('selected', product.id)

        const shopMenu = document.getElementById('shop-menu');
        shopMenu.hidden = true

        const grid = document.getElementById('grid');
        grid.hidden = false

        newPrice = balance - product.price
      }

    }

    shop.append(item)
  })
}

document.getElementById('content-shop').parentElement.addEventListener('click', () => {
  balance = Number(localStorage.getItem('balance'))
  shopActive = true

  const shopMenu = document.getElementById('shop-menu');
  shopMenu.hidden = false

  const grid = document.getElementById('grid');
  grid.hidden = true

  renderProducts(tab, balance)
})

document.getElementById('content-job').parentElement.addEventListener('click', () => {
  const jobMenu = document.getElementById('job-menu');
  jobMenu.hidden = false

  renderJobs()
})

function handleJobClose() {
  const jobMenu = document.getElementById('job-menu');
  jobMenu.hidden = true
}

function handleShopClose() {
  shopActive = false

  const shopMenu = document.getElementById('shop-menu');
  shopMenu.hidden = true

  const grid = document.getElementById('grid');
  grid.hidden = false
}

function setTab(newTab) {
  tab = newTab

  TABS.forEach((tab) => {
    if (tab === newTab) {
      document.getElementById(`item-${tab}`).setAttribute('active', true)
      renderProducts(tab, balance)
    } else {
      document.getElementById(`item-${tab}`).setAttribute('active', false)
    }
  })
}

const endWork = function (workId) {
  const jobs = getter({}, 'jobs')
  jobs[workId] = { ...jobs[workId], ended: true }
  localStorage.setItem('jobs', JSON.stringify(jobs))
}

const claim = function (storageJobs, job, reward) {
  const balance = localStorage.getItem('balance')
  const newBalance = Number(balance) + Number(reward)
  localStorage.setItem('balance', newBalance)

  const obj = document.getElementById('balance-amount');

  delete storageJobs[job]
  localStorage.setItem('jobs', JSON.stringify(storageJobs))

  jobs.splice(job, 1)

  animateValue(obj, Number(balance), Number(newBalance), 1000)
}

const renderProgressbar = function (final, current, reward, job) {
  let storageJobs = getter({}, 'jobs')

  const container = document.createElement('div')
  container.className = 'progressbar-container'

  const bar = document.createElement('div')
  bar.className = 'progressbar'
  bar.setAttribute('completed', false)

  if (current >= 0) {
    makeWorkerFree(job)
    endWork(job)
    renderJobs()

    bar.style.backgroundColor = 'green'
    bar.style.cursor = 'pointer'
    bar.onclick = function (event) {
      event.preventDefault()
      claim(storageJobs, job, reward)
    }
    bar.setAttribute('completed', true)
    bar.innerText = 'Claim cash'
  } else {
    bar.style.width = `${100 - ((100 / final) * Math.abs(current))}%`
    bar.style.backgroundColor = '#6d0cce'
  }

  container.append(bar)

  return container
}

const refreshJobs = function () {
  let storageJobs = {}
  const previousJobs = JSON.parse(localStorage.getItem('jobs'))
  if (previousJobs) storageJobs = previousJobs

  const empty = document.createElement('p')
  empty.style.color = 'rgba(0,0,0,0.8)'
  empty.style.margin = 0;
  empty.style.padding = '10px 20px';
  empty.innerText = 'No active job'

  const dashboardContent = document.getElementById('dashboard-content')
  dashboardContent.innerHTML = null

  if (Object.keys(storageJobs).length === 0) {
    dashboardContent.append(empty)
  } else {
    Object.keys(storageJobs).forEach((job) => {
      const timeDiff = moment().diff(storageJobs[job].finish, 'second')

      const jobProfile = document.createElement('div')
      jobProfile.className = 'job-profile'

      const dashboardInformationContent = document.createElement('div')
      dashboardInformationContent.className = 'dashboardInformationContent'

      const jobTitle = document.createElement('p')
      jobTitle.innerText = storageJobs[job].title
      jobTitle.className = 'jobTitle'

      const progress = renderProgressbar(storageJobs[job].duration * 60, timeDiff, storageJobs[job].reward, job)

      dashboardInformationContent.append(jobTitle)

      const requirements = document.createElement('div')
      requirements.className = 'job-item-requirements'
      requirements.style.marginBottom = '8px'
      storageJobs[job].requirements.forEach((requirement) => {
        const requirementItem = document.createElement('div')
        requirementItem.style.backgroundColor = requirement.palette[0]
        requirementItem.style.color = requirement.palette[1]
        requirementItem.className = 'job-item-requirements-item'
        requirementItem.innerText = requirement.prefix
        requirements.append(requirementItem)
      })

      dashboardInformationContent.append(requirements)
      dashboardInformationContent.append(progress)

      jobProfile.append(dashboardInformationContent)

      dashboardContent.append(jobProfile)

    })
  }
}

refreshJobs()

const x = setInterval(() => {
  refreshJobs()
}, 500);