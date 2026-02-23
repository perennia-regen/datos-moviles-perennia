import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";

// ── Types ──

interface GeoEntity {
  id: string;
  geometry: string;
  [key: string]: any;
}

interface LoteWithGeometry {
  id: string;
  nombre_lote: string;
  geometry: string;
}

// ── Parsing ──

/**
 * Convierte un GeoJSON string (Polygon, MultiPolygon o Feature) a array de coordenadas
 * para react-native-maps. Para MultiPolygon, concatena todos los anillos exteriores.
 */
export function parseGeometry(geometryStr: string): { latitude: number; longitude: number }[] {
  try {
    if (!geometryStr) return [];
    const geojson = typeof geometryStr === "string" ? JSON.parse(geometryStr) : geometryStr;
    const geom = geojson.geometry ?? geojson;
    const type = geom.type;
    const coordinates = geom.coordinates;
    if (!coordinates) return [];

    let rings: number[][][];
    if (type === "MultiPolygon") {
      // MultiPolygon: coordinates = [ [ ring, ...holes ], [ ring, ...holes ], ... ]
      // Tomamos el anillo exterior (index 0) de cada polígono
      rings = coordinates.map((poly: number[][][]) => poly[0]);
    } else {
      // Polygon: coordinates = [ ring, ...holes ]
      rings = [coordinates[0]];
    }

    return rings
      .flat()
      .map((c: number[]) => ({ latitude: c[1], longitude: c[0] }))
      .filter((c: { latitude: number; longitude: number }) =>
        Number.isFinite(c.latitude) && Number.isFinite(c.longitude)
      );
  } catch {
    return [];
  }
}

/**
 * Parsea un FeatureCollection GeoJSON y retorna array de arrays de coordenadas
 * (un array por cada polígono/anillo exterior). Soporta Polygon y MultiPolygon.
 */
export function parseFeatureCollection(geojsonStr: string): { latitude: number; longitude: number }[][] {
  try {
    const geojson = typeof geojsonStr === "string" ? JSON.parse(geojsonStr) : geojsonStr;
    const features = geojson.features ?? [];
    const result: { latitude: number; longitude: number }[][] = [];

    for (const f of features) {
      const type = f.geometry?.type;
      const coordinates = f.geometry?.coordinates;
      if (!coordinates) continue;

      let outerRings: number[][][];
      if (type === "MultiPolygon") {
        outerRings = coordinates.map((poly: number[][][]) => poly[0]);
      } else {
        outerRings = [coordinates[0]];
      }

      for (const ring of outerRings) {
        const coords = (ring ?? [])
          .map((c: number[]) => ({ latitude: c[1], longitude: c[0] }))
          .filter((c: { latitude: number; longitude: number }) =>
            Number.isFinite(c.latitude) && Number.isFinite(c.longitude)
          );
        if (coords.length > 0) result.push(coords);
      }
    }

    return result;
  } catch {
    return [];
  }
}

/**
 * Como parseGeometry pero retorna arrays separados por cada sub-polígono.
 * Necesario para renderizar MultiPolygon como múltiples <Polygon> en react-native-maps.
 */
export function parseGeometryMulti(geometryStr: string): { latitude: number; longitude: number }[][] {
  try {
    if (!geometryStr) return [];
    const geojson = typeof geometryStr === "string" ? JSON.parse(geometryStr) : geometryStr;
    const geom = geojson.geometry ?? geojson;
    const type = geom.type;
    const coordinates = geom.coordinates;
    if (!coordinates) return [];

    let outerRings: number[][][];
    if (type === "MultiPolygon") {
      outerRings = coordinates.map((poly: number[][][]) => poly[0]);
    } else {
      outerRings = [coordinates[0]];
    }

    return outerRings
      .map((ring: number[][]) =>
        (ring ?? [])
          .map((c: number[]) => ({ latitude: c[1], longitude: c[0] }))
          .filter((c) => Number.isFinite(c.latitude) && Number.isFinite(c.longitude))
      )
      .filter((coords) => coords.length > 0);
  } catch {
    return [];
  }
}

/**
 * Calcula el centroide (promedio) de un array de coordenadas.
 */
export function getCentroid(coords: { latitude: number; longitude: number }[]) {
  if (coords.length === 0) return { latitude: -34, longitude: -64 };
  const sum = coords.reduce(
    (acc, c) => ({ latitude: acc.latitude + c.latitude, longitude: acc.longitude + c.longitude }),
    { latitude: 0, longitude: 0 }
  );
  return { latitude: sum.latitude / coords.length, longitude: sum.longitude / coords.length };
}

// ── Navigation ──

type LatLng = { latitude: number; longitude: number };

export function haversineDistance(from: LatLng, to: LatLng): number {
  const R = 6371000;
  const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.latitude * Math.PI) / 180) *
      Math.cos((to.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function bearingTo(from: LatLng, to: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const dLon = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return toDeg(Math.atan2(y, x));
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

export function bearingToCardinal(angle: number): string {
  if (isNaN(angle)) return "";
  const norm = ((angle % 360) + 360) % 360;
  if (norm <= 22.5 || norm > 337.5) return "N";
  if (norm <= 67.5) return "NE";
  if (norm <= 112.5) return "E";
  if (norm <= 157.5) return "SE";
  if (norm <= 202.5) return "S";
  if (norm <= 247.5) return "SO";
  if (norm <= 292.5) return "O";
  return "NO";
}

// ── Point-in-polygon ──

/**
 * Dado un punto GPS y una lista de entidades con geometría, retorna la primera que contiene el punto.
 */
export function findPolygonAtLocation<T extends GeoEntity>(
  lat: number,
  lng: number,
  entities: T[]
): T | null {
  const pt = point([lng, lat]);

  for (const entity of entities) {
    try {
      const geojson = typeof entity.geometry === "string" ? JSON.parse(entity.geometry) : entity.geometry;
      const geom = geojson.geometry ?? geojson;
      const coords = geom.coordinates;
      if (!coords) continue;

      if (geom.type === "MultiPolygon") {
        // Testear cada sub-polígono del MultiPolygon
        for (const polyCoords of coords) {
          const poly = polygon(polyCoords);
          if (booleanPointInPolygon(pt, poly)) return entity;
        }
      } else {
        const poly = polygon(coords);
        if (booleanPointInPolygon(pt, poly)) return entity;
      }
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Dado un punto GPS y una lista de lotes, retorna el lote que contiene el punto.
 */
export function findLoteAtLocation(
  lat: number,
  lng: number,
  lotes: LoteWithGeometry[]
): LoteWithGeometry | null {
  return findPolygonAtLocation(lat, lng, lotes);
}
