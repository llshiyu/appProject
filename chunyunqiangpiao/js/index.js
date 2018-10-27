// 功能1：定义全局事件
// 功能2：定义加载函数，框架已经定义好，只需需要手动在 app.loader.init 中添加 加载任务序列;
// 功能3：初始化app


$(function() {
  function initCommenEvent() {
    $('.go-page2').click(function () {
      app.showPage(2);
    });
  }

  /***********************************/
  function loading(showPageId, branch) {
    var timeout;
    var interval = 0;
    var flagFakeOver = 0;
    var processNum = 0;
    var randomStep = function( ) {
      var time = 50.0 + 0 | Math.random() * 500;
      timeout = setTimeout(function() {
        processNum += 1.0 + 0 | Math.random() * 5;
        if (processNum >= 79) {
          processNum = 79;
          flagFakeOver = 1;
        }
        setProcess(processNum);
        if(!flagFakeOver){
          randomStep();
        }else{
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
      manifest: [{
        id: 'p1',
        selector: '.p1 img',
        imgs:['img/p1bg.png?v=2','img/p1_logo.png?v=2','img/p1_say11.png?v=2','img/p1_say12.png?v=2','img/p1_say13.png?v=2','img/p1_say21.png?v=2','img/p1_say22.png?v=2','img/p1_say23.png?v=2','img/p1_say31.png?v=2','img/p1_say32.png?v=2','img/p1_say33.png?v=2','img/p1_say41.png?v=2','img/p1_say42.png?v=2','img/p1_say43.png?v=2','img/p1_say51.png?v=2','img/p1_say52.png?v=2','img/p1_say53.png?v=2']
      }, {
        id: 'p2',
        selector: '.p2 img',
        imgs:['img/succ.png?v=2','img/p2bg.png?v=2','img/p2_jump1.png?v=2','img/p2_jump2.png?v=2','img/p2_button.png?v=2','img/p2_jump_bg.png?v=2','img/jump_bai.png?v=2','img/jump_show1.png?v=2','img/jump_show2.png?v=2','img/jump_show3.png?v=2','img/jump_show4.png?v=2','img/jump_show5.png?v=2','img/jump_show6.png?v=2','img/jump_show7.png?v=2','img/jump_show8.png?v=2','img/jump_show9.png?v=2','img/jump_show10.png?v=2','img/p2_train.png?v=3','img/p2_tips.png?v=2']
      }, {
        id: 'p3',
        selector: '.p3 img',
        imgs:['img/p3bg.png?v=4','img/p3_cont_1.png?v=4','img/p3_cont_2.png?v=4','img/p3_cont_3.png?v=4','img/p3_cont_4.png?v=4','img/p3_cont_5.png?v=4','img/ticket.png?v=4','img/longclick.png?v=4','img/p3_btn_reset.png?v=4','img/p3_btn_share.png?v=4']
      }],


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
        }, 300);
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
