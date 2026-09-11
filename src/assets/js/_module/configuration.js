import $ from 'jquery';
import { bodyTag } from './constants';

export default function configuration() {
  $(function () {
    // ブラウザ IE判定
    const regexpIE = /msie|trident/i;
    if (regexpIE.test(navigator.userAgent)) {
      $(bodyTag).addClass('ua-ie');
    }

    // SP判定（メディアクエリ & UA）
    const winSize = window.matchMedia('(max-width: 1024px)');
    const handleMQ = (mq) => {
      if (mq.matches) {
        $(bodyTag).addClass('mq-sp');
      } else {
        $(bodyTag).removeClass('mq-sp');
      }
    };
    winSize.addListener(handleMQ);
    handleMQ(winSize);

    const regexpSP = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    if (regexpSP.test(navigator.userAgent)) {
      $(bodyTag).addClass('ua-sp');
    }

    // target="_blank" rel属性付与
    $('a[target="_blank"]').attr('rel', 'noopener noreferrer');
  });
}