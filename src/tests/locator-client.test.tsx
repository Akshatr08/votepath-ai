import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LocatorClient } from "@/components/locator/LocatorClient";

// Mock Google Maps
vi.mock("@vis.gl/react-google-maps", () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="api-provider">{children}</div>,
  Map: ({ children }: { children: React.ReactNode }) => <div data-testid="google-map">{children}</div>,
  AdvancedMarker: ({ title }: { title: string }) => <div data-testid="map-marker" aria-label={title} />,
  Pin: () => <div data-testid="map-pin" />,
  useMap: () => ({
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(13),
  }),
}));

describe("LocatorClient", () => {
  it("renders the polling locator heading", () => {
    render(<LocatorClient />);
    expect(screen.getByRole("heading", { name: /Locator/i })).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<LocatorClient />);
    expect(screen.getByPlaceholderText(/zip code or address/i)).toBeInTheDocument();
  });

  it("renders location cards for mock polling stations", () => {
    render(<LocatorClient />);
    expect(screen.getByText(/Central Library Community Center/i)).toBeInTheDocument();
    expect(screen.getByText(/North Side High School/i)).toBeInTheDocument();
    expect(screen.getByText(/County Election Office/i)).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<LocatorClient />);
    expect(screen.getByRole("button", { name: /All/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Booth/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Registration/i })).toBeInTheDocument();
  });

  it("can update search input", () => {
    render(<LocatorClient />);
    const input = screen.getByPlaceholderText(/zip code or address/i);
    fireEvent.change(input, { target: { value: "110001" } });
    expect((input as HTMLInputElement).value).toBe("110001");
  });

  it("renders map zoom controls", () => {
    render(<LocatorClient />);
    expect(screen.getByRole("button", { name: /Zoom in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Zoom out/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Center on my location/i })).toBeInTheDocument();
  });

  it("renders Use My Location button", () => {
    render(<LocatorClient />);
    const btns = screen.getAllByText(/Use My Location/i);
    expect(btns.length).toBeGreaterThan(0);
  });

  it("renders the Google Map component", () => {
    render(<LocatorClient />);
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
  });

  it("renders map markers for each location", () => {
    render(<LocatorClient />);
    const markers = screen.getAllByTestId("map-marker");
    expect(markers.length).toBe(3);
  });
});
