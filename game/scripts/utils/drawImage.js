"use strict"

import { TILE_SIZE } from '../main.js';

/**
 * Draw image in the canvas
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} image - image path
 * @param {number} x - x coord
 * @param {number} y - y coord
 * @param {number} w - width
 * @param {number} h - height
 */
export const drawImage = (ctx, image, x, y, w, h) => {
  ctx.drawImage(image, x * TILE_SIZE, y * TILE_SIZE, w * TILE_SIZE, h * TILE_SIZE)
}