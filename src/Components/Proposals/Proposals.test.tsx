import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Proposals from "./Proposals";

// Mock proposals data for all tests in this file
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
    {
      title: "Second Proposal",
      description: "Second mock proposal.",
      url: "https://example.com/2",
      duration: "2 weeks",
      technology: "Vue",
      problem: "Second problem",
      solution: "Second solution",
    },
  ],
}));

describe("Proposals component", () => {
  it("renders the first proposal by default", () => {
    render(<Proposals />);
    expect(screen.getByText(/demo project setups/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /mock proposal/i })).toBeInTheDocument();
    expect(screen.getByText(/this is a mock proposal/i)).toBeInTheDocument();
  });

  it("switches proposals when tab is clicked", () => {
    render(<Proposals />);
    const tab = screen.getByRole("button", { name: /second proposal/i });
    fireEvent.click(tab);
    expect(screen.getByRole("heading", { name: /second proposal/i })).toBeInTheDocument();
    expect(screen.getByText(/second mock proposal/i)).toBeInTheDocument();
  });
});
