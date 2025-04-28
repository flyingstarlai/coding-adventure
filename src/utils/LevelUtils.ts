export function getLevelFromURL(): number {
  const params = new URLSearchParams(window.location.search);
  const levelParam = params.get("level");

  if (levelParam) {
    const parsed = parseInt(levelParam, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return 1;
}
