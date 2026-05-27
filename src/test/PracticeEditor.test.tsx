import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PracticeEditor } from "@/features/engine/PracticeEditor";
import type { Practice } from "@/types/engine";

const DEFAULT_PRACTICE: Practice = {
  id: "p-default",
  user_id: "user-1",
  name: "Breath",
  description: "Four slow breaths.",
  is_default: true,
  active: true,
  created_at: "2026-05-01T00:00:00Z",
};

const USER_PRACTICE: Practice = {
  id: "p-user",
  user_id: "user-1",
  name: "Journaling",
  description: "Ten minutes, no agenda.",
  is_default: false,
  active: true,
  created_at: "2026-05-02T00:00:00Z",
};

const mockSaveMutate = vi.fn();
const mockDeleteMutate = vi.fn();

vi.mock("@/hooks/usePractices", () => ({
  usePractices: () => ({ data: [DEFAULT_PRACTICE, USER_PRACTICE] }),
  useSavePractice: () => ({ mutate: mockSaveMutate, isPending: false }),
  useDeletePractice: () => ({ mutate: mockDeleteMutate, isPending: false }),
}));

beforeEach(() => vi.clearAllMocks());

describe("PracticeEditor", () => {
  it("renders default practices without a remove button", () => {
    render(<PracticeEditor userId="user-1" onClose={vi.fn()} />);
    expect(screen.getByText("Breath")).toBeTruthy();
    // There should be no ✕ button for the default practice row
    const removeButtons = screen.queryAllByLabelText("Remove practice");
    expect(removeButtons.length).toBe(1); // only user practice has it
  });

  it("renders user-added practices without a toggle", () => {
    render(<PracticeEditor userId="user-1" onClose={vi.fn()} />);
    expect(screen.getByText("Journaling")).toBeTruthy();
    // Toggle has aria-label; user practice should not have one
    const toggleButtons = screen.queryAllByLabelText(/Activate|Deactivate/);
    expect(toggleButtons.length).toBe(1); // only default practice has toggle
  });

  it("tapping toggle calls useSavePractice with active flipped", async () => {
    render(<PracticeEditor userId="user-1" onClose={vi.fn()} />);
    await userEvent.click(screen.getByLabelText("Deactivate practice"));
    expect(mockSaveMutate).toHaveBeenCalledWith(
      expect.objectContaining({ id: "p-default", active: false }),
    );
  });

  it("tapping ✕ shows Remove? confirmation", async () => {
    render(<PracticeEditor userId="user-1" onClose={vi.fn()} />);
    await userEvent.click(screen.getByLabelText("Remove practice"));
    expect(screen.getByText("Remove?")).toBeTruthy();
  });

  it("confirming deletion calls useDeletePractice with correct id", async () => {
    render(<PracticeEditor userId="user-1" onClose={vi.fn()} />);
    await userEvent.click(screen.getByLabelText("Remove practice"));
    await userEvent.click(screen.getByText("Yes"));
    expect(mockDeleteMutate).toHaveBeenCalledWith("p-user", expect.anything());
  });

  it("cancelling deletion hides confirmation without deleting", async () => {
    render(<PracticeEditor userId="user-1" onClose={vi.fn()} />);
    await userEvent.click(screen.getByLabelText("Remove practice"));
    await userEvent.click(screen.getByText("Cancel"));
    expect(mockDeleteMutate).not.toHaveBeenCalled();
    expect(screen.queryByText("Remove?")).toBeNull();
  });

  it("Add button is disabled when name is empty", () => {
    render(<PracticeEditor userId="user-1" onClose={vi.fn()} />);
    const btn = screen.getByText("Add");
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it("Add button is enabled when name is filled", async () => {
    render(<PracticeEditor userId="user-1" onClose={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText("Name"), "Running");
    expect((screen.getByText("Add") as HTMLButtonElement).disabled).toBe(false);
  });

  it("submitting add form calls useSavePractice with correct payload", async () => {
    render(<PracticeEditor userId="user-1" onClose={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText("Name"), "Running");
    await userEvent.type(
      screen.getByPlaceholderText("Description"),
      "Twenty minutes outside.",
    );
    await userEvent.click(screen.getByText("Add"));
    expect(mockSaveMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Running",
        description: "Twenty minutes outside.",
        is_default: false,
        active: true,
      }),
      expect.any(Object),
    );
  });

  it("fields clear after successful add", async () => {
    mockSaveMutate.mockImplementation(
      (_payload: unknown, options: { onSuccess: () => void }) => {
        options.onSuccess();
      },
    );
    render(<PracticeEditor userId="user-1" onClose={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText("Name"), "Running");
    await userEvent.click(screen.getByText("Add"));
    expect(
      (screen.getByPlaceholderText("Name") as HTMLInputElement).value,
    ).toBe("");
  });
});
