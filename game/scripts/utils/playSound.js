"use strict"

/**
 * Play a sound effect
 *
 * @param {string} id - element id
 */
export function playSound(id) {
  let audio = document.getElementById(id);
  audio.cloneNode(true).play()
}