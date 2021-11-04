// Animate any numbers from a given range.
const animateValue = (domElement, start, end, duration, levelUp = false) => {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    if (levelUp) {
      domElement.style.width = `${Math.floor(progress * (end - start) + start)}px`;
    } else {
      domElement.innerHTML = formatNumber(Math.floor(progress * (end - start) + start));
    }
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
}