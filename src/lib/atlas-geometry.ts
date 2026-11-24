// Shared deterministic street-grid coordinate system for Çankaya schematic plates & WebGL projection.

export const GRID_NX = 30;
export const GRID_NY = 22;

export function projectGrid(i: number, j: number): [number, number] {
  const u = i / GRID_NX;
  const v = j / GRID_NY;
  return [
    u +
      0.035 * Math.sin(v * 8 + u * 2) -
      0.022 * Math.sin(u * 11 + v * 3) +
      0.012 * Math.sin(v * 20),
    v +
      0.055 * Math.sin(u * 8.7 + v * 2.2) +
      0.02 * Math.cos(u * 17 - v * 4),
  ];
}

export const RESERVE_BASES: ReadonlyArray<readonly [number, number]> = [
  [13, 11],
  [21, 9],
];

export const DISPATCH_DEPOT: readonly [number, number] = [15, 8];

export function routePath(
  origin: readonly [number, number],
  dest: readonly [number, number],
  turnFirst: 0 | 1,
): Array<[number, number]> {
  let x = origin[0];
  let y = origin[1];
  const path: Array<[number, number]> = [projectGrid(x, y)];

  const walk = (axis: 0 | 1) => {
    let val = axis === 0 ? x : y;
    const goal = dest[axis];
    while (val !== goal) {
      val += Math.sign(goal - val);
      if (axis === 0) x = val;
      else y = val;
      path.push(projectGrid(x, y));
    }
  };

  walk(turnFirst);
  walk(turnFirst === 0 ? 1 : 0);
  return path;
}

export function getAtlasAkay(w: number, h: number): [number, number] {
  const [x, y] = projectGrid(19, 9);
  return [x * w, y * h];
}
