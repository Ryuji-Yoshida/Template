// main.js
// jQueryは library.js 側で window.$ に登録されているため import 不要
import configuration from './_module/configuration';
import common from './_module/common';
import animation from './_module/animation';
import { bodyTag } from './_module/constants';

// DOM Ready後に各モジュールを実行（グローバルの $ を使用）
$(function () {
  configuration();
  common();

  if ($(bodyTag).hasClass('page-top')) {
    animation();
  }
});