import $ from 'jquery';
import { click } from './constants';

export default function common() {
  // グローバルナビ
  const elem = '[data-js-elem="header"]';
  const trigger = '[data-js-trigger="gnav"]';
  const menu = '[data-js-trigger="menu"]';

  if ($(trigger).length) {
    $(document).on(click, '[data-js-elem="header"]:not(.is-active) ' + menu, function () {
      $(elem).addClass('is-active');
    });
    $(document).on(click, '.is-active[data-js-elem="header"] ' + menu, function () {
      $(elem).removeClass('is-active');
    });

    $(window).on('load', function () {
      $(document).on(click, trigger, function (e) {
        const href = $(this).attr('href');
        const target = $(href === '#' || href === '' ? 'html' : href);
        const pos = target.offset().top;

        $('html, body').animate({ scrollTop: pos }, 400, 'swing');
        e.preventDefault();
      });
    });

    $(window).on('load scroll', function () {
      const thisPos = $(window).scrollTop();
      if (thisPos > 200) {
        $(elem).addClass('is-small');
      } else {
        $(elem).removeClass('is-small');
      }
      if ($(elem).hasClass('is-active')) {
        $(elem).removeClass('is-active');
      }
    });
  }

  // アンカーリンク
  const anchorTrigger = '[data-js-trigger="anchor"]';
  $(document).on(click, anchorTrigger, function (e) {
    const href = $(this).attr('href');
    const target = $(href === '#' || href === '' ? 'html' : href);
    const position = target.offset().top;

    $('html, body').animate({ scrollTop: position }, 400, 'swing');
    e.preventDefault();
  });

  // 追従メニュー
  $(window).on('scroll', function () {
    const documentHeight = $(document).height();
    const scrollPosition = $(this).height() + $(this).scrollTop();
    const footerHeight = $('.footer--site').innerHeight() || 0;

    if (documentHeight - scrollPosition <= footerHeight) {
      $('[data-js-elem="floatmenu"]').addClass('is-stop');
    } else {
      $('[data-js-elem="floatmenu"]').removeClass('is-stop');
    }
  });
}