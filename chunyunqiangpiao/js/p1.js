app.pages[1] = (function () {
  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask: 'p1',
    isFlipReady: false, //标志页面是否可以翻页, 当页面所有动画运行完之后设置为true,离开页面后再重置为false
    hasBranch: false, //标志页面内是否有分支,默认为false,
  };

  function init() {
    initEvents();
  }

  function initEvents() {
    $('.p1-btn-alert').click(function () {
      app.showDialog('share');
    });
  }

  function onLoad() {
    setTimeout(function () {
      page.isFlipReady = true;
      // $('.p1-say1').addClass('p1-say1-animate');
      // setTimeout(function () {
      $('.p1-say1').addClass('p1dd1');
      $('.p1-say2').addClass('p1-say2-animate').show();
      setTimeout(function () {
        $('.p1-say2').addClass('p1dd2');
        // $('.p1-say3').addClass('p1-say3-animate').show();
        // setTimeout(function () {
        // $('.p1-say3').addClass('p1dd3');
        $('.p1-say4').addClass('p1-say4-animate').show();
        setTimeout(function () {
          $('.p1-say4').addClass('p1dd4');
          $('.p1-say5').addClass('p1-say5-animate').show();
          setTimeout(function () {
            $('.p1-say5').addClass('p1dd5');
          }, 1000);
        }, 1000);
        // }, 1000);
      }, 1000);
      // }, 1000);
    }, 1000);
  }

  function onLeave() {
    page.isFlipReady = false;
    setTimeout(function () {
      $('.p1-say1').removeClass('p1-say1-animate').removeClass('p1dd1');
      $('.p1-say2').removeClass('p1-say2-animate').removeClass('p1dd2').hide();
      $('.p1-say3').removeClass('p1-say3-animate').removeClass('p1dd3').hide();
      $('.p1-say4').removeClass('p1-say4-animate').removeClass('p1dd4').hide();
      $('.p1-say5').removeClass('p1-say5-animate').removeClass('p1dd5').hide();
    }, 1000);
  }

  return page;
})();


