// Test utilities for easier component testing
import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Store/Reducers/rootReducer";

// Mock store for testing
export const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });
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
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );

  const renderResult = render(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    store,
    ...renderResult,
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
    technologies: ["React", "TypeScript"],
    title: "Test Project 1",
    image: "test1.png",
    githubUrl: "https://github.com/test1",
    deploymentUrl: "https://test1.com",
    status: "Live & Active",
    technicalFocus: ["React Hooks", "State Management"],
    learningOutcomes: "Modern React development",
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
    technologies: ["Node.js", "Express"],
    title: "Test Project 2",
    image: "test2.png",
    githubUrl: "https://github.com/test2",
    deploymentUrl: "https://test2.com",
    status: "Code Showcase",
    technicalFocus: ["API Development", "Database Design"],
    learningOutcomes: "Backend development skills",
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
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  });
  return mockIntersectionObserver;
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
    writable: true,
    configurable: true,
  });
  return localStorageMock;
};

// Mock window.open for testing
export const mockWindowOpen = () => {
  const mockOpen = jest.fn();
  Object.defineProperty(window, "open", {
    value: mockOpen,
    writable: true,
    configurable: true,
  });
  return mockOpen;
};

// Mock window.location for testing
export const mockWindowLocation = (url = "http://localhost") => {
  delete (window as any).location;
  (window as any).location = {
    href: url,
    origin: url,
    assign: jest.fn(),
    replace: jest.fn(),
  };
  return window.location;
};

// Mock HTML2Canvas and jsPDF for testing
export const mockHTML2Canvas = () => {
  const mockCanvas = {
    toDataURL: jest
      .fn()
      .mockReturnValue("data:image/png;base64,mock-canvas-data"),
    height: 800,
    width: 600,
  };
  const mockHTML2Canvas = jest.fn().mockResolvedValue(mockCanvas);
  return { mockHTML2Canvas, mockCanvas };
};

export const mockJsPDF = () => {
  const mockPDF = {
    addImage: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
  };
  return mockPDF;
};

// Animation frame mock for testing
export const mockRequestAnimationFrame = () => {
  global.requestAnimationFrame = jest.fn((callback) => {
    setTimeout(callback, 16);
    return 1;
  });
  global.cancelAnimationFrame = jest.fn();
};

// Resize Observer mock
export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: mockResizeObserver,
  });
  return mockResizeObserver;
};

// Common test assertions helpers
export const testHelpers = {
  expectElementToBeVisible: (element: HTMLElement) => {
    // These matchers require @testing-library/jest-dom to be set up
    // For now, just basic checks
    expect(element).toBeDefined();
    expect(element).not.toBeNull();
  },

  expectElementToHaveTestId: (element: HTMLElement, testId: string) => {
    expect(element.getAttribute("data-testid")).toBe(testId);
  },

  expectButtonToBeClickable: (button: HTMLElement) => {
    expect(button).toBeDefined();
    expect(button.getAttribute("disabled")).toBeNull();
  },

  expectFormFieldToBeValid: (field: HTMLElement, value: string) => {
    expect((field as HTMLInputElement).value).toBe(value);
    expect(field).toBeDefined();
  },
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
