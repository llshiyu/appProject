app.pages[7] = (function() {

  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask:'p7',
    isFlipReady: false,
    hasBranch: true,
  };

  function init() {
    initEvents();
  }

  function initEvents() {

  }

  function onLoad() {
    // app.shareTitle = '送给TA一份只有TA能打开的圣诞祝福';
    // app.shareDesc = '什么，居然还有这种操作？';

    console.log(app.link + 'public/static/img/share'+app.tplId+'.jpg?v=1');


    window.wxshare.config({
      imgUrl: app.link + 'public/static/img/share'+app.tplId+'.jpg?v=1'
    });
    setTimeout(function(){
      page.isFlipReady = true;
    },1000);
  }

  function onLeave() {
    page.isFlipReady = false;
  }

  return page;
})();
