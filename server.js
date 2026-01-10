import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { engine } from 'express-handlebars';

// eslint-disable-next-line import/no-unresolved
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

console.log('__fileName = ', __filename);
console.log('__dirName = ', __dirname);

app.use(express.static(path.resolve(__dirname, 'dist')));

app.engine('hbs', engine({
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'components')
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'dist/pages'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT);

console.log(`Server started on http://localhost:${PORT}`);
