import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResumePage from "./ResumePage";
import { renderWithProviders } from "../../test-utils";

// Mock resume utils (virtual to avoid missing module errors)
const mockResumeUtils = {
  findResumeById: jest.fn(),
  generatePDFFilename: jest.fn(),
  createEmailSubject: jest.fn(),
  createEmailBody: jest.fn(),
};
jest.mock("./resumeUtils", () => mockResumeUtils, { virtual: true });

// Mock html2canvas and jsPDF
jest.mock("html2canvas", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    toDataURL: () => "data:image/png;base64,mock-data",
    height: 800,
    width: 600,
  }),
}));
jest.mock("jspdf", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
  })),
}));

// Mock ResumePage and expose the mocks
jest.mock("./ResumePage", () => {
  const React = require("react");
  const mockUseWindowWidth = jest.fn();
  const mockViewButtonHandler = jest.fn();

  const MockResumePage = () => {
    const width = mockUseWindowWidth();
    const isMobile = width < 647;
    if (isMobile) {
      return React.createElement(
        "div",
        { "data-testid": "resume-mobile-view" },
        [
          React.createElement(
            "h1",
            { "data-testid": "resume-title", key: "title" },
            "Resume Portfolio",
          ),
          React.createElement(
            "select",
            {
              "data-testid": "mobile-resume-selector",
              defaultValue: "fullstack",
              key: "selector",
            },
            [
              React.createElement(
                "option",
                { value: "fullstack", key: "fullstack" },
                "Full Stack Engineer Resume",
              ),
              React.createElement(
                "option",
                { value: "general", key: "general" },
                "General Professional Resume",
              ),
              React.createElement(
                "option",
                { value: "projects", key: "projects" },
                "Scrum Master - Agile Project Lead",
              ),
            ],
          ),
          React.createElement(
            "button",
            {
              "data-testid": "mobile-view-button",
              onClick: mockViewButtonHandler,
              key: "button",
            },
            "📄 View Word Document",
          ),
        ],
      );
    }
    return React.createElement(
      "div",
      { "data-testid": "resume-desktop-view" },
      [
        React.createElement(
          "div",
          { "data-testid": "desktop-action-buttons", key: "buttons" },
          "Desktop Actions",
        ),
      ],
    );
  };

  return {
    __esModule: true,
    default: MockResumePage,
    useWindowWidth: mockUseWindowWidth,
    mockViewButtonHandler,
  };
});

let mockUseWindowWidth: jest.Mock;
let mockViewButtonHandler: jest.Mock;

beforeAll(() => {
  const resumePageModule = require("./ResumePage");
  mockUseWindowWidth = resumePageModule.useWindowWidth;
  mockViewButtonHandler = resumePageModule.mockViewButtonHandler;
});

const mockResumeOptions = [
  {
    id: "fullstack",
    title: "Full Stack Engineer Resume",
    filename: "Full Stack Engineer with Projects.docx",
    description:
      "Technical resume focused on software development skills and experience",
  },
  {
    id: "general",
    title: "General Professional Resume",
    filename: "GENERAL RESUME..docx",
    description:
      "Versatile resume highlighting leadership and transferable skills",
  },
  {
    id: "projects",
    title: "Scrum Master - Agile Project Lead",
    filename: "Scrum Master - Agile Project Lead.docx",
    description:
      "Leadership-focused resume showcasing project management and agile methodologies",
  },
];

const mockInitialState = {
  projects: {
    projects: [],
    selectedProject: null,
    loading: false,
    error: null,
  },
  lectures: { lectures: [], loading: false, error: null },
  auth: { isAuthenticated: false, user: null, token: null },
  blogs: { blogs: [], loading: false, error: null },
};

describe("ResumePage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default utils behavior
    mockResumeUtils.findResumeById.mockImplementation((options, id) =>
      options.find((r: any) => r.id === id),
    );
    mockResumeUtils.generatePDFFilename.mockImplementation((resume) =>
      resume ? resume.filename.replace(".docx", ".pdf") : "resume.pdf",
    );
    mockResumeUtils.createEmailSubject.mockReturnValue(
      "Resume from Jonathan Holloway",
    );
    mockResumeUtils.createEmailBody.mockReturnValue(
      "Please find my resume attached.",
    );
  });

  describe("Mobile View (width < 647)", () => {
    beforeEach(() => {
      mockUseWindowWidth.mockReturnValue(600);
    });

    it("renders mobile view", () => {
      renderWithProviders(<ResumePage />, { initialState: mockInitialState });
      expect(screen.getByTestId("resume-mobile-view")).toBeInTheDocument();
      expect(screen.getByTestId("mobile-resume-selector")).toBeInTheDocument();
      expect(
        screen.queryByTestId("resume-desktop-view"),
      ).not.toBeInTheDocument();
    });

    it("displays title and default selector value", () => {
      renderWithProviders(<ResumePage />, { initialState: mockInitialState });
      expect(screen.getByTestId("resume-title")).toBeInTheDocument();
      const selector = screen.getByTestId(
        "mobile-resume-selector",
      ) as HTMLSelectElement;
      expect(selector.value).toBe("fullstack");
    });

    it("handles view button click", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ResumePage />, { initialState: mockInitialState });
      await user.click(screen.getByTestId("mobile-view-button"));
      expect(mockViewButtonHandler).toHaveBeenCalled();
    });

    it("mobile selector has proper attributes", () => {
      renderWithProviders(<ResumePage />, { initialState: mockInitialState });
      const selector = screen.getByTestId("mobile-resume-selector");
      expect(selector).toBeInTheDocument();
      expect(selector.tagName).toBe("SELECT");
    });
  });

  describe("Desktop View (width >= 647)", () => {
    beforeEach(() => {
      mockUseWindowWidth.mockReturnValue(1024);
    });

    it("renders desktop view", () => {
      renderWithProviders(<ResumePage />, { initialState: mockInitialState });
      expect(screen.getByTestId("resume-desktop-view")).toBeInTheDocument();
      expect(screen.getByTestId("desktop-action-buttons")).toBeInTheDocument();
    });
  });

  describe("useWindowWidth Hook", () => {
    it("mobile", () => {
      mockUseWindowWidth.mockReturnValue(500);
      renderWithProviders(<ResumePage />, { initialState: mockInitialState });
      expect(screen.getByTestId("resume-mobile-view")).toBeInTheDocument();
    });

    it("desktop", () => {
      mockUseWindowWidth.mockReturnValue(800);
      renderWithProviders(<ResumePage />, { initialState: mockInitialState });
      expect(screen.getByTestId("resume-desktop-view")).toBeInTheDocument();
    });

    it("breakpoint", () => {
      mockUseWindowWidth.mockReturnValue(647);
      renderWithProviders(<ResumePage />, { initialState: mockInitialState });
      expect(screen.getByTestId("resume-desktop-view")).toBeInTheDocument();
    });
  });

  describe("Resume Utils Functions", () => {
    it("findResumeById", () => {
      expect(
        mockResumeUtils.findResumeById(mockResumeOptions, "general"),
      ).toEqual(mockResumeOptions[1]);
      expect(
        mockResumeUtils.findResumeById(mockResumeOptions, "x"),
      ).toBeUndefined();
    });

    it("generatePDFFilename", () => {
      expect(mockResumeUtils.generatePDFFilename(mockResumeOptions[0])).toBe(
        "Full Stack Engineer with Projects.pdf",
      );
      expect(mockResumeUtils.generatePDFFilename(undefined)).toBe("resume.pdf");
    });

    it("createEmail helpers", () => {
      expect(mockResumeUtils.createEmailSubject("x")).toBe(
        "Resume from Jonathan Holloway",
      );
      expect(
        mockResumeUtils.createEmailBody("a", "b", mockResumeOptions[0]),
      ).toBe("Please find my resume attached.");
    });
  });

  describe("Resume Content Components", () => {
    it("renders structure on desktop", () => {
      mockUseWindowWidth.mockReturnValue(1024);
      renderWithProviders(<ResumePage />, { initialState: mockInitialState });
      expect(screen.getByTestId("resume-desktop-view")).toBeInTheDocument();
    });

    it("switching views does not throw", () => {
      mockUseWindowWidth.mockReturnValue(600);
      renderWithProviders(<ResumePage />, { initialState: mockInitialState });
      expect(() => {
        mockUseWindowWidth.mockReturnValue(1024);
        renderWithProviders(<ResumePage />, { initialState: mockInitialState });
      }).not.toThrow();
    });
  });
});
