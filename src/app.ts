import express from "express";
import { fileURLToPath } from "url";

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

export function createApp() {
  const app = express();

  app.use(express.json());

  let tasks: Task[] = [
    {
      id: 1,
      description: "Complete the project report",
      completed: false,
    },
    {
      id: 2,
      description: "Clean the house",
      completed: true,
    },
  ];

  app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
  });

  app.get("/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);

    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json(task);
  });

  app.post("/tasks", (req, res) => {
    const newTask: Task = {
      id: tasks.length + 1,
      description: req.body.description,
      completed: req.body.completed ?? false,
    };

    tasks.push(newTask);

    return res.status(201).json(newTask);
  });

  app.put("/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);

    const taskIndex = tasks.findIndex(
      (task) => task.id === taskId
    );

    if (taskIndex === -1) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const updatedTask: Task = {
      id: taskId,
      description: req.body.description,
      completed: req.body.completed,
    };

    tasks[taskIndex] = updatedTask;

    return res.status(200).json(updatedTask);
  });

  app.delete("/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);

    const taskIndex = tasks.findIndex(
      (task) => task.id === taskId
    );

    if (taskIndex === -1) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    tasks.splice(taskIndex, 1);

    return res.status(200).json({
      message: "Task deleted",
    });
  });

  return app;
}

// Start the server only when app.ts is run directly
const currentFile = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFile) {
  const app = createApp();
  const port = 3000;

  app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
  });
}