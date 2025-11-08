import { defineConfig } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
    root: resolve(__dirname, 'src'),
    server: {
        port: 3000
    },
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                error500: resolve(__dirname, 'src/pages/error-500.html'),
                error400: resolve(__dirname, 'src/pages/error-400.html')
            }
        }
    },
    plugins: [
        handlebars({
            partialDirectory: resolve(__dirname, 'src/components'),
            context: {
                username: 'shabliy',
                errorCode400: '404',
                errorText400: 'Не туда попали',
                errorCode500: '500',
                errorText500: 'Мы уже фиксим',
            },
        })
    ]
});
