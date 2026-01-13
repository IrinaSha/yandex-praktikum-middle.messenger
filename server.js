import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

console.log('__fileName = ', __filename);
console.log('__dirName = ', __dirname);

// Статические файлы
app.use(express.static(path.resolve(__dirname, 'dist')));

// SPA fallback middleware (обрабатывает все запросы)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT);

console.log(`Server started on http://localhost:${PORT}`);
