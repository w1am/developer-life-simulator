var gridCanvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#grid'))
var objectsCanvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#objects'))
var devCanvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#dev'))

const gridCtx = gridCanvas.getContext("2d");
const objectsCtx = objectsCanvas.getContext("2d");
const devCtx = devCanvas.getContext("2d");

const test = 2

const PIXELS = 2
const TILE_SIZE = PIXELS * 32
const [TILE_WIDTH_COUNT, TILE_HEIGHT_COUNT] = [10, 10]

let shopActive = false
let grabbed = false
let newPrice = 0
let cursor = [1, 1]
let tab = [TABS.SERVER]

// On load
customStorage.setter(STORAGE.LAYOUT, [])
customStorage.setter(STORAGE.BALANCE, 122000)
customStorage.setter(TABS.DEVELOPER, {})
customStorage.setter(STORAGE.EVENTS, {
  0: new Job(0, 'Coffee review Website', 10000, 'frestea', 0.1, [new Requirement('Python', '', 'PY', ["#173248", "white"]), new Requirement('Javascript', '', 'JS', ["#EAD41B", "#000000"])]),
  1: new Job(1, 'Ecommerce Website', 45000, 'econovu', 0.1, [new Requirement('Javascript', '', 'JS', ["#EAD41B", "#000000"])]),
  2: new Job(2, 'Alt coin trading platform', 75000, 'traderex', 0.1, [new Requirement('Scala', '', 'Scala', ["#D12F2D", "#000000"]), new Requirement('Java', '', 'Java', ["#E97B18", "#4A738E"])])
})

document.getElementById('balance-amount').innerText = 122000
let balance = customStorage.getter(0, STORAGE.BALANCE)

document.addEventListener('mousemove', (event) => {
  clearRect()
  let selected = customStorage.getter(null, STORAGE.SELECTED)
  const { coordX, coordY } = relativeCoordinates(event)
  if (detectObject(coordX, coordY)) return

  gridCtx.strokeStyle = "white";
  gridCtx.lineWidth = 3;
  gridCtx.strokeRect(coordX * TILE_SIZE, coordY * TILE_SIZE, TILE_SIZE * cursor[0], TILE_SIZE * cursor[1]);
  if (grabbed) drawImage(gridCtx, INVENTORY[selected], coordX, coordY, cursor[0], cursor[1])
})

document.getElementById('map').addEventListener('click', function (event) {
  if (shopActive || !grabbed) return
  const { coordX, coordY } = relativeCoordinates(event)

  if (detectObject(coordX, coordY)) return

  let layout = JSON.parse(localStorage.getItem(STORAGE.LAYOUT))

  localStorage.setItem(STORAGE.BALANCE, newPrice)
  let obj = document.getElementById('balance-amount')

  animateValue(obj, Number(balance), Number(newPrice), 1000)

  const storageSelected = localStorage.getItem(STORAGE.SELECTED);

  drawImage(objectsCtx, INVENTORY[storageSelected], coordX, coordY, cursor[0], cursor[1])

  layout.push([[coordX, coordX + cursor[0] - 1], [coordY, coordY + cursor[1] - 1]])
  localStorage.setItem(STORAGE.LAYOUT, JSON.stringify(layout))

  if (PRODUCT_LIST[storageSelected].type === TYPES.DEVELOPER) {
    let developers = customStorage.getter({}, TABS.DEVELOPER)

    developers[PRODUCT_LIST[storageSelected].id] = {
      id: PRODUCT_LIST[storageSelected].id,
      skills: PRODUCT_LIST[storageSelected].skills,
      active: false,
      jobId: null,
      tile: [coordX, coordY],
      cursor,
      image: storageSelected
    }

    localStorage.setItem(TABS.DEVELOPER, JSON.stringify(developers))
  }

  localStorage.removeItem(STORAGE.SELECTED)

  grabbed = false
  cursor = [1, 1]
})

let products = {
  [TABS.SERVER]: [product0, product1, product2],
  [TABS.DEVELOPER]: [product3, product4, product5, product6, product7],
  [TABS.ENTERTAINMENT]: [product8, product9],
  [TABS.SERVICE]: []
}

const isJobDisabled = function (work) {
  let developers = customStorage.getter({}, TABS.DEVELOPER)
  let jobs = customStorage.getter([], STORAGE.JOBS)

  const requirements = work.requirements

  let pass = false
  requirements.forEach((requirement, count) => {
    Object.keys(developers).forEach((developer) => {
      if (developers[developer].skills.includes(requirement.title) && !developers[developer].active && count == requirements.length - 1) pass = true
    })
  })

  if (jobs[work.id] && jobs[work.id].ended) return true
  return false
}

const makeWorkerBusy = (requirements, jobId) => {
  let developers = customStorage.getter({}, TABS.DEVELOPER)

  let pass = false
  let selected = null

  requirements.forEach((requirement, count) => {
    Object.keys(developers).forEach((id) => {
      if (developers[id].skills.includes(requirement.title) && count == requirements.length - 1) {
        pass = true
        selected = id
      }
    })
  })

  if (!pass) return false

  objectsCtx.clearRect(developers[selected].tile[0] * TILE_SIZE, developers[selected].tile[1] * TILE_SIZE, TILE_SIZE * developers[selected].cursor[0], TILE_SIZE * developers[selected].cursor[1])
  objectsCtx.drawImage(DISABLED_INVENTORY[developers[selected].image], developers[selected].tile[0] * TILE_SIZE, developers[selected].tile[1] * TILE_SIZE, TILE_SIZE * developers[selected].cursor[0], TILE_SIZE * developers[selected].cursor[1])
  developers[selected] = { ...developers[selected], active: true, jobId }
  localStorage.setItem(STORAGE.DEVELOPERS, JSON.stringify(developers))
}

const makeWorkerFree = (jobId) => {
  let developers = customStorage.getter({}, TABS.DEVELOPER)
  let selected = null

  return Object.keys(developers).forEach((id) => {
    if (developers[id].jobId === jobId) {
      selected = Number(id)

      objectsCtx.clearRect(developers[selected].tile[0] * TILE_SIZE, developers[selected].tile[1] * TILE_SIZE, TILE_SIZE * developers[selected].cursor[0], TILE_SIZE * developers[selected].cursor[1])
      objectsCtx.drawImage(INVENTORY[developers[selected].image], developers[selected].tile[0] * TILE_SIZE, developers[selected].tile[1] * TILE_SIZE, TILE_SIZE * developers[selected].cursor[0], TILE_SIZE * developers[selected].cursor[1])

      developers[selected] = { ...developers[selected], active: false, jobId: null }
      localStorage.setItem(TABS.DEVELOPER, JSON.stringify(developers))
      return
    }
  })
}

const renderJobs = () => {
  const job = document.getElementById('job');
  job.innerHTML = null

  let storageJobs = customStorage.getter({}, STORAGE.JOBS)

  let events = customStorage.getter({}, 'events')

  Object.keys(events).forEach((work) => {
    const item = document.createElement('div')
    item.id = 'job-item'
    item.style.position = 'relative'

    const title = document.createElement('p')
    title.innerText = events[work].title
    title.id = 'job-item-title'

    const reward = document.createElement('p')
    reward.innerText = '$ ' + events[work].reward

    const company = document.createElement('company')
    company.innerText = 'By ' + events[work].company
    company.id = 'job-item-company'

    const flow = document.createElement('div')
    const duration = document.createElement('p')
    const clock = document.createElement('i')
    clock.className = 'fa fa-clock-o'
    clock.style.color = 'rgb(94, 94, 94)'
    flow.style.display = 'flex'
    flow.style.columnGap = '5px'
    duration.innerText = events[work].duration + ' Minutes'
    duration.style.color = 'rgb(94, 94, 94)'
    duration.style.fontWeight = 'bold'
    flow.append(clock, duration)

    const requirements = document.createElement('div')
    requirements.className = 'job-item-requirements'
    requirements.style.marginBottom = '8px'
    events[work].requirements.forEach((requirement) => {
      const requirementItem = document.createElement('div')
      requirementItem.style.backgroundColor = requirement.palette[0]
      requirementItem.style.color = requirement.palette[1]
      requirementItem.className = 'job-item-requirements-item'
      requirementItem.innerText = requirement.prefix
      requirements.append(requirementItem)
    })

    const accept = document.createElement('button')
    accept.innerText = storageJobs[work] && storageJobs[work].ended ? 'Claim reward' : "Accept job"
    accept.setAttribute('status', storageJobs[work] && storageJobs[work].ended ? 'claim' : 'open')
    accept.disabled = isJobDisabled(events[work]);
    accept.onclick = function () {
      if (storageJobs[work] && storageJobs[work].ended) {
        claim(storageJobs, work, events[work].reward)

        renderJobs()
      } else {
        storageJobs[work] = {
          title: events[work].title,
          reward: events[work].reward,
          requirements: events[work].requirements,
          finish: moment().add(events[work].duration, 'minute'),
          duration: events[work].duration,
          ended: false
        }

        localStorage.setItem(STORAGE.JOBS, JSON.stringify(storageJobs))

        const jobMenu = document.getElementById('job-menu');
        jobMenu.hidden = true
      }

      refreshJobs()

      makeWorkerBusy(events[work].requirements, work)
      isJobDisabled(events[work])
    }

    const requirementTitle = document.createElement('p')
    requirementTitle.innerText = 'Requirements'
    requirementTitle.style.fontSize = '14px'
    requirementTitle.style.fontWeight = 'bold'
    requirementTitle.style.margin = '5px 0px'
    requirementTitle.style.paddingTop = '8px'
    requirementTitle.style.color = 'rgba(0, 0, 0, 0.8)'
    requirementTitle.style.borderTop = '1px solid rgba(0, 0, 0, 0.15)'

    item.append(title, reward, company, flow, requirementTitle, requirements, accept)
    job.append(item)

  })
}

const renderProducts = (tab, balance) => {
  const shop = document.getElementById('shop');
  shop.innerHTML = null

  products[tab].forEach((product) => {
    const item = document.createElement('div')

    const buy = document.createElement('button')
    buy.id = 'item-buy'
    buy.innerText = tab === TABS.DEVELOPER ? 'HIRE' : 'BUY'

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

    content.append(title, price)

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

        localStorage.setItem(STORAGE.SELECTED, product.id)

        document.getElementById('shop-menu').hidden = true;
        document.getElementById('grid').hidden = false;

        newPrice = balance - product.price
      }

    }

    shop.append(item)
  })
}

document.getElementById('content-shop').parentElement.addEventListener('click', () => {
  balance = Number(localStorage.getItem(STORAGE.BALANCE))
  shopActive = true

  document.getElementById('shop-menu').hidden = false;
  document.getElementById('grid').hidden = true;

  renderProducts(tab, balance)
})

document.getElementById('content-job').parentElement.addEventListener('click', () => {
  document.getElementById('job-menu').hidden = false;
  renderJobs()
})

const handleJobClose = () => document.getElementById('job-menu').hidden = true;

const handleShopClose = () => {
  shopActive = false
  document.getElementById('shop-menu').hidden = true;
  document.getElementById('grid').hidden = false;
}

function setTab(newTab) {
  tab = newTab

  Object.values(TABS).forEach((tab) => {
    let active = tab === newTab
    if (active) renderProducts(tab, balance)
    document.getElementById(`item-${tab}`).setAttribute('active', active)
  })
}

const claim = function (storageJobs, job, reward) {
  let events = customStorage.getter({}, STORAGE.EVENTS)

  const balance = localStorage.getItem(STORAGE.BALANCE)
  const newBalance = Number(balance) + Number(reward)
  localStorage.setItem(STORAGE.BALANCE, newBalance)

  const obj = document.getElementById('balance-amount');

  delete storageJobs[job]
  localStorage.setItem(STORAGE.JOBS, JSON.stringify(storageJobs))

  delete events[job]
  localStorage.setItem(STORAGE.EVENTS, JSON.stringify(events))

  animateValue(obj, Number(balance), Number(newBalance), 1000)
}

const endJob = (workId) => {
  const jobs = customStorage.getter({}, STORAGE.JOBS)
  jobs[workId] = { ...jobs[workId], ended: true }
  localStorage.setItem(STORAGE.JOBS, JSON.stringify(jobs))
}

const renderProgressbar = function (final, current, reward, job) {
  let storageJobs = customStorage.getter({}, STORAGE.JOBS)

  const container = document.createElement('div')
  container.className = 'progressbar-container'

  const bar = document.createElement('div')
  bar.className = 'progressbar'
  bar.setAttribute('completed', false)

  if (current >= 0) {
    makeWorkerFree(job)
    endJob(job)
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
  const previousJobs = JSON.parse(localStorage.getItem(STORAGE.JOBS))
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

setInterval(() => refreshJobs(), 1000);