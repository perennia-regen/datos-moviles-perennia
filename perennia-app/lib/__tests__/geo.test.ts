import {
  parseGeometry,
  parseGeometryMulti,
  parseFeatureCollection,
  getCentroid,
  haversineDistance,
  bearingTo,
  bearingToCardinal,
  formatDistance,
  findPolygonAtLocation,
} from "@/lib/geo";

// ── Fixtures ──

const SIMPLE_POLYGON = JSON.stringify({
  type: "Polygon",
  coordinates: [
    [
      [-58.0, -34.0],
      [-58.0, -35.0],
      [-57.0, -35.0],
      [-57.0, -34.0],
      [-58.0, -34.0],
    ],
  ],
});

const MULTI_POLYGON = JSON.stringify({
  type: "MultiPolygon",
  coordinates: [
    [
      [
        [-58.0, -34.0],
        [-58.0, -35.0],
        [-57.0, -35.0],
        [-57.0, -34.0],
        [-58.0, -34.0],
      ],
    ],
    [
      [
        [-60.0, -36.0],
        [-60.0, -37.0],
        [-59.0, -37.0],
        [-59.0, -36.0],
        [-60.0, -36.0],
      ],
    ],
  ],
});

const FEATURE_POLYGON = JSON.stringify({
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-58.0, -34.0],
        [-58.0, -35.0],
        [-57.0, -35.0],
        [-57.0, -34.0],
        [-58.0, -34.0],
      ],
    ],
  },
});

const FEATURE_COLLECTION = JSON.stringify({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.0, -34.0],
            [-58.0, -35.0],
            [-57.0, -35.0],
            [-57.0, -34.0],
            [-58.0, -34.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-60.0, -36.0],
            [-60.0, -37.0],
            [-59.0, -37.0],
            [-59.0, -36.0],
            [-60.0, -36.0],
          ],
        ],
      },
    },
  ],
});

// ── Tests ──

describe("parseGeometry", () => {
  it("parsea un Polygon simple", () => {
    const result = parseGeometry(SIMPLE_POLYGON);
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ latitude: -34, longitude: -58 });
  });

  it("parsea un Feature wrapping Polygon", () => {
    const result = parseGeometry(FEATURE_POLYGON);
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ latitude: -34, longitude: -58 });
  });

  it("parsea MultiPolygon concatenando anillos exteriores", () => {
    const result = parseGeometry(MULTI_POLYGON);
    // 5 coords primer polígono + 5 coords segundo = 10
    expect(result).toHaveLength(10);
  });

  it("retorna [] para input vacío", () => {
    expect(parseGeometry("")).toEqual([]);
    expect(parseGeometry(null as any)).toEqual([]);
  });

  it("retorna [] para JSON malformado", () => {
    expect(parseGeometry("{invalid")).toEqual([]);
  });

  it("filtra coordenadas no finitas", () => {
    const broken = JSON.stringify({
      type: "Polygon",
      coordinates: [
        [
          [NaN, NaN],
          [-58, -34],
          [Infinity, -34],
        ],
      ],
    });
    const result = parseGeometry(broken);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ latitude: -34, longitude: -58 });
  });
});

describe("parseGeometryMulti", () => {
  it("retorna arrays separados por sub-polígono", () => {
    const result = parseGeometryMulti(MULTI_POLYGON);
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveLength(5);
    expect(result[1]).toHaveLength(5);
  });

  it("retorna un solo array para Polygon simple", () => {
    const result = parseGeometryMulti(SIMPLE_POLYGON);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(5);
  });

  it("retorna [] para input vacío", () => {
    expect(parseGeometryMulti("")).toEqual([]);
  });
});

describe("parseFeatureCollection", () => {
  it("parsea FeatureCollection con múltiples features", () => {
    const result = parseFeatureCollection(FEATURE_COLLECTION);
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveLength(5);
    expect(result[1]).toHaveLength(5);
  });

  it("retorna [] para features vacíos", () => {
    const empty = JSON.stringify({ type: "FeatureCollection", features: [] });
    expect(parseFeatureCollection(empty)).toEqual([]);
  });

  it("retorna [] para JSON inválido", () => {
    expect(parseFeatureCollection("not json")).toEqual([]);
  });
});

describe("getCentroid", () => {
  it("calcula promedio de coordenadas", () => {
    const coords = [
      { latitude: -34, longitude: -58 },
      { latitude: -36, longitude: -60 },
    ];
    expect(getCentroid(coords)).toEqual({ latitude: -35, longitude: -59 });
  });

  it("retorna default (-34, -64) para array vacío", () => {
    expect(getCentroid([])).toEqual({ latitude: -34, longitude: -64 });
  });

  it("retorna el punto mismo para un solo punto", () => {
    const coords = [{ latitude: -31.5, longitude: -64.2 }];
    expect(getCentroid(coords)).toEqual({ latitude: -31.5, longitude: -64.2 });
  });
});

describe("haversineDistance", () => {
  it("Buenos Aires a Montevideo ~200km", () => {
    const ba = { latitude: -34.6037, longitude: -58.3816 };
    const mvd = { latitude: -34.9011, longitude: -56.1645 };
    const d = haversineDistance(ba, mvd);
    expect(d).toBeGreaterThan(195_000);
    expect(d).toBeLessThan(210_000);
  });

  it("mismo punto retorna 0", () => {
    const p = { latitude: -34.6, longitude: -58.4 };
    expect(haversineDistance(p, p)).toBe(0);
  });
});

describe("bearingTo", () => {
  it("norte puro es ~0 grados", () => {
    const from = { latitude: 0, longitude: 0 };
    const to = { latitude: 1, longitude: 0 };
    expect(bearingTo(from, to)).toBeCloseTo(0, 0);
  });

  it("este puro es ~90 grados", () => {
    const from = { latitude: 0, longitude: 0 };
    const to = { latitude: 0, longitude: 1 };
    expect(bearingTo(from, to)).toBeCloseTo(90, 0);
  });

  it("sur puro es ~180 grados (o -180)", () => {
    const from = { latitude: 1, longitude: 0 };
    const to = { latitude: 0, longitude: 0 };
    const b = bearingTo(from, to);
    expect(Math.abs(b)).toBeCloseTo(180, 0);
  });
});

describe("bearingToCardinal", () => {
  it.each([
    [0, "N"],
    [45, "NE"],
    [90, "E"],
    [135, "SE"],
    [180, "S"],
    [225, "SO"],
    [270, "O"],
    [315, "NO"],
    [360, "N"],
    [-45, "NO"],
  ] as const)("ángulo %s → %s", (angle, expected) => {
    expect(bearingToCardinal(angle)).toBe(expected);
  });

  it("NaN retorna string vacío", () => {
    expect(bearingToCardinal(NaN)).toBe("");
  });
});

describe("formatDistance", () => {
  it("formatea metros bajo 1000", () => {
    expect(formatDistance(450)).toBe("450 m");
    expect(formatDistance(0)).toBe("0 m");
  });

  it("formatea km a partir de 1000", () => {
    expect(formatDistance(1000)).toBe("1.0 km");
    expect(formatDistance(2500)).toBe("2.5 km");
  });

  it("formatea km con un decimal", () => {
    expect(formatDistance(15750)).toBe("15.8 km");
  });
});

describe("findPolygonAtLocation", () => {
  const entities = [
    { id: "lote-1", geometry: SIMPLE_POLYGON, nombre: "Lote 1" },
  ];

  it("encuentra polígono que contiene el punto", () => {
    // Centro del polígono: -34.5, -57.5
    const result = findPolygonAtLocation(-34.5, -57.5, entities);
    expect(result).not.toBeNull();
    expect(result!.id).toBe("lote-1");
  });

  it("retorna null si el punto está fuera", () => {
    const result = findPolygonAtLocation(-40, -65, entities);
    expect(result).toBeNull();
  });

  it("retorna null para lista vacía", () => {
    const result = findPolygonAtLocation(-34.5, -57.5, []);
    expect(result).toBeNull();
  });
});
