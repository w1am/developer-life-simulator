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
const TABS = ['servers', 'developers', 'services']
let tab = [TABS[0]]

// when game loads
localStorage.setItem('balance', 122000)
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

class Product {
  constructor(id, name, icon, price, cursor) {
    this.id = id
    this.name = name
    this.icon = icon
    this.price = price
    this.cursor = cursor
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
  }
}

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
desk5.c = "./desk5.png";

const inventory = {
  0: amazonServer,
  1: azureServer,
  2: firebaseServer,
  3: desk1,
  4: desk2,
  5: desk3,
  6: desk4,
  7: desk5,
}

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
    new Developer(3, "John", developer1, 30000, ['Python', 'JS'], [3, 2]),
    new Developer(4, "Isabella", developer2, 15000, ['SQL', 'ReactJS'], [3, 2]),
    new Developer(5, "Andrew", developer3, 20000, ['C++', 'ASP'], [3, 2]),
    new Developer(6, "Bobby", developer4, 75000, ['Scala', 'Java'], [3, 2]),
    new Developer(7, "Jade", developer5, 56000, ['AWS'], [3, 2]),
  ],
  'services': [

  ]
}


const renderProducts = function (tab, balance) {
  const shop = document.getElementById('shop');

  shop.innerHTML = null

  products[tab].forEach((product) => {
    const item = document.createElement('div')

    const buy = document.createElement('button')
    buy.id = 'item-buy'
    buy.innerText = 'BUY'

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

    item.className = "item"
    item.id = product.id
    item.appendChild(product.icon)
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



document.getElementById('content-shop').addEventListener('click', () => {
  balance = Number(localStorage.getItem('balance'))
  shopActive = true

  const shopMenu = document.getElementById('shop-menu');
  shopMenu.hidden = false

  const grid = document.getElementById('grid');
  grid.hidden = true

  renderProducts(tab, balance)
})

function handleShopClose() {
  shopActive = false

  const shopMenu = document.getElementById('shop-menu');
  shopMenu.hidden = true

  const grid = document.getElementById('grid');
  grid.hidden = false
}

function setTab(newTab) {
  tab = newTab
  renderProducts(tab, balance)

  TABS.forEach((tab) => {
    console.log(tab, newTab)
    if (tab === newTab) {
      document.getElementById(`item-${tab}`).setAttribute('active', true)
    } else {
      document.getElementById(`item-${tab}`).setAttribute('active', false)
    }
  })
}