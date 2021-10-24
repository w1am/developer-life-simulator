const drawImage = (ctx, image, x, y, w, h) => {
  ctx.drawImage(image, x * TILE_SIZE, y * TILE_SIZE, w * TILE_SIZE, h * TILE_SIZE)
}