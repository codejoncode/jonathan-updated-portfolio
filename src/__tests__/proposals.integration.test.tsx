import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as proposalsData from "../data/proposals";
import Proposals from "../Components/Proposals/Proposals";

// Mock axios to avoid ESM import issues
jest.mock("axios", () => ({}));

// Mock Lectures to avoid axios import chain
// At the top of your test file
jest.mock("../data/proposals", () => ({
  proposals: [
    {
      title: "Mock Proposal",
      description: "This is a mock proposal.",
      url: "https://example.com",
      duration: "1 week",
      technology: "React",
      problem: "Mock problem",
      solution: "Mock solution",
    },
  ],
}));

describe("Proposals route integration", () => {
  it("renders the proposals page at /proposals", () => {
    // Dynamically import App after mocks
    const App = require("../App").default;
    render(
      <MemoryRouter initialEntries={["/proposals"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/demo project setups/i)).toBeInTheDocument();
  });

  it("shows empty state if proposals array is empty", () => {
    jest.resetModules();
    jest.doMock("../data/proposals", () => ({ proposals: [] }));
    const AppWithEmptyProposals = require("../App").default;
    render(
      <MemoryRouter initialEntries={["/proposals"]}>
        <AppWithEmptyProposals />
      </MemoryRouter>
    );
    expect(screen.getByText(/no proposals available/i)).toBeInTheDocument();
  });
});

describe("Proposals component", () => {
  it("renders empty state if no proposals exist", () => {
    const original = proposalsData.proposals;
    (proposalsData as any).proposals = [];
    render(<Proposals />);
    expect(screen.getByText(/no proposals available/i)).toBeInTheDocument();
    expect(screen.getByText(/check back soon/i)).toBeInTheDocument();
    (proposalsData as any).proposals = original;
  });

  it("renders the first proposal by default", () => {
    render(<Proposals />);
    expect(screen.getByText(/demo project setups/i)).toBeInTheDocument();
    // Check for the first proposal's title
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("switches proposals when tab is clicked", () => {
    const original = proposalsData.proposals;
    const testProposals = [
      {
        title: "Test Proposal 1",
        description: "Desc 1",
        url: "https://docs.google.com/document/d/1/preview",
        duration: "1 week",
        technology: "Tech 1",
        problem: "Prob 1",
        solution: "Sol 1",
      },
      {
        title: "Test Proposal 2",
        description: "Desc 2",
        url: "https://docs.google.com/document/d/2/preview",
        duration: "2 weeks",
        technology: "Tech 2",
        problem: "Prob 2",
        solution: "Sol 2",
      },
    ];
    (proposalsData as any).proposals = testProposals;
    render(<Proposals />);
    const tab = screen.getByRole("button", { name: /test proposal 2/i });
    fireEvent.click(tab);
    expect(screen.getByText(/test proposal 2/i)).toBeInTheDocument();
    (proposalsData as any).proposals = original;
  });
});
