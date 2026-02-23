// Mock db/schema antes de importar tareas (evita init de SQLite)
jest.mock("@/db/schema", () => ({
  getDb: jest.fn(),
}));

// eslint-disable-next-line import/first
import { computeEstadoTarea, generarNombreRecorrida } from "@/constants/tareas";
// eslint-disable-next-line import/first
import type { TareaTipoConfig, Subtarea } from "@/constants/tareas";

// ── Helpers ──

function makeTipo(overrides: Partial<TareaTipoConfig> = {}): TareaTipoConfig {
  return {
    id: "test",
    nombre: "Test",
    nivel: "lote",
    version: 1,
    orden: 1,
    campos: [
      { key: "fecha", label: "Fecha", type: "date", required: true },
      { key: "notas", label: "Notas", type: "textarea" },
    ],
    subtarea_campos: null,
    subtarea_config: null,
    ...overrides,
  };
}

// ── computeEstadoTarea ──

describe("computeEstadoTarea", () => {
  describe("tarea estándar (sin subtareas, no libre)", () => {
    const tipo = makeTipo();

    it("sin_iniciar cuando no hay campos required llenos", () => {
      expect(computeEstadoTarea(tipo, {})).toBe("sin_iniciar");
    });

    it("sin_iniciar con datos vacíos", () => {
      expect(computeEstadoTarea(tipo, { fecha: "" })).toBe("sin_iniciar");
    });

    it("completa cuando todos los required están llenos", () => {
      expect(computeEstadoTarea(tipo, { fecha: "2026-01-01" })).toBe("completa");
    });

    it("en_curso con algunos required llenos", () => {
      const tipoMulti = makeTipo({
        campos: [
          { key: "fecha", label: "Fecha", type: "date", required: true },
          { key: "recurso", label: "Recurso", type: "chips", required: true },
        ],
      });
      expect(computeEstadoTarea(tipoMulti, { fecha: "2026-01-01" })).toBe("en_curso");
    });

    it("ignora textareas en el conteo de required", () => {
      // "notas" es textarea → no cuenta como required
      expect(computeEstadoTarea(tipo, { fecha: "2026-01-01" })).toBe("completa");
    });
  });

  describe("tarea con subtareas", () => {
    const tipo = makeTipo({
      subtarea_config: { label: "Muestras", minimo: 3, unidad_default: "cm" },
      subtarea_campos: [{ key: "altura", label: "Altura", type: "numeric" }],
    });

    it("sin_iniciar sin datos ni subtareas", () => {
      expect(computeEstadoTarea(tipo, {}, [])).toBe("sin_iniciar");
    });

    it("en_curso con subtareas pero debajo del mínimo", () => {
      const subs: Subtarea[] = [{ id: "1", datos: { altura: 15 } }];
      expect(computeEstadoTarea(tipo, { fecha: "2026-01-01" }, subs)).toBe("en_curso");
    });

    it("en_curso con mínimo de subtareas pero sin form data", () => {
      const subs: Subtarea[] = [
        { id: "1", datos: {} },
        { id: "2", datos: {} },
        { id: "3", datos: {} },
      ];
      expect(computeEstadoTarea(tipo, {}, subs)).toBe("en_curso");
    });

    it("completa con form data + mínimo de subtareas", () => {
      const subs: Subtarea[] = [
        { id: "1", datos: { altura: 15 } },
        { id: "2", datos: { altura: 20 } },
        { id: "3", datos: { altura: 18 } },
      ];
      expect(computeEstadoTarea(tipo, { fecha: "2026-01-01" }, subs)).toBe("completa");
    });
  });

  describe("tarea libre", () => {
    const tipo = makeTipo({ id: "libre", campos: [] });

    it("sin_iniciar sin titulo ni descripcion", () => {
      expect(computeEstadoTarea(tipo, {})).toBe("sin_iniciar");
    });

    it("en_curso con solo titulo", () => {
      expect(computeEstadoTarea(tipo, { titulo: "Algo" })).toBe("en_curso");
    });

    it("en_curso con solo descripcion", () => {
      expect(computeEstadoTarea(tipo, { descripcion: "Detalle" })).toBe("en_curso");
    });

    it("completa con titulo + descripcion", () => {
      expect(computeEstadoTarea(tipo, { titulo: "Algo", descripcion: "Detalle" })).toBe("completa");
    });
  });
});

// ── generarNombreRecorrida ──

describe("generarNombreRecorrida", () => {
  it("formatea fecha y nombres correctamente", () => {
    const fecha = new Date(2026, 0, 15); // 15 enero 2026
    const result = generarNombreRecorrida("La Estancia", "Recorrida Anual", fecha);
    expect(result).toBe("15ene26-laestancia-recorrid");
  });

  it("trunca nombres largos (estab 12 chars, srv 8 chars)", () => {
    const fecha = new Date(2026, 5, 3); // 03 junio 2026
    const result = generarNombreRecorrida("Establecimiento Muy Largo Nombre", "Servicio Extenso", fecha);
    const parts = result.split("-");
    expect(parts[0]).toBe("03jun26");
    expect(parts[1].length).toBeLessThanOrEqual(12);
    expect(parts[2].length).toBeLessThanOrEqual(8);
  });

  it("sanitiza caracteres especiales", () => {
    const fecha = new Date(2026, 11, 25); // 25 diciembre 2026
    const result = generarNombreRecorrida("San José (norte)", "Rec. #1", fecha);
    expect(result).toBe("25dic26-sanjosnorte-rec1");
  });

  it("usa fecha actual si no se provee", () => {
    const result = generarNombreRecorrida("Test", "Srv");
    expect(result).toMatch(/^\d{2}\w{3}\d{2}-test-srv$/);
  });

  it("maneja meses correctamente", () => {
    const feb = new Date(2026, 1, 5);
    expect(generarNombreRecorrida("A", "B", feb)).toBe("05feb26-a-b");

    const dic = new Date(2026, 11, 31);
    expect(generarNombreRecorrida("A", "B", dic)).toBe("31dic26-a-b");
  });
});
