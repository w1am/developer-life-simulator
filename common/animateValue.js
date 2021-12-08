"use strict";

import { formatNumber } from "./formatNumber.js";

/**
 * Animate any numbers from a given range.
 * @param {HTMLElement} domElement - html element to animate
 * @param {number} start - start value
 * @param {number} end - end value
 * @param {number} duration - duration
 * @param {boolean} levelUp - animate bar in pixels when leveling up
 * */
export const animateValue = (
  domElement,
  start,
  end,
  duration,
  levelUp = false
) => {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const rate = Math.floor(progress * (end - start) + start);
    if (levelUp) {
      domElement.style.width = `${rate}%`;
    } else {
      domElement.innerHTML = formatNumber(rate);
    }
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
};
