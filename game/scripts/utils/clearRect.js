"use strict"

import { TILE_SIZE } from "../main.js"

/**
 * Clear highlighted tiles on the map
*/
export const clearRect = function (gridCtx) {
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      gridCtx.clearRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    }
  }
}