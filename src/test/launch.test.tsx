import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { firstMonthPrice, normalizeWhatsApp } from "../lib/launch";

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("../lib/supabase", () => ({ supabase: { rpc }, isSupabaseConfigured: false }));

describe("WhatsApp launch page", () => {
  beforeEach(() => {
    localStorage.setItem("ec-locale", "en");
    window.history.replaceState(null, "", "/start?ref=ad894221-2105-4948-ab69-fdaf5a5d57cd");
    rpc.mockReset();
  });

  it("opens in Kazakh when the visitor has not chosen a language", () => {
    localStorage.removeItem("ec-locale");
    render(<App />);
    expect(screen.getByRole("heading", { name: "Ағылшын тілінде сенімді сөйлеңіз." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "80 пайызға дейін жеңілдік алу" })).toHaveAttribute("href", "#friends");
    expect(screen.getByRole("button", { name: "Маған курс ұсыныңыз" })).toBeInTheDocument();
  });

  it("carries the landing language into the free beginner lesson", async () => {
    localStorage.removeItem("ec-locale");
    render(<App />);
    fireEvent.click(await screen.findByRole("link", { name: /Hello! Танысамыз/ }));
    expect(await screen.findByRole("heading", { name: "Hello! Танысамыз" })).toBeInTheDocument();
  });

  it("shows the referral price for the selected number of verified friends", () => {
    render(<App />);
    expect(screen.getByText(/1,540/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "2" }));
    expect(screen.getByText(/4,620/)).toBeInTheDocument();
    expect(screen.getByText("40% off")).toBeInTheDocument();
    expect(firstMonthPrice(12)).toBe(1540);
  });

  it("submits a normalized number and the incoming referral code with no additional input", async () => {
    rpc.mockResolvedValueOnce({ data: "created", error: null });
    render(<App />);
    fireEvent.change(screen.getByLabelText("Your WhatsApp number"), { target: { value: "8 (700) 010-00-01" } });
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Recommend a course for me" }));
    expect(await screen.findByRole("heading", { name: "Your invite link is ready" })).toBeInTheDocument();
    expect(rpc).toHaveBeenCalledWith("submit_launch_lead", {
      whatsapp_number: "+77000100001",
      language: "en",
      friend_code: "ad894221-2105-4948-ab69-fdaf5a5d57cd",
      new_code: expect.any(String),
    });
    expect(normalizeWhatsApp("+7 bad number")).toBeNull();
  });
});
