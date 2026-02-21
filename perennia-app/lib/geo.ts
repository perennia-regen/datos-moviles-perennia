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
 * Convierte un GeoJSON string (Polygon o Feature) a array de coordenadas para react-native-maps.
 */
export function parseGeometry(geometryStr: string): { latitude: number; longitude: number }[] {
  try {
    const geojson = typeof geometryStr === "string" ? JSON.parse(geometryStr) : geometryStr;
    const coords = geojson.geometry?.coordinates?.[0] ?? geojson.coordinates?.[0] ?? [];
    return coords.map((c: number[]) => ({ latitude: c[1], longitude: c[0] }));
  } catch {
    return [];
  }
}

/**
 * Parsea un FeatureCollection GeoJSON y retorna array de arrays de coordenadas
 * (un array por cada Feature/polígono).
 */
export function parseFeatureCollection(geojsonStr: string): { latitude: number; longitude: number }[][] {
  try {
    const geojson = typeof geojsonStr === "string" ? JSON.parse(geojsonStr) : geojsonStr;
    const features = geojson.features ?? [];
    return features
      .map((f: any) => {
        const coords = f.geometry?.coordinates?.[0] ?? [];
        return coords.map((c: number[]) => ({ latitude: c[1], longitude: c[0] }));
      })
      .filter((coords: any[]) => coords.length > 0);
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
      const coords = geojson.geometry?.coordinates ?? geojson.coordinates;
      if (!coords) continue;
      const poly = polygon(coords);
      if (booleanPointInPolygon(pt, poly)) {
        return entity;
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
