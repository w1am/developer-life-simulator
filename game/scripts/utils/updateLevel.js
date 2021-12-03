"use strict"

import { animateValue } from '../../../common/index.js'

/**
 * Update level with an animation
 * 
 * @param {number} before - level before
 * @param {number} after - level after
*/
export function updateLevel(before, after) {
  const levelProgress = document.getElementById("level-progress-bar");
  animateValue(levelProgress, before, (200 / 100) * after, 1000, true);
};