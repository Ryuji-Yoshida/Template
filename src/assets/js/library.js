// library.js
import Cookies from 'js-cookie';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import $ from 'jquery';

// プラグイン（sumoselect等）が参照できるようにグローバルへ登録する
window.$ = $;
window.jQuery = $;

// グローバル登録の後にインポートする
import 'sumoselect';

// GSAPプラグインの登録
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 必要に応じて window やグローバルに公開
window.Cookies = Cookies;
window.Lenis = Lenis;
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

// 画面初期化の例
document.addEventListener('DOMContentLoaded', () => {
  const lenis = new Lenis();
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
});