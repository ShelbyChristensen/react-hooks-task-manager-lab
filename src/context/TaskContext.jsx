import React, { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6001/tasks")
      .then((r) => r.json())
      .then((data) => setTasks(data));
  }, []);

  const addTask = (newTask) => {
    fetch("http://localhost:6001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((r) => r.json())
      .then((data) => setTasks((prev) => [...prev, data]));
  };

  const toggleComplete = (id) => {
    const taskToToggle = tasks.find((task) => task.id === id);
    if (!taskToToggle) return;

    const updatedTask = { ...taskToToggle, completed: !taskToToggle.completed };

    fetch(`http://localhost:6001/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: updatedTask.completed }),
    })
      .then((r) => r.json())
      .then(() => {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      });
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleComplete }}>
      {children}
    </TaskContext.Provider>
  );
}
