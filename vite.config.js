import { defineConfig } from 'vite';
import { resolve, relative, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { globSync } from 'glob';

const __dirname = dirname(fileURLToPath(import.meta.url));

// src/assets 内の JS/SCSS を自動エントリー化する関数
function getInputs() {
  const inputs = {};
  // _ で始まらない js および scss を取得
  const files = globSync('src/assets/{js,scss}/*.{js,scss}').filter(
    (file) => !basename(file).startsWith('_'),
  );

  files.forEach((file) => {
    const normalizedFile = file.replace(/\\/g, '/');
    const relativePath = relative('src/assets', normalizedFile).replace(/\\/g, '/');
    // 拡張子を除いたキー名（例: 'js/main', 'scss/style', 'scss/top'）
    let key = relativePath.slice(0, -extname(relativePath).length);
    if (key.startsWith('js/')) {
      key = key.slice(3);
    }

    inputs[key] = resolve(__dirname, file);
  });

  return inputs;
}

export default defineConfig({
  root: './',
  publicDir: 'src/public',

  plugins: [
    {
      name: 'serve-eleventy-output',
      configureServer(server) {
        server.middlewares.use(async (request, response, next) => {
          if (request.url !== '/') {
            next();
            return;
          }

          const html = await readFile(resolve(__dirname, 'dist/index.html'), 'utf8');
          const transformedHtml = await server.transformIndexHtml(request.url, html);
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/html');
          response.end(transformedHtml);
        });
      },
    },
  ],

  resolve: {
    alias: [
      { find: /^\/src/, replacement: resolve(__dirname, 'src') },
      { find: 'jquery', replacement: resolve(__dirname, 'node_modules/jquery') },

      // 【重要】開発サーバー用：/assets/css/*.css の要求を src/assets/scss/*.scss へ接続
      {
        find: /^\/assets\/css\/(.+)\.css$/,
        replacement: resolve(__dirname, 'src/assets/scss/$1.scss'),
      },
    ],
  },

  build: {
    outDir: 'dist',
    emptyOutDir: false,
    assetsInlineLimit: 0,
    modulePreload: false,

    rollupOptions: {
      // SCSS と JS を明示的にビルドエントリーとして渡す
      input: getInputs(),

      output: {
        // エントリー JS の出力先指定
        entryFileNames: (chunkInfo) => {
          // SCSS ビルド時に生成される一次ダミー JS の退避処理
          if (chunkInfo.name.startsWith('scss/')) {
            return 'assets/js/_temp/[name].js';
          }
          return 'assets/js/[name].js';
        },

        chunkFileNames: 'assets/js/[name].js',

        // JS の個別分離設定
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');
          if (normalizedId.includes('/src/assets/js/')) {
            const relativePath = normalizedId.split('/src/assets/js/')[1];
            if (!relativePath.includes('/') && !relativePath.startsWith('_')) {
              return relativePath.replace(/\.[^/.]+$/, '');
            }
          }
        },

        // SCSS から抽出された CSS の出力先制御 (scss/style ➔ assets/css/style.css)
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
});