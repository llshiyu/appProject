app.pages[9] = (function() {

  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask:'p9',
    isFlipReady: false,
    hasBranch: true,
  };

  function init() {
    initEvents();
  }

  function initEvents() {


    //分享给指定好友弹窗
    $('.p9-btn-friend').on('click', function () {
      app.showDialog('share');
      window._hmt && window._hmt.push(['_trackEvent', 'click', 'p9', 'p9页点击发给TA']);
      
    });
  }

  function onLoad() {
    console.log(app.showCard);
    setTimeout(function(){
      // $('#showCardImg').attr('src',app.showCard);
      // $('#showCardCoverImg').attr('src','public/static/img/p3-content'+app.tplId+'.png');
      page.isFlipReady = true;
      $('.p9-envelope-in').fadeIn(500);

    },1000);
    setTimeout(function(){
      $('.p9-envelope20').addClass('p9-envelopt2-rotate');
      $('.p9-envelope3').addClass('p9-envelopt3-rotate');
    },2000);
    setTimeout(function () {
      $('.p9-card-box').fadeIn(300);
    },2500);
    setTimeout(function () {
      $('.p9-card-in').addClass('p9-down-in');
    },3000);
    setTimeout(function () {
      $('.p9-envelope-in').addClass('p9-down-out');
      // if(app.tplId=='0'||!app.tplId){
      //   app.tplId=1;
      // }
      // console.log('app.tplId',app.tplId);
      // console.log('app.sprite[app.tplId]',app.tplId,app.sprite[app.tplId]);
      // app.sprite[app.tplId].resetEle($('.p9-cover-sprite')[0]);
      // app.sprite[app.tplId].resume();
    },5000);
    setTimeout(function () {


      // app.sprite[app.tplId].play();

      $('.p9-card-cover').fadeOut(500);
      $('.p9-btn-box,.p9-cont-tips').fadeIn(500);
    },6000);
  }

  function onLeave() {
    page.isFlipReady = false;
    setTimeout(function () {
      $('.p9-envelope-in').fadeOut(800);
      $('.p9-envelope20').removeClass('p9-envelopt2-rotate');
      $('.p9-envelope3').removeClass('p9-envelopt3-rotate');
      $('.p9-card-box').hide();
      $('.p9-card-in').removeClass('p9-down-in');
      $('.p9-envelope-in').removeClass('p9-down-out');
      $('.p9-card-cover').fadeIn(300);
      $('.p9-btn-box,.p9-cont-tips').fadeOut(500);
    }, 1000);
  }

  return page;
})();
