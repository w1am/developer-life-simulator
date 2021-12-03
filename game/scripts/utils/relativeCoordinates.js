"use strict"

import { TILE_SIZE } from "../main.js";

/**
 * Convert current X and Y position into relative coordinates. For example [0,0], [0,1]
 * 
 * @param {MouseEvent} event - The mouse event objet
*/
export const relativeCoordinates = (event) => {
  const map = document.getElementById('map').getBoundingClientRect();
  const [mouseX, mouseY] = [event.clientX, event.clientY]
  const { left, right, top, bottom } = map;

  let cursorInMap = mouseX >= left && mouseX < right && mouseY >= top && mouseY < bottom

  if (!cursorInMap) return { undefined, undefined }

  let relativeMouseX = event.clientX - map.left
  let relativeMouseY = event.clientY - map.top

  const [coordX, coordY] = [Math.floor(relativeMouseX / TILE_SIZE), Math.floor(relativeMouseY / TILE_SIZE)]

  return { coordX, coordY }
}