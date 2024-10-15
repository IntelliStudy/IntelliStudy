// setupTests.ts
import "@testing-library/jest-dom";

// Mock the matchMedia function
window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Create a mock for the CanvasRenderingContext2D
const mockCanvasRenderingContext2D: CanvasRenderingContext2D = {
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(),
  putImageData: jest.fn(),
  createImageData: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  scale: jest.fn(),
  translate: jest.fn(),
  rotate: jest.fn(),
  beginPath: jest.fn(),
  closePath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  // Add any other methods you may need here
} as unknown as CanvasRenderingContext2D;

// Mock the HTMLCanvasElement prototype
global.HTMLCanvasElement.prototype.getContext = jest
  .fn()
  .mockImplementation((contextId: string) => {
    if (contextId === "2d") {
      return mockCanvasRenderingContext2D;
    }
    return null;
  });
