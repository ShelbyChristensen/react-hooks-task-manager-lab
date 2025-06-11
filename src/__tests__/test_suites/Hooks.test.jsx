import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../../components/App";
import { TaskProvider } from "../../context/TaskContext";

describe("Task Manager App", () => {
  // 👇 Put it right here
  beforeEach(() => {
    global.fetch = vi.fn((url, options) => {
      if (options?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 3, title: "Walk the dog", completed: false }),
        });
      }

      if (options?.method === "PATCH") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ completed: true }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 1, title: "Buy groceries", completed: false },
            { id: 2, title: "Finish React project", completed: false },
          ]),
      });
    });
  });

  it("renders initial tasks from the backend", async () => {
    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.getByText("Finish React project")).toBeInTheDocument();
    });
  });

  it("adds a new task when the form is submitted", async () => {
    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    const input = screen.getByPlaceholderText("Add a new task...");
    const button = screen.getByText("Add Task");

    fireEvent.change(input, { target: { value: "Walk the dog" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Walk the dog")).toBeInTheDocument();
    });
  });

  it("filters tasks based on search input", async () => {
    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    const searchInput = screen.getByPlaceholderText("Search tasks...");

    fireEvent.change(searchInput, { target: { value: "groceries" } });

    await waitFor(() => {
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.queryByText("Finish React project")).not.toBeInTheDocument();
    });
  });

  it("toggles task completion state", async () => {
    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    const toggleBtn = await screen.findByTestId("toggle-1");
    fireEvent.click(toggleBtn);

    await waitFor(() => {
      expect(screen.getByText("Undo")).toBeInTheDocument();
    });
  });
});
