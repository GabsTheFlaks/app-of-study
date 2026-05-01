import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
  const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

  // Mock Database (Simulating the SQLite from original code)
  const users = [
    { id: 1, username: 'admin', passwordHash: await bcrypt.hash('admin123', 10), email: 'admin@example.com', firstname: 'Admin', lastname: 'User' }
  ];

  const courses = [
    {
      id: 1,
      title: "Fundamentos de Python e Algoritmos",
      description: "Uma introdução acadêmica aos fundamentos da programação utilizando Python. Ideal para iniciantes.",
      category: "Programação",
      link_drive: "https://drive.google.com/file/d/1yR7QMTThw-L6t8Hbremnp4-Q_vhMu6br/preview",
      file_type: "pdf",
      thumbnail_url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80",
    },
    {
      id: 2,
      title: "Arquitetura de Software Moderna",
      description: "Estudo aprofundado sobre padrões de design, microsserviços e sistemas distribuídos.",
      category: "Engenharia de Software",
      link_drive: "https://drive.google.com/file/d/1uNsFp9c6Wv9x8JWmPNMoUwBpJbrJu0tK/preview",
      file_type: "pdf",
      thumbnail_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
    },
    {
      id: 3,
      title: "Machine Learning em Prática",
      description: "Modelos preditivos, regressões e redes neurais explicadas com exemplos práticos.",
      category: "Inteligência Artificial",
      link_drive: "https://drive.google.com/file/d/13b3lCUBCLjmbQkObHiNXYxiLNrJuECKr/preview",
      file_type: "pdf",
      thumbnail_url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80",
    },
    {
      id: 4,
      title: "Introdução ao React e Tailwind",
      description: "Aula gravada mostrando passo a passo como construir interfaces limpas e responsivas.",
      category: "Frontend",
      link_drive: "https://drive.google.com/file/d/16le-GZYezQf045KhNtdsMdf2t2EqV40L/preview",
      file_type: "video",
      thumbnail_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
    },
  ];

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post('/api/auth/register', async (req, res) => {
    const { username, password, email, firstname, lastname } = req.body;
    if (users.find(u => u.username === username)) return res.status(400).json({ message: 'User already exists' });
    
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, username, passwordHash, email, firstname, lastname };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username, userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('access_token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 3600000 });
    res.json({ message: 'Logged in successfully', user: { username: user.username, userId: user.id } });
  });

  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    res.json({ user: req.user });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('access_token');
    res.json({ message: 'Logged out successfully' });
  });

  // Courses
  app.get('/api/courses', authenticateToken, (req, res) => {
    res.json(courses);
  });

  app.get('/api/courses/:id', authenticateToken, (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  });

  // AI Summary Features
  app.post('/api/ai/summarize', authenticateToken, async (req, res) => {
    if (!genAI) return res.status(503).json({ message: 'AI Service unavailable' });
    const { text } = req.body;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Resuma o seguinte texto educacional de forma concisa e em português: \n\n${text}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json({ summary: response.text() });
    } catch (error) {
      res.status(500).json({ message: 'AI error' });
    }
  });

  // --- Vite / Frontend Serving ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
