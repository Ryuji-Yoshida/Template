import $ from 'jquery';
import { htmlTag, win } from './constants';

export default function animation() {
  // ファーストビュー/初回インロト
  const visit = sessionStorage.getItem('visit');
  if (visit === null) {
    $(htmlTag).addClass('is-init');
    $('#logo .cls-1').on('animationend webkitAnimationEnd', function () {
      $(htmlTag).removeClass('is-init').addClass('is-anime');
      sessionStorage.setItem('visit', 'true');
    });
    $('.header--site').on('transitionend webkitTransitionEnd', function () {
      $(htmlTag).removeClass('is-anime');
    });
  } else if (visit) {
    $(htmlTag).addClass('is-visit');
    $('[data-js-anime="sec"]').removeAttr('data-js-anime');
  }

  // スクロールアニメーション
  $(window).on('load scroll', function () {
    const elem = '[data-js-anime="sec"]';
    $(elem).each(function () {
      const pos = $(win).scrollTop();
      const winH = $(win).height();
      const offset = $(this).offset().top;
      const animeStart = pos + winH / 1.2 > offset;
      if (animeStart) {
        $(this).addClass('is-anime');
      }
    });
  });
}