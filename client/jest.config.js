export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Transform TypeScript files using ts-jest
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/__mocks__/fileMock.ts",
  },
  testMatch: ["**/*.test.(ts|tsx)"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  coveragePathIgnorePatterns: [
    "src/firebase",
    "src/utilities",
    "main.tsx",
    "src/App.tsx",
    "src/pages/Home.tsx",
    "src/components/courseDashboard/CreateQuizModal.tsx", // Ignore node_modules
  ],
};
