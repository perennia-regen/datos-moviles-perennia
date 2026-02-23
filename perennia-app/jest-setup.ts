// Mock módulos nativos de Expo que no están disponibles en el entorno de test

jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(),
  openDatabaseSync: jest.fn(),
}));

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("expo-crypto", () => ({
  getRandomBytes: jest.fn(() => new Uint8Array(16)),
  digestStringAsync: jest.fn(),
}));
