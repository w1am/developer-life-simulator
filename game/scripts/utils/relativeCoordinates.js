const relativeCoordinates = (event) => {
  const map = document.getElementById('map').getBoundingClientRect();
  const [mouseX, mouseY] = [event.clientX, event.clientY]
  const { left, right, top, bottom } = map;

  let cursorInMap = mouseX >= left && mouseX < right && mouseY >= top && mouseY < bottom

  if (!cursorInMap) {
    grabbed = false;
    cursor = [1, 1];
    return { undefined, undefined }
  }

  let relativeMouseX = event.clientX - map.left
  let relativeMouseY = event.clientY - map.top

  const [coordX, coordY] = [Math.floor(relativeMouseX / TILE_SIZE), Math.floor(relativeMouseY / TILE_SIZE)]

  return { coordX, coordY }
}