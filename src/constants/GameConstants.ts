export const GameConstants = {
  // === World/Grid Size ===
  TILE_SIZE: 128,
  GRID_WIDTH: 8,
  GRID_HEIGHT: 5,

  // === UI Layout ===
  UI_HEIGHT: 256,
  UI_ROW_COUNT: 2,

  // === HERO ====
  HERO_SPEED: 200,
  HERO_SCALE: 0.35,
  GROUND_OFFSET: 8,

  get UI_ROW_HEIGHT() {
    return this.UI_HEIGHT / this.UI_ROW_COUNT;
  },

  // Calculated screen size
  get GRID_PIXEL_WIDTH() {
    return this.GRID_WIDTH * this.TILE_SIZE;
  },

  get GRID_PIXEL_HEIGHT() {
    return this.GRID_HEIGHT * this.TILE_SIZE;
  },
};
