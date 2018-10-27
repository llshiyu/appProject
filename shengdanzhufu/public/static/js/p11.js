app.pages[11] = (function() {

  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask:'p11',
    isFlipReady: false,
    hasBranch: true,
  };
  // var p11MySwiper = {};

  function init() {
    initEvents();
    initDom();
  }

  function initDom() {
    app.p11MySwiper = new Swiper('.p11-swiper', {
      nextButton: '.p11-swiper-next-btn',
      prevButton: '.p11-swiper-prev-btn'
    })

  }

  function initEvents() {


  }


  function onLoad() {
    setTimeout(function(){
      page.isFlipReady = true;
    },1000);
    app.p11MySwiper.update();
  }

  function onLeave() {
    page.isFlipReady = false;
  }

  return page;
})();
