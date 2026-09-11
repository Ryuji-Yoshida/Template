## 11ty + Vite SSG Development Template

11ty（Eleventy）とViteを組み合わせた、高速な静的サイト制作・SSG開発のためのスターターテンプレートです。

### 特徴

* **高速ビルド & HMR**: Viteによる快適なローカル開発環境
* **SSG**: 11ty（Eleventy）を利用したテンプレートエンジンの管理
* **コード品質管理**: ESLint, Stylelint, Prettier による自動整頓
* **パッケージ管理**: pnpm (pnpm-workspace)

### ディレクトリ構成
.
├── scripts/             # カスタムビルド・クリーンアップ用スクリプト
│   ├── clean-dist.mjs
│   └── remove-empty-dirs.mjs
├── src/                 # ソースファイル
│   ├── _data/           # 11ty グローバルデータファイル
│   ├── _templates/      # レイアウト・パーツテンプレート
│   ├── assets/          # CSS/SCSS, 画像等
│   ├── public/          # 静的ファイル (js等)
│   └── page.ejs         # ページテンプレート
├── .eleventy.js         # 11ty 設定ファイル
├── vite.config.js       # Vite 設定ファイル
├── eslint.config.js     # ESLint 設定ファイル
├── .stylelintrc.json    # Stylelint 設定ファイル
└── .prettierrc          # Prettier 設定ファイル

## セットアップ & 使い方

1. 依存関係のインストール
pnpm install
2. 開発用サーバーの起動
pnpm dev
3. ビルド
pnpm build

## 補足
パッケージ管理はpnpmで対応しています

## 開発ステータス
現在このプロジェクトは初期調整中（WIP）です。基本機能の動作確認は完了していますが、必要に応じて設定や構成の微調整を行っています。

## ライセンス
本リポジトリは自由に使用・改変していただけます。（必要に応じてライセンス名をご記述ください）