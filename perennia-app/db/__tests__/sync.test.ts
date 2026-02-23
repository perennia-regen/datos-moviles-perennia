// Mock supabase antes de importar sync (evita error de URL vacía)
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
    auth: { getSession: jest.fn(), onAuthStateChange: jest.fn() },
    schema: jest.fn(() => ({ from: jest.fn() })),
  },
  datosCampo: {
    from: jest.fn(),
  },
}));

// eslint-disable-next-line import/first
import { classifyError } from "@/db/sync";

describe("classifyError", () => {
  describe("auth errors", () => {
    it("status 401", () => {
      const result = classifyError({ status: 401, message: "Unauthorized" });
      expect(result.type).toBe("auth");
      expect(result.message).toContain("Sesión expirada");
    });

    it("status 403", () => {
      expect(classifyError({ status: 403, message: "Forbidden" }).type).toBe("auth");
    });

    it("JWT en mensaje", () => {
      expect(classifyError({ message: "JWT expired" }).type).toBe("auth");
    });

    it("token en mensaje", () => {
      expect(classifyError({ message: "invalid token" }).type).toBe("auth");
    });
  });

  describe("network errors", () => {
    it("Failed to fetch", () => {
      expect(classifyError({ message: "Failed to fetch" }).type).toBe("network");
    });

    it("timeout", () => {
      expect(classifyError({ message: "request timeout" }).type).toBe("network");
    });

    it("ECONNREFUSED", () => {
      expect(classifyError({ message: "ECONNREFUSED" }).type).toBe("network");
    });

    it("PGRST301 code", () => {
      expect(classifyError({ code: "PGRST301", message: "connection error" }).type).toBe("network");
    });

    it("network en mensaje", () => {
      expect(classifyError({ message: "network error" }).type).toBe("network");
    });
  });

  describe("constraint errors", () => {
    it("duplicate key (code 23505)", () => {
      const result = classifyError({ code: "23505", message: "duplicate key value" });
      expect(result.type).toBe("constraint");
      expect(result.message).toContain("Error de datos");
    });

    it("foreign key (code 23503)", () => {
      expect(classifyError({ code: "23503", message: "foreign key violation" }).type).toBe("constraint");
    });

    it("violates unique constraint", () => {
      expect(classifyError({ message: "violates unique constraint" }).type).toBe("constraint");
    });

    it("constraint en mensaje", () => {
      expect(classifyError({ message: "check constraint failed" }).type).toBe("constraint");
    });
  });

  describe("unknown errors", () => {
    it("error genérico", () => {
      const result = classifyError({ message: "something weird" });
      expect(result.type).toBe("unknown");
      expect(result.message).toBe("something weird");
    });

    it("error sin message", () => {
      const result = classifyError({});
      expect(result.type).toBe("unknown");
    });

    it("error no-objeto", () => {
      const result = classifyError("raw string error");
      expect(result.type).toBe("unknown");
    });
  });
});
