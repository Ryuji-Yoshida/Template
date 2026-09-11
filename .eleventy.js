import eleventyPluginEjs from '@11ty/eleventy-plugin-ejs';

export default async function (eleventyConfig) {
  const isDevelopment = process.argv.includes('--watch');

  eleventyConfig.addGlobalData('isDevelopment', isDevelopment);

  // EJSプラグインの登録
  eleventyConfig.addPlugin(eleventyPluginEjs);

  // src/publicの内容をdist直下へコピー
  eleventyConfig.addPassthroughCopy({ 'src/public': '/' });

  // 監視対象の追加
  eleventyConfig.addWatchTarget('./src/_data/');

  // アセットの変換と更新はViteに任せる
  eleventyConfig.ignores.add('src/assets/**');

  // 11ty 開発サーバーの設定
  eleventyConfig.setServerOptions({
    port: 3000,
    showAllHosts: true,
    domDiff: true,
  });

  // 基本ディレクトリ・テンプレートエンジンの設定
  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_templates',
      data: '_data',
    },
    htmlTemplateEngine: 'ejs',
    markdownTemplateEngine: 'ejs',
    templateFormats: ['ejs', 'md', 'html'],
  };
}