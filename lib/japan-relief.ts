// Illustrated waves suggest embossed paper; they do not represent real elevations.
export const mapBounds = { left: -7.4, right: 7.4, top: -9.2, bottom: 7.4 };
export type JapanGeometry = { type: 'MultiPolygon'; coordinates: number[][][][] };
export function mapPoint(lon: number, lat: number): [number, number] {
  return [(lon - 138) * .79, -(lat - 37)];
}
export function waveOffset(x: number, z: number) {
  return .22 * Math.sin(x * 2.1 + z * .9) + .09 * Math.sin(x * 4.6 - z * 1.3);
}
export function reliefHeight(x: number, z: number, blend: number) {
  return .025 + blend * (.09 + .045 * Math.cos((z - waveOffset(x, z)) * Math.PI / .23));
}
export function illustratedPolygons(data: JapanGeometry): [number, number][][][] {
  return data.coordinates.filter(polygon => {
    const north = Math.max(...polygon[0].map(p => p[1]));
    return north >= 30 || Math.min(...polygon[0].map(p => p[0])) < 132;
  }).map(polygon => {
    const inset = Math.max(...polygon[0].map(p => p[1])) < 30;
    return polygon.map(ring => ring.map(([lon, lat]): [number, number] =>
      inset ? [-6.2 + (lon - 123) * .27, 3.7 - (lat - 24) * .27] : mapPoint(lon, lat)));
  });
}
