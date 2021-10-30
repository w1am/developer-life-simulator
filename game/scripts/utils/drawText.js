const drawText = (text, color, x, y, cursor) => {
  labelsCtx.font = "16px arial";
  labelsCtx.fillStyle = color;
  labelsCtx.fillText(
    text,
    ((x * TILE_SIZE) + ((cursor[0] / 2) * TILE_SIZE)) - 30,
    ((y * TILE_SIZE) + ((cursor[1] / 2) * TILE_SIZE)) + (cursor[1] > 1 ? 70 : 40),
    100
  );
}