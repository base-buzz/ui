import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock window.ethereum
Object.defineProperty(window, "ethereum", {
  writable: true,
  value: {
    isMetaMask: true,
    request: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
  },
});
