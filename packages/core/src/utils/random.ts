export function getRandomId(max = 999999, min = 1) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
