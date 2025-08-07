import React from "react";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "./Contact";
import { renderWithProviders } from "../test-utils";
import { contactUtils } from "../Helpers/Functions/contactUtils";

// Mock the contact utility functions
jest.mock("../Helpers/Functions/contactUtils", () => ({
  contactUtils: {
    createContactSubject: jest.fn(),
    createContactBody: jest.fn(),
    createMailtoLink: jest.fn(),
    validateForm: jest.fn(),
    isFormReady: jest.fn(),
  },
}));

// Mock window.location
const mockLocation = {
  href: "",
  assign: jest.fn(),
  replace: jest.fn(),
};
Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
  configurable: true,
});

const mockInitialState = {
  projectReducer: {
    projects: [],
    selectedProject: null,
    loading: false,
    error: null,
  },
  lecturesReducer: {
    lectures: [],
    loading: false,
    error: null,
  },
  authReducer: {
    isAuthenticated: false,
    user: null,
    token: null,
  },
  blogReducer: {
    blogs: [],
    loading: false,
    error: null,
  },
};

describe("Contact Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockLocation.href = "";

    // Setup default mock implementations
    (contactUtils.createMailtoLink as jest.Mock).mockReturnValue(
      "mailto:test@example.com?subject=Test&body=Test%20Body",
    );
    (contactUtils.validateForm as jest.Mock).mockReturnValue({
      isValid: true,
      errors: {},
    });
    (contactUtils.isFormReady as jest.Mock).mockReturnValue(true);
  });

  describe("Component Rendering", () => {
    it("renders contact form correctly", () => {
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      expect(screen.getByTestId("contact-container")).toBeInTheDocument();
      expect(screen.getByTestId("contact-title")).toHaveTextContent(
        "Get In Touch",
      );
      expect(screen.getByTestId("contact-subtitle")).toBeInTheDocument();
      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    });

    it("renders all form fields", () => {
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      expect(screen.getByTestId("contact-name-input")).toBeInTheDocument();
      expect(screen.getByTestId("contact-email-input")).toBeInTheDocument();
      expect(screen.getByTestId("contact-message-input")).toBeInTheDocument();
      expect(screen.getByTestId("contact-submit-button")).toBeInTheDocument();
    });

    it("renders social links section", () => {
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      expect(screen.getByTestId("contact-social-section")).toBeInTheDocument();
      expect(screen.getByTestId("contact-social-title")).toHaveTextContent(
        "Other Ways to Connect",
      );
      expect(screen.getByTestId("contact-linkedin-link")).toHaveAttribute(
        "href",
        "https://www.linkedin.com/in/jonathanjholloway/",
      );
      expect(screen.getByTestId("contact-github-link")).toHaveAttribute(
        "href",
        "https://github.com/codejoncode",
      );
      expect(screen.getByTestId("contact-location")).toHaveTextContent(
        "Crown Point, IN, USA",
      );
      expect(screen.getByTestId("contact-remote-note")).toHaveTextContent(
        "Open to remote opportunities worldwide",
      );
    });
  });

  describe("Form Interaction", () => {
    it("updates form fields when user types", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      const nameInput = screen.getByTestId(
        "contact-name-input",
      ) as HTMLInputElement;
      const emailInput = screen.getByTestId(
        "contact-email-input",
      ) as HTMLInputElement;
      const messageInput = screen.getByTestId(
        "contact-message-input",
      ) as HTMLTextAreaElement;

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(messageInput, "Hello, this is a test message.");

      expect(nameInput.value).toBe("John Doe");
      expect(emailInput.value).toBe("john@example.com");
      expect(messageInput.value).toBe("Hello, this is a test message.");
    });

    it("handles form submission correctly", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      // Fill out the form
      await user.type(screen.getByTestId("contact-name-input"), "John Doe");
      await user.type(
        screen.getByTestId("contact-email-input"),
        "john@example.com",
      );
      await user.type(
        screen.getByTestId("contact-message-input"),
        "Test message",
      );

      // Submit the form
      const submitButton = screen.getByTestId("contact-submit-button");
      await user.click(submitButton);

      // Check that contactUtils.createMailtoLink was called
      expect(contactUtils.createMailtoLink).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        message: "Test message",
      });

      // Check that window.location.href was set
      expect(mockLocation.href).toBe(
        "mailto:test@example.com?subject=Test&body=Test%20Body",
      );
    });

    it("shows loading state during form submission", async () => {
      const user = userEvent.setup();

      // Mock window.location.href to prevent actual navigation
      let locationHref = "";
      Object.defineProperty(window, "location", {
        value: {
          get href() {
            return locationHref;
          },
          set href(value) {
            locationHref = value;
          },
        },
        writable: true,
      });

      renderWithProviders(<Contact />, { initialState: mockInitialState });

      // Fill out form
      await user.type(screen.getByTestId("contact-name-input"), "John Doe");
      await user.type(
        screen.getByTestId("contact-email-input"),
        "john@example.com",
      );
      await user.type(
        screen.getByTestId("contact-message-input"),
        "Test message",
      );

      const submitButton = screen.getByTestId("contact-submit-button");

      // The button should not be loading initially
      expect(submitButton).not.toHaveAttribute("loading");

      // After submission, the form should show success state
      await user.click(submitButton);

      // Check that mailto link was opened
      expect(locationHref).toContain("mailto:");
    });

    it("shows success message after form submission", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      // Fill out form
      await user.type(screen.getByTestId("contact-name-input"), "John Doe");
      await user.type(
        screen.getByTestId("contact-email-input"),
        "john@example.com",
      );
      await user.type(
        screen.getByTestId("contact-message-input"),
        "Test message",
      );

      // Submit form
      await user.click(screen.getByTestId("contact-submit-button"));

      // Wait for success message to appear
      await waitFor(() => {
        expect(
          screen.getByTestId("contact-success-message"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("contact-success-header")).toHaveTextContent(
          "Email Client Opened!",
        );
        expect(screen.getByTestId("contact-success-body")).toBeInTheDocument();
      });
    });

    it("clears form and hides success message after timeout", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      // Fill out and submit form
      await user.type(screen.getByTestId("contact-name-input"), "John Doe");
      await user.type(
        screen.getByTestId("contact-email-input"),
        "john@example.com",
      );
      await user.type(
        screen.getByTestId("contact-message-input"),
        "Test message",
      );
      await user.click(screen.getByTestId("contact-submit-button"));

      // Verify success message is shown first
      await waitFor(() => {
        expect(
          screen.getByTestId("contact-success-message"),
        ).toBeInTheDocument();
      });

      // Fast forward time to trigger timeout
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Check that form is cleared and success message is hidden
      await waitFor(() => {
        const nameInput = screen.getByTestId(
          "contact-name-input",
        ) as HTMLInputElement;
        const emailInput = screen.getByTestId(
          "contact-email-input",
        ) as HTMLInputElement;
        const messageInput = screen.getByTestId(
          "contact-message-input",
        ) as HTMLTextAreaElement;

        expect(nameInput.value).toBe("");
        expect(emailInput.value).toBe("");
        expect(messageInput.value).toBe("");
        expect(
          screen.queryByTestId("contact-success-message"),
        ).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe("Form Validation", () => {
    it("requires all fields to be filled", () => {
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      const nameInput = screen.getByTestId("contact-name-input");
      const emailInput = screen.getByTestId("contact-email-input");
      const messageInput = screen.getByTestId("contact-message-input");

      expect(nameInput).toHaveAttribute("required");
      expect(emailInput).toHaveAttribute("required");
      expect(messageInput).toHaveAttribute("required");
    });

    it("has correct input types", () => {
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      expect(screen.getByTestId("contact-name-input")).toHaveAttribute(
        "type",
        "text",
      );
      expect(screen.getByTestId("contact-email-input")).toHaveAttribute(
        "type",
        "email",
      );
    });

    it("has appropriate placeholders", () => {
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      expect(screen.getByTestId("contact-name-input")).toHaveAttribute(
        "placeholder",
        "Your full name",
      );
      expect(screen.getByTestId("contact-email-input")).toHaveAttribute(
        "placeholder",
        "your.email@example.com",
      );
      expect(screen.getByTestId("contact-message-input")).toHaveAttribute(
        "placeholder",
        "Tell me about your project or just say hello!",
      );
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic structure", () => {
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      // Check for proper heading hierarchy
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();

      // Check for form structure
      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /send message/i }),
      ).toBeInTheDocument();

      // Check for form fields by test id (since they don't have proper accessible names)
      expect(screen.getByTestId("contact-name-input")).toBeInTheDocument();
      expect(screen.getByTestId("contact-email-input")).toBeInTheDocument();
      expect(screen.getByTestId("contact-message-input")).toBeInTheDocument();

      // Verify they are the correct input types
      expect(screen.getByTestId("contact-name-input")).toHaveAttribute(
        "type",
        "text",
      );
      expect(screen.getByTestId("contact-email-input")).toHaveAttribute(
        "type",
        "email",
      );
    });

    it("has external links with proper attributes", () => {
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      const linkedinLink = screen.getByTestId("contact-linkedin-link");
      const githubLink = screen.getByTestId("contact-github-link");

      expect(linkedinLink).toHaveAttribute("target", "_blank");
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Utility Functions Integration", () => {
    it("calls contactUtils.createMailtoLink with form data", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      const formData = {
        name: "Test User",
        email: "test@example.com",
        message: "This is a test message",
      };

      await user.type(screen.getByTestId("contact-name-input"), formData.name);
      await user.type(
        screen.getByTestId("contact-email-input"),
        formData.email,
      );
      await user.type(
        screen.getByTestId("contact-message-input"),
        formData.message,
      );
      await user.click(screen.getByTestId("contact-submit-button"));

      expect(contactUtils.createMailtoLink).toHaveBeenCalledWith(formData);
    });
  });

  describe("Error Handling", () => {
    it("handles empty form submission gracefully", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      // Try to submit empty form - HTML5 validation should prevent submission
      const submitButton = screen.getByTestId("contact-submit-button");
      await user.click(submitButton);

      // Form should still be present (submission blocked by HTML5 validation)
      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    });

    it("creates mailto link correctly when form is submitted", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Contact />, { initialState: mockInitialState });

      await user.type(screen.getByTestId("contact-name-input"), "John Doe");
      await user.type(
        screen.getByTestId("contact-email-input"),
        "john@example.com",
      );
      await user.type(
        screen.getByTestId("contact-message-input"),
        "Test message",
      );

      await user.click(screen.getByTestId("contact-submit-button"));

      // Verify mailto link was created with correct parameters
      expect(contactUtils.createMailtoLink).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        message: "Test message",
      });
    });
  });
});
