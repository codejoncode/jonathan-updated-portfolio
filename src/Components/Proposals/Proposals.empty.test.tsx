import React from "react";
import { render, screen } from "@testing-library/react";
import Proposals from "./Proposals";

jest.mock("../../data/proposals", () => ({
  proposals: [],
}));

test("shows a friendly message if proposals array is empty", () => {
  render(<Proposals />);
  expect(screen.getByText(/no proposals available/i)).toBeInTheDocument();
  expect(screen.getByText(/check back soon/i)).toBeInTheDocument();
});