export function random<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function shuffle<T>(items: T[]) {
  return items.sort(() => Math.random() - 0.5);
}
