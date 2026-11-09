import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";

describe("English City", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState(null, "", "/courses");
  });

  it("shows the catalog from the starter content", async () => {
    render(<App />);
    expect(await screen.findByRole("heading", { name: "Курсы английского" })).toBeInTheDocument();
    expect(await screen.findByText("Pre-Intermediate Course")).toBeInTheDocument();
    expect(screen.getByText("First Steps")).toBeInTheDocument();
  });

  it("switches the interface to Kazakh", async () => {
    render(<App />);
    (await screen.findByRole("button", { name: "KZ" })).click();
    expect(await screen.findByRole("heading", { name: "Ағылшын тілі курстары" })).toBeInTheDocument();
  });
});
