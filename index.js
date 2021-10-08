var canvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#grid'))
const ctx = canvas.getContext("2d");

class Product {
  constructor(name) {
    this.name = name
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

products = [
  new Product("RDS"),
  new Product("Azure DB"),
  new Product("Firebase")
]

const shop = document.getElementById('shop');

products.forEach((product) => {
  const item = document.createElement('div')
  item.className = "item"
  item.innerText = product.name

  shop.append(item)
})


