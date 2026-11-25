import { defineConfig } from 'vite';
import { resolve, relative, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { globSync } from 'glob';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getInputs() {
  const inputs = {};
  const files = globSync('src/assets/{js,scss}/*.{js,scss}').filter(
    (file) => !basename(file).startsWith('_'),
  );

  files.forEach((file) => {
    const normalizedFile = file.replace(/\\/g, '/');
    const relativePath = relative('src/assets', normalizedFile).replace(/\\/g, '/');
    let key = relativePath.slice(0, -extname(relativePath).length);
    if (key.startsWith('js/')) {
      key = key.slice(3);
    }

    inputs[key] = resolve(__dirname, file);
  });

  return inputs;
}

export default defineConfig(({ mode }) => {
  const isDelivery = mode === 'delivery';

  return {
    root: './',
    publicDir: 'src/public',

    plugins: [
      {
        name: 'serve-eleventy-output',
        configureServer(server) {
          const distDir = resolve(__dirname, 'dist');

          server.watcher.add(distDir);
          server.watcher.on('change', (file) => {
            if (file.startsWith(distDir) && file.endsWith('.html')) {
              server.ws.send({ type: 'full-reload' });
            }
          });

          server.middlewares.use(async (request, response, next) => {
            const pathname = request.url?.split('?')[0];
            const outputPath =
              pathname === '/'
                ? 'dist/index.html'
                : pathname?.startsWith('/') && pathname.endsWith('.html')
                  ? `dist${pathname}`
                  : pathname?.startsWith('/')
                    ? `dist${pathname.replace(/\/$/, '')}/index.html`
                    : null;

            if (!outputPath) {
              next();
              return;
            }

            let html;
            try {
              html = await readFile(resolve(__dirname, outputPath), 'utf8');
            } catch {
              next();
              return;
            }

            const transformedHtml = await server.transformIndexHtml(request.url, html);
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/html');
            response.end(transformedHtml);
          });
        },
      },
      // ビルド時（build / build:delivery 共通）に画像を自動圧縮
      ViteImageOptimizer({
        includePublic: true, // src/public 内の画像も圧縮対象にする
        logStats: true,      // ビルド時に圧縮率のログを表示
        png: {
          quality: 80,
        },
        jpeg: {
          quality: 80,
        },
        jpg: {
          quality: 80,
        },
        webp: {
          quality: 80,
        },
        avif: {
          quality: 80,
        },
      }),
    ],

    resolve: {
      alias: [
        { find: /^\/src/, replacement: resolve(__dirname, 'src') },
        { find: 'jquery', replacement: resolve(__dirname, 'node_modules/jquery') },
        {
          find: /^\/assets\/css\/(.+)\.css$/,
          replacement: resolve(__dirname, 'src/assets/scss/$1.scss'),
        },
      ],
    },

    css: {
      preprocessorOptions: {
        scss: {
          outputStyle: isDelivery ? 'expanded' : 'compressed',
        },
      },
    },

    build: {
      outDir: 'dist',
      emptyOutDir: false,
      assetsInlineLimit: 0,
      modulePreload: false,
      minify: !isDelivery,
      cssMinify: !isDelivery,

      rollupOptions: {
        input: getInputs(),

        output: {
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name.startsWith('scss/')) {
              return 'assets/js/_temp/[name].js';
            }
            return 'assets/js/[name].js';
          },

          chunkFileNames: 'assets/js/[name].js',

          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, '/');
            if (normalizedId.includes('/src/assets/js/')) {
              const relativePath = normalizedId.split('/src/assets/js/')[1];
              if (!relativePath.includes('/') && !relativePath.startsWith('_')) {
                return relativePath.replace(/\.[^/.]+$/, '');
              }
            }
          },

          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              const nameWithoutScss = assetInfo.name.replace(/^scss\//, '');
              return `assets/css/${nameWithoutScss}`;
            }
            return 'assets/[name].[ext]';
          },
        },
      },
    },
    server: {
      port: 3000,
      open: true,
    },
  };
});