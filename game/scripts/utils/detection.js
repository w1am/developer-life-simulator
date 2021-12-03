"use strict"

import { STORAGE } from "../../../common/index.js"
import { getAccountProperty } from "../account.js"
import { TILE_HEIGHT_COUNT, TILE_WIDTH_COUNT } from "../main.js"

// Part of the objectExists function
// returns true if player's cursor is in item's range
const inRange = function (num, ranges) {
  const [coordX, coordY] = [num[0], num[1]]

  return coordX >= ranges[0][0] && coordX <= ranges[0][1] && coordY >= ranges[1][0] && coordY <= ranges[1][1]
}

// Check if object exists at current x and y position
const objectExists = function (coordX, coordY) {
  // Layouts are just 2D arrays that stores the width relative to its coordinates of an object in the map
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
 * @param {number} cursor - cursor of the item
 *
 * @example
 *
 *     detectObject(5, 4, [1, 1])
 */
export const detectObject = function (coordX, coordY, cursor) {
  let detected = false
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