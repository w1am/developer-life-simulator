const inRange = function (num, ranges) {
  const [coordX, coordY] = [num[0], num[1]]

  return coordX >= ranges[0][0] && coordX <= ranges[0][1] && coordY >= ranges[1][0] && coordY <= ranges[1][1]
}

const objectExists = function (coordX, coordY) {
  // let layout = JSON.parse(localStorage.getItem(STORAGE.LAYOUT))
  let layout = getAccountProperty(STORAGE.LAYOUT)
  let pass = false

  for (let i = 0; i < layout.length; i += 1) {
    if (inRange([coordX, coordY], layout[i])) pass = true
  }
  return pass
}

/**
 * Detect if there is any object placed at coordinates x y on the map
 *
 * @param {number} coordX - X coordinate
 * @param {number} coordY - Y coordinate
 *
 * @example
 *
 *     detectObject(5, 4)
 */

const detectObject = function (coordX, coordY) {
  let detected = false
  // let layout = JSON.parse(localStorage.getItem(STORAGE.LAYOUT))
  let layout = getAccountProperty(STORAGE.LAYOUT)

  if (coordX + (cursor[0] - 1) >= TILE_WIDTH_COUNT || coordY + (cursor[1] - 1) >= TILE_HEIGHT_COUNT) return true

  if (layout.length === 0) return false

  for (let i = coordX; i <= coordX + cursor[0] - 1; i += 1) {
    for (let j = coordY; j <= coordY + cursor[1] - 1; j += 1) {
      if (objectExists(i, j)) detected = true
    }
  }
  return detected
}