import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

describe("useLocalStorage Hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should return the initial value when key is not in storage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("should return stored value when key exists in storage", () => {
    localStorage.setItem("test-key", JSON.stringify("stored-value"));
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("stored-value");
  });

  it("should update localStorage when value changes", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(localStorage.getItem("test-key")!)).toBe("updated");
  });

  it("should support function updater", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(6);
  });

  it("should handle complex objects", () => {
    const initialValue = { name: "test", items: [1, 2, 3] };
    const { result } = renderHook(() => useLocalStorage("obj-key", initialValue));

    expect(result.current[0]).toEqual(initialValue);

    const newValue = { name: "updated", items: [4, 5] };
    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(JSON.parse(localStorage.getItem("obj-key")!)).toEqual(newValue);
  });

  it("should handle boolean values", () => {
    const { result } = renderHook(() => useLocalStorage("bool-key", false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
  });

  it("should fallback to initial value on corrupted storage data", () => {
    localStorage.setItem("corrupt-key", "not-valid-json{{{");
    const { result } = renderHook(() => useLocalStorage("corrupt-key", "fallback"));
    expect(result.current[0]).toBe("fallback");
  });
});
