var canvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#grid'))
var objectsCanvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#objects'))
const ctx = canvas.getContext("2d");
const objectsCtx = objectsCanvas.getContext("2d");

let shopActive = false
let grabbed = false

class Product {
  constructor(id, name, icon, price) {
    this.id = id
    this.name = name
    this.icon = icon
    this.price = price
  }
}

let products = [];

const pixels = 2;
const tileSize = 2 * 32;

const clearRect = function () {
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      ctx.clearRect(i * tileSize, j * tileSize, 64, 64)
    }
  }
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

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(coordX * tileSize, coordY * tileSize, 64, 64);
  }
})

const amazonServer = document.createElement('img');
amazonServer.src = "./rds.png";

const azureServer = document.createElement('img');
azureServer.src = "./server.png";

const firebaseServer = document.createElement('img');
firebaseServer.src = "./firebase.png";

const inventory = {
  0: amazonServer,
  1: azureServer,
  2: firebaseServer
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

    const storageSelected = localStorage.getItem('selected');

    objectsCtx.drawImage(inventory[storageSelected], coordX * 64, coordY * 64, 64, 64)

    localStorage.removeItem('selected')
    grabbed = false
  }
})

products = [
  new Product(0, "RDS", amazonServer, 1299),
  new Product(1, "Azure DB", azureServer, 2999),
  new Product(2, "Firebase", firebaseServer, 599)
]

const shop = document.getElementById('shop');

products.forEach((product) => {
  const item = document.createElement('div')
  const buy = document.createElement('button')
  buy.id = 'item-buy'
  buy.innerText = 'BUY'

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

  item.className = "item"
  item.id = product.id
  item.appendChild(product.icon)
  item.appendChild(content)
  item.appendChild(buy)
  buy.onclick = function () {
    shopActive = false
    grabbed = true

    localStorage.setItem('selected', product.id)

    const shopMenu = document.getElementById('shop-menu');
    shopMenu.hidden = true

    const grid = document.getElementById('grid');
    grid.hidden = false
  }

  shop.append(item)
})


document.getElementById('shop-button').addEventListener('click', () => {
  shopActive = true

  const shopMenu = document.getElementById('shop-menu');
  shopMenu.hidden = false

  const grid = document.getElementById('grid');
  grid.hidden = true
})

function handleShopClose() {
  shopActive = false

  const shopMenu = document.getElementById('shop-menu');
  shopMenu.hidden = true
}