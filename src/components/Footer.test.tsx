import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the brand name", () => {
    render(<Footer />);
    expect(screen.getByText("Trường Tiếng Việt")).toBeInTheDocument();
    expect(screen.getByText("Của Em")).toBeInTheDocument();
  });

  it("renders the copyright line with the year", () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2026 Trường Tiếng Việt Của Em/),
    ).toBeInTheDocument();
  });

  it("renders footer link sections", () => {
    render(<Footer />);
    expect(screen.getByText("Về chúng tôi")).toBeInTheDocument();
    expect(screen.getByText("Chính sách")).toBeInTheDocument();
    expect(screen.getByText("Giới thiệu")).toBeInTheDocument();
    expect(screen.getByText("Điều khoản sử dụng")).toBeInTheDocument();
  });

  it("renders social links pointing to CVCEC accounts", () => {
    render(<Footer />);
    expect(screen.getByLabelText("Facebook")).toHaveAttribute(
      "href",
      "https://facebook.com/cvcec.org",
    );
    expect(screen.getByLabelText("YouTube")).toHaveAttribute(
      "href",
      "https://youtube.com/@CVCEC2024",
    );
    expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByLabelText("WhatsApp")).toBeInTheDocument();
  });
});
