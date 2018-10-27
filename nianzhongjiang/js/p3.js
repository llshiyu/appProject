app.pages[3] = (function() {

  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask:'p3',
    isFlipReady: false,
    hasBranch: true,
  };

  function init() {
    initEvents();
  }

  function initEvents() {
    $('.p3-btn-reset').on('click',function () {
      app.showPage(2);
    });
    $('.p3-btn-share').on('click',function () {
      $('.d-share').fadeIn();
    });
  }

  function onLoad() {
    setTimeout(function () {
      app.bgm.pause();
      aPaper.play();
      $('.p3-paper-box').addClass('p3-down-out');
    },500);
    setTimeout(function(){
      page.isFlipReady = true;
    },1000);
    setTimeout(function () {
      app.bgm.play();
      aPaper.pause();
      $('.p3-btn-box,.p3-tips').fadeIn(300);
    },3000);
  }

  function onLeave() {
    page.isFlipReady = false;
  }

  return page;
})();
