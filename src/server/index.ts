// server/index.ts
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}


const users: User[] = [];
const tasks: Task[] = [];
let userIdCounter = 1;
let taskIdCounter = 1;

const JWT_SECRET = "your-secret-key";

const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    req.user = decoded as { userId: string; email: string };
    next();
  });
};

app.post("/api/auth/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as SignupData;

    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
      id: String(userIdCounter++),
      name,
      email,
      password: hashedPassword,
    };

    users.push(user);

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = users.find((u) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/auth/me", authenticateToken, (req: AuthRequest, res: Response) => {
  const user = users.find((u) => u.id === req.user?.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});


app.get("/api/tasks", authenticateToken, (req: AuthRequest, res: Response) => {
  const userTasks = tasks.filter((t) => t.userId === req.user?.userId);
  res.json(userTasks);
});

app.post("/api/tasks", authenticateToken, (req: AuthRequest, res: Response) => {
  const { title, description } = req.body as { title: string; description?: string };
  if (!title) return res.status(400).json({ error: "Title is required" });

  const task: Task = {
    id: String(taskIdCounter++),
    title,
    description,
    completed: false,
    userId: req.user!.userId,
  };

  tasks.push(task);
  res.status(201).json(task);
});

app.put("/api/tasks/:id", authenticateToken, (req: AuthRequest, res: Response) => {
  const taskIndex = tasks.findIndex(
    (t) => t.id === req.params.id && t.userId === req.user?.userId
  );

  if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

  const updatedTask = { ...tasks[taskIndex], ...req.body };
  tasks[taskIndex] = updatedTask;

  res.json(updatedTask);
});

app.delete("/api/tasks/:id", authenticateToken, (req: AuthRequest, res: Response) => {
  const taskIndex = tasks.findIndex(
    (t) => t.id === req.params.id && t.userId === req.user?.userId
  );

  if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

  tasks.splice(taskIndex, 1);
  res.json({ message: "Task deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
