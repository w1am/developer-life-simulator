"use strict"

/**
 * create confetti using canvas-confetti library
 */
export function createConfetti() {
  var myCanvas = document.getElementById('confetti');
  myCanvas.style.display = "block";

  var myConfetti = confetti.create(myCanvas, { resize: true });

  myConfetti();

  setTimeout(() => {
    myCanvas.style.display = "none";
  }, 3000)
}