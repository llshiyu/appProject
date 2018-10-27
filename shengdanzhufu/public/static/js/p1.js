app.pages[1] = (function() {

  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask:'p1',
    isFlipReady: false,
    hasBranch: true,
  };

  function init() {
    initEvents();
  }

  function initEvents() {
    $('.p1-user-icon').on('click',function(){
      app.showPage(11);
    })
  }

  function onLoad() {
    setTimeout(function(){
      page.isFlipReady = true;
    },1000);
    $('.p1-content-img').addClass('p1-content-img-animate');
  }

  function onLeave() {
    page.isFlipReady = false;
  }

  return page;
})();
