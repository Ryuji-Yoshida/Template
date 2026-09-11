import fs from 'fs';
import path from 'path';

export default function () {
  const pagesDir = path.resolve('src/_data/pages');

  // ディレクトリが存在しない場合の保護
  if (!fs.existsSync(pagesDir)) {
    return [];
  }

  const files = fs.readdirSync(pagesDir);
  let allPages = [];

  files.forEach((file) => {
    if (file.endsWith('.json')) {
      const filePath = path.join(pagesDir, file);
      const rawContent = fs.readFileSync(filePath, 'utf-8').trim();

      // ファイルの中身が空の場合はパースせずにスキップ
      if (!rawContent) {
        return;
      }

      try {
        const fileData = JSON.parse(rawContent);

        if (Array.isArray(fileData)) {
          allPages = allPages.concat(fileData);
        } else {
          allPages.push(fileData);
        }
      } catch (err) {
        // 万が一、書きかけで記述が途切れているJSONがあった場合もビルドを止めない処理
        console.warn(`[Skip Invalid JSON] ${file}: ${err.message}`);
      }
    }
  });

  return allPages;
}