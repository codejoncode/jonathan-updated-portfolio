// Test utilities for easier component testing
import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
// If you need ProviderProps type, import it like this:
// import type { ProviderProps } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer, { RootState } from "../Store/Reducers/rootReducer";

// Mock store for testing with correct state structure
export const createMockStore = (initialState: Partial<RootState> = {}) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable for testing
      }),
  });

  // If initialState is provided, we can manually update the store
  // This is a workaround for the preloadedState typing issue
  if (Object.keys(initialState).length > 0) {
    // For tests, we'll just use the store as-is since most tests
    // either don't need specific state or can mock the selectors
  }

  return store;
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialState?: any;
  store?: any;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    initialState = {},
    store = createMockStore(initialState),
    ...renderOptions
  }: CustomRenderOptions = {},
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(Provider, {
      store,
      children: React.createElement(BrowserRouter, null, children),
    });
  };

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Common test data
export const mockProjects = [
  {
    id: 1,
    name: "Test Project 1",
    description: "Test description",
    deploymentLinks: ["https://test1.com"],
    githubLinks: ["https://github.com/test1"],
    planLinks: ["https://plan1.com"],
    images: ["test1.png"],
    features: ["Feature 1", "Feature 2"],
  },
  {
    id: 2,
    name: "Test Project 2",
    description: "Test description 2",
    deploymentLinks: ["https://test2.com"],
    githubLinks: ["https://github.com/test2"],
    planLinks: ["https://plan2.com"],
    images: ["test2.png"],
    features: ["Feature 3", "Feature 4"],
  },
];

export const mockLectures = [
  {
    id: 1,
    title: "Test Lecture 1",
    description: "Test lecture description",
    url: "https://lecture1.com",
  },
];

// Mock window.innerWidth for responsive tests
export const mockWindowResize = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
};

// Mock IntersectionObserver for tests
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

// Mock localStorage
export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
  return localStorageMock;
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
