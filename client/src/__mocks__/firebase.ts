// __mocks__/firebase.ts

export const initializeApp = jest.fn();

export const connectAuthEmulator = jest.fn();
export const connectFirestoreEmulator = jest.fn();
export const connectStorageEmulator = jest.fn();

// Mock the Firestore and Auth functions you use
export const getFirestore = jest.fn(() => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

export const getAuth = jest.fn(() => ({
  currentUser: {
    uid: "mock-uid",
    email: "mock-email@example.com",
    emailVerified: true,
    displayName: "Mock User",
    photoURL: "http://example.com/photo.jpg",
    phoneNumber: null,
    providerData: [],
    metadata: {
      creationTime: "mock-creation-time",
      lastSignInTime: "mock-last-signin-time",
    },
    isAnonymous: false,
  },
}));

export const getStorage = jest.fn(() => ({
  ref: jest.fn(),
  getDownloadURL: jest.fn(),
}));
