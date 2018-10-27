// 功能1：定义全局事件
// 功能2：定义加载函数，框架已经定义好，只需需要手动在 app.loader.init 中添加 加载任务序列;
// 功能3：初始化app


$(function() {




  function initCommenEvent() {


    $('.go-page1').on('click', function() {
      app.showPage(1);
      window._hmt && window._hmt.push(['_trackEvent', 'click', '点击跳转P1页']);
    });
    $('.go-page2').on('click', function() {
      app.showPage(2);
      window._hmt && window._hmt.push(['_trackEvent', 'click', '点击跳转P2页']);
    });
    $('.go-page3').on('click', function() {
      app.showPage(3);
      window._hmt && window._hmt.push(['_trackEvent', 'click', '点击跳转P3页']);
    });
    $('.go-page4').on('click', function() {
      app.showPage(4);
      window._hmt && window._hmt.push(['_trackEvent', 'click', '点击跳转P4页']);
    });
    $('.go-page5').on('click', function() {
      app.showPage(5);
      window._hmt && window._hmt.push(['_trackEvent', 'click', '点击跳转P5页']);
    });
    $('.go-page6').on('click', function() {
      app.showPage(6);
      window._hmt && window._hmt.push(['_trackEvent', 'click', '点击跳转P6页']);
    });
    $('.go-page7').on('click', function() {
      app.showPage(7);
      window._hmt && window._hmt.push(['_trackEvent', 'click', '点击跳转P7页']);
    });
    $('.go-page8').on('click', function() {
      app.showPage(8);
      window._hmt && window._hmt.push(['_trackEvent', 'click', '点击跳转P8页']);
    });
    $('.go-page9').on('click', function() {
      app.showPage(9);
      window._hmt && window._hmt.push(['_trackEvent', 'click', '点击跳转P9页']);
    });
    $('.go-page10').on('click', function() {
      app.showPage(10);
      window._hmt && window._hmt.push(['_trackEvent', 'click', '点击跳转P10页']);
    });
    $('.go-page11').on('click', function() {
      app.showPage(11);
      window._hmt && window._hmt.push(['_trackEvent', 'click', '点击跳转P11页']);
    });

    $('.btn-prev').click(function() {
      if (app.audios && app.audios.aCrow) {
        // app.audios.aCrow.play();
      }
      if (app.pages[app.currentPage - 1]) {
        app.showPage(app.currentPage - 1);
        window._hmt && window._hmt.push(['_trackEvent', 'click', '点击跳转上一页']);
        // return false;
      }
    });
    $('.btn-next').click(function() {
      if (app.audios && app.audios.aWow) {
        // app.audios.aWow.play();
      }
      if (app.pages[app.currentPage + 1]) {
        app.showPage(app.currentPage + 1);
        window._hmt && window._hmt.push(['_trackEvent', 'click', '点击跳转下一页']);
      }
    });

  }

  var j = 0;
  var loadArr = [];
  var loadingArr = [];
  var loadingArr2 = [];
  var dataBgImg = [
    [app.root + 'img/p1bg.jpg',app.root + 'img/p1_btn.png',app.root + 'img/p1_btn_active.png']
  ,[app.root + 'img/p2bg.jpg',app.root + 'img/p2_cont.png',app.root + 'img/p2_photo_border.png',app.root + 'img/p2_phone_succ.png',app.root + 'img/p2_phone_cont.png',app.root + 'img/p2_btn.png',app.root + 'img/p2_btn_active.png']
  ,[app.root + 'img/p3bg.jpg',app.root + 'img/p3_content.png',app.root + 'img/arrow_right.png',app.root + 'img/arrow_left.png',app.root + 'img/p3_prev_btn.png',app.root + 'img/p3_prev_btn_active.png',app.root + 'img/p3_submit_btn.png',app.root + 'img/p3_submit_btn_active.png']
  ,[app.root + 'img/p5bg.jpg',app.root + 'img/p4_content_bg.png',app.root + 'img/p4_mail_btn_own.png',app.root + 'img/p4_mail_btn_select.png',app.root + 'img/p4_submit_btn.png',app.root + 'img/p4_submit_btn_active.png']
  ,[app.root + 'img/p5bg_1.png',app.root + 'img/p5_card_cover.png',app.root + 'img/p5_cont.png',app.root + 'img/p5_envelope1.png',app.root + 'img/p5_envelope3.png',app.root + 'img/p5_btn_prev.png',app.root + 'img/p5_btn_prev_active.png',app.root + 'img/p5_btn_friends.png',app.root + 'img/p5_btn_friends_active.png',app.root + 'img/p5_btn_friends_circle.png',app.root + 'img/p5_btn_friends_circle_active.png']
  ,[app.root + 'img/p6bg.jpg']
  ,[app.root + 'img/p7_cont.png',app.root + 'img/p7_card.png',app.root + 'img/p7_btn_next.png',app.root + 'img/p7_btn_next_active.png',app.root + 'img/p7_btn_index.png',app.root + 'img/p7_btn_index_active.png']
  ,[app.root + 'img/p8bg.jpg',app.root + 'img/p8bg.jpg',app.root + 'img/p8_photo.png',app.root + 'img/p8_cont.png',app.root + 'img/p8_btn_again.png',app.root + 'img/p8_btn_again_active.png',app.root + 'img/p8_btn_submit.png',app.root + 'img/p8_btn_submit_active.png']
  ,[app.root + 'img/p9_btn_friend.png',app.root + 'img/p9_btn_friend_active.png',app.root + 'img/p9_cont.png']
  ,[app.root + 'img/p10_cont.png',app.root + 'img/p10_btn_again.png']
  ,[app.root + 'img/p11bg_1.png',app.root + 'img/p11_btn.png',app.root + 'img/p11_btn_active.png']
  ];
  for(var i=0;i<=45;i++){
    var ifix = i<10?'0'+i:i;
    dataBgImg[2].push(app.root + 'img/card1/Card-1' + ifix+'.png'); 
    dataBgImg[2].push(app.root + 'img/card2/Card-2' + ifix+'.png'); 
    dataBgImg[2].push(app.root + 'img/card3/Card-3' + ifix+'.png'); 
    dataBgImg[2].push(app.root + 'img/card4/Card-4' + ifix+'.png'); 
  }

  for (var i = 1; i < 12; i++) {
    loadingArr.push({
      id: 'p' + i,
      selector: '.p' + i + ' img',
      imgs: dataBgImg[i-1]
    });
  }


  for (var i = 1; i < 12; i++) {
    if (i <= 6) {
      j = i + 5;
    } else {
      j = (i * 1.0 - 6.0).toFixed(0);
    }
    loadingArr2.push({
      id: 'p' + j,
      selector: '.p' + j + ' img',
      imgs: dataBgImg[j-1]
    });
  } 


  /***********************************/
  function loading(showPageId, branch) {
    if (showPageId >= 6) {
      loadArr = loadingArr;
    } else {
      loadArr = loadingArr2;

    }

    var timeout;
    var interval = 0;
    var flagFakeOver = 0;
    var processNum = 0;
    var randomStep = function() {
      var time = 50.0 + 0 | Math.random() * 500;
      timeout = setTimeout(function() {
        processNum += 1.0 + 0 | Math.random() * 5;
        if (processNum >= 79) {
          processNum = 79;
          flagFakeOver = 1;
        }
        setProcess(processNum);
        if (!flagFakeOver) {
          randomStep();
        } else {
          clearTimeout(timeout);
        }
      }, time);
    };
    var setProcess = function(n) {
      $('.p0-process').text(n + '%');
    };
    var fakePreload = function() {
      randomStep();
    };

    fakePreload();

    $('.cssloader').hide();
    $('.p0').show();

    app.loader.init({

      // 在manifest中定义加载序列
      manifest: loadArr,
      onAllFrontImgLoaded: function(e) {
        // console.log('onAllFrontImgLoaded');
        clearInterval(interval);
        processNum = 80;
        flagFakeOver = 1;
        clearTimeout(timeout);

        interval = setInterval(function() {
          processNum += 3;
          if (processNum >= 100) {
            processNum = 100;
            clearInterval(interval);
            app.showPage(showPageId, branch);
          }
          setProcess(processNum);
        }, 600);
      },
    });
    app.loader.showPageNo = showPageId;
    app.loader.start('p' + showPageId);

  }

  /************************************/

  app.sprite = [];

  function initSprite() {
    for (var i = 1; i < 5; i++) {
      app.sprite[i] = new MovieSprites($('.slick-img' + i)[0], {
        totalFrame: 45,
        frameOrigin: 0,
        imgNameFixDightNum: 2,
        imgRootName: app.root + 'img/card' + i + '/Card-' + i,
        finishCallback: function(i) {
          // console.log('finishCallback：sprite' + i);
        }
      });
    }
  }

  function initApp() {
    var page = app.common.getQueryString('page');
    // console.log();
    app.initPages();
    if (page) {
      loading(page);
    } else if (app.shareId) {
      loading(6);
      window._hmt && window._hmt.push(['_trackEvent', '进入页面', '通过分享id进入P6页']);
    } else {
      loading(1);
      window._hmt && window._hmt.push(['_trackEvent', '进入页面', '正常进入第一页']);
    }
    app.common.initContentBox($('.content'), 5, 3);
    initCommenEvent();
    initSprite();
    app.bgm && app.bgm.init();
  }

  initApp();
});

// 全局错误弹框
function toastError(text) {
  $('.d-error').fadeIn(300);
  // app.showDialog('error');
  $('.d-error .d-error-box-text').text(text);
  window._hmt && window._hmt.push(['_trackEvent', '展示错误弹框', '错误信息为' + text]);
  setTimeout(function() {
    $('.d-error').fadeOut(300);
    // app.hideDialog('error');
  }, 2000)
}

