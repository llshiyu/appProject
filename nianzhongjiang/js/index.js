// 功能1：定义全局事件
// 功能2：定义加载函数，框架已经定义好，只需需要手动在 app.loader.init 中添加 加载任务序列;
// 功能3：初始化app


$(function () {
  function initCommenEvent() {

    $('.btn-prev').click(function () {
      if (app.audios && app.audios.aCrow) {
        // app.audios.aCrow.play();
      }
      if (app.pages[app.currentPage - 1]) {
        app.showPage(app.currentPage - 1);
        // return false;
      }
    });
    $('.btn-next').click(function () {
      if (app.audios && app.audios.aWow) {
        // app.audios.aWow.play();
      }
      if (app.pages[app.currentPage + 1]) {
        app.showPage(app.currentPage + 1);
      }
    });

  }

  /***********************************/
  function loading(showPageId, branch) {
    var timeout;
    var interval = 0;
    var flagFakeOver = 0;
    var processNum = 0;
    var randomStep = function () {
      var time = 50.0 + 0 | Math.random() * 500;
      timeout = setTimeout(function () {
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
    var setProcess = function (n) {
      $('.p0-process').text(n + '%');
    };
    var fakePreload = function () {
      randomStep();
    };

    fakePreload();

    $('.cssloader').hide();
    $('.p0').show();

    app.loader.init({

      // 在manifest中定义加载序列
      manifest: [{
        id: 'p1',
        selector: '.p1 img',
        imgs: ['img/p1bg.jpg', 'img/p1_btn.png', 'img/p1_cont.png', 'img/tips.png']
      }, {
        id: 'p2',
        selector: '.p2 img',
        imgs: ['img/p2_cont.png']
      }, {
        id: 'p3',
        selector: '.p3 img',
        imgs: ['img/p3_cont.png', 'img/p3_paper_bg.png', 'img/p3_btn_reset.png', 'img/p3_btn_share.png', 'img/p3_eye1.png', 'img/p3_eye2.png']
      }],


      onAllFrontImgLoaded: function (e) {
        // console.log('onAllFrontImgLoaded');
        clearInterval(interval);
        processNum = 80;
        flagFakeOver = 1;
        clearTimeout(timeout);

        interval = setInterval(function () {
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

  function initApp() {
    app.initPages();
    loading(1);
    app.common.initContentBox($('.content'), 5, 3);
    initCommenEvent();
    app.bgm && app.bgm.init();
  }

  initApp();
});

//错误提示
function errorTips(obj) {
  $('.d-tips-txt span').text(obj);
  $('.d-tips').fadeIn(300);
  setTimeout(function () {
    $('.d-tips').fadeOut(300);
  }, 2000);
}