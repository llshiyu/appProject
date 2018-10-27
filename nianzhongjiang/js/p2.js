app.pages[2] = (function () {

  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask: 'p2',
    isFlipReady: false,
    hasBranch: true,
  };

  var numFlag = false;  //数字键盘flag  false-按过加号  true-连着按数字键盘
  var oldClickId;       //记录上一次按的数字键的id
  var addFlag = false;  //加号flag   true-按过数字  false-连着按加号    只有按完数字可以接着按加号
  var totalFlag = false;  //等号flag  true-按过数字  false-连着按等号   只有按完数字可以接着按等号

  function init() {
    // initEvents();
    browserRedirect();

  }
  function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    console.log("您的浏览设备为：");
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
      console.log("phone");
      initEvents();
    } else {
      initPcEvents();
      console.log("pc");
    }
  }
  function initEvents() {
    //右侧按键
    $('.p2-calculator-box').on('touchstart', '.p2-calculator-symbol', function () {
      aClick.play();
      $('.p2-tips').hide();
      numFlag = false;
      var p2CalTxt = $(this).data('txt');  //按键的内容值
      var total = ($('.p2-total').text() - '0') + ($('.p2-now-num').text() - '0');   //计算总值
      if (p2CalTxt == '-1') {   //重置键
        window._hmt && window._hmt.push(['_trackEvent', '计算器页', '点击重置键']);
        $('.p2-total').text('');  //放总值
        $('.p2-now-num').text(0);  //放当前按键值，有计算值放计算值
        $('.p2-symbol').text('');  //放符号
        $('.p2-calculator-box .p2-calculator-number').each(function () {
          $(this).removeClass('p2-active');
        })
      } else if (p2CalTxt == '+') {  //加号
        window._hmt && window._hmt.push(['_trackEvent', '计算器页', '点击加号键']);
        totalFlag = false;
        if (addFlag) {
          $('.p2-total').text(total);
          $('.p2-now-num').text(total);
          $('.p2-symbol').text('+');
          addFlag = false;
        }
      } else if (p2CalTxt == '=') {   //等号
        window._hmt && window._hmt.push(['_trackEvent', '计算器页', '点击等号键']);
        if (totalFlag) {
          $('.p2-now-num').text(total);
        }
        var activeNum = [];   //统计按过那些数字键  统计id值
        $('.p2-calculator-box .p2-calculator-number').each(function () {
          if ($(this).hasClass('p2-active')) {
            activeNum.push($(this).data('id'))
          }
        });
        var calData = {
          activeNum: activeNum,
          total: total
        };
        if ($('.p2-now-num').text() && $('.p2-now-num').text() != 0) {
          // ajaxCalcuator(calData);
          $('.p2-total').text('');
          $('.p2-symbol').text('');
          console.log(calData);
          app.showPage(3);
        } else {
          $('.p2-tips').show();
        }
        totalFlag = false;
      }
    });

    //左侧数字九宫格
    $('.p2-calculator-box').on('touchstart', '.p2-calculator-number', function () {
      aClick.play();
      $('.p2-tips').hide();
      if (!$(this).hasClass('p2-active')) {
        window._hmt && window._hmt.push(['_trackEvent', '计算器页', '点击数字键']);

        $(this).addClass('p2-active');
        if (numFlag) {
          $(".p2-calculator-number[data-id='" + oldClickId + "']").removeClass('p2-active');
        }
        var p2CalTxt = $(this).data('txt');
        $('.p2-now-num').text(p2CalTxt);
        addFlag = true;
        totalFlag = true;
        numFlag = true;
        oldClickId = $(this).data('id');
      }
    });
  }
  function initPcEvents() {
    //右侧按键
    $('.p2-calculator-box').on('click', '.p2-calculator-symbol', function () {
      aClick.pause();
      aClick.currentTime=0;
      aClick.play();
      $('.p2-tips').hide();
      numFlag = false;
      var p2CalTxt = $(this).data('txt');  //按键的内容值
      // var total = ($('.p2-total').text() - '0') + ($('.p2-now-num').text() - '0');   //计算总值
      if (p2CalTxt == '-1') {   //重置键
        // window._hmt && window._hmt.push(['_trackEvent', '计算器页', '点击重置键']);
        $('.p2-total').text('');  //放总值
        $('.p2-now-num').text(0);  //放当前按键值，有计算值放计算值
        $('.p2-symbol').text('');  //放符号
        $('.p2-calculator-box .p2-calculator-number').each(function () {
          $(this).removeClass('p2-active');
        })
      } else if (p2CalTxt == '+') {  //加号
        // window._hmt && window._hmt.push(['_trackEvent', '计算器页', '点击加号键']);
        totalFlag = false;
        if (addFlag) {
          // var total = ($('.p2-total').text() - '0') + ($('.p2-now-num').text() - '0');
          // $('.p2-total').text(total);
          $('.p2-now-num').append('+');
          // $('.p2-symbol').text('+');
          addFlag = false;
        }
      } else if (p2CalTxt == '=') {   //等号
        window._hmt && window._hmt.push(['_trackEvent', '计算器页', '点击等号键']);
        var total;
        if (totalFlag) {  //最后一个点击得是数字
          // var total = ($('.p2-total').text() - '0') + ($('.p2-now-num').text() - '0');

          total = eval($('.p2-now-num').text());

          // $('.p2-now-num').text(total);
          totalFlag = false;
        }else{   //最后一个点击得是加号
          var p2NowText = $('.p2-now-num').text();
          p2NowText=p2NowText.substring(0,p2NowText.length-1);
          total = eval(p2NowText);
        }

        var activeNum = [];   //统计按过那些数字键  统计id值
        $('.p2-calculator-box .p2-calculator-number').each(function () {
          if ($(this).hasClass('p2-active')) {
            activeNum.push($(this).data('id'))
          }
        });
        var calData = {
          activeNum: activeNum,
          total: total
        };
        if ($('.p2-now-num').text() && $('.p2-now-num').text() != 0) {

          // ajaxCalcuator(calData);
          $('.p2-total').text('');
          $('.p2-symbol').text('');
          console.log(calData);
          app.showPage(3);
        } else {
          // $('.p2-total').text('');
          // $('.p2-symbol').text('');
          $('.p2-now-num').text('');
          $('.p2-tips').show();
        }

      }
    });


    //左侧数字九宫格
    $('.p2-calculator-box').on('click', '.p2-calculator-number', function () {
      aClick.pause();
      aClick.currentTime=0;
      aClick.play();
      $('.p2-tips').hide();
      if (!$(this).hasClass('p2-active')) {
        // window._hmt && window._hmt.push(['_trackEvent', '计算器页', '点击数字键']);

        $(this).addClass('p2-active');
        var p2CalTxt = $(this).data('txt');  //当前按键得数值
        if (numFlag) {  //连着按数字键盘
          $(".p2-calculator-number[data-id='" + oldClickId + "']").removeClass('p2-active');
          var nowNum = $('.p2-now-num').text();    //当前计算器显示得信息
          var lastIndex = nowNum.lastIndexOf('+');  //最后一个加号得位置
          // console.log('lastIndex ',lastIndex);
          if(lastIndex === -1){   //没有加号
            $('.p2-now-num').text(p2CalTxt);
          }else{   //有加号
            var newStr = nowNum.slice(0,lastIndex+1);  //删除最后一个加号之后得数字
            newStr = newStr.concat(p2CalTxt);          //想加号后面加新数字
            $('.p2-now-num').text(newStr);             //显示
          }
        }else{  //按过加号
          if($('.p2-now-num').text() == 0){
            $('.p2-now-num').text(p2CalTxt);
          }else{
            // var p2CalTxt = $(this).data('txt');
            $('.p2-now-num').append(p2CalTxt);
          }

        }
        addFlag = true;
        totalFlag = true;
        numFlag = true;
        oldClickId = $(this).data('id');
      }
    });
  }
  function ajaxCalcuator(calData) {
    $.ajax({
      url: 'api/home/Index/getMergePic',
      type: 'POST',
      dataType: 'json',
      data: {
        score: calData.total
      },
      beforeSend: function (xhr, settings) {
        //发送请求前
        $('.d-loading').show(); //显示菊花
        console.log('beforeSend', xhr, settings);
      },
      success: function (data, status, xhr) {
        //请求成功
        console.log('success', data, status, xhr);
        if (data.code === 0) {
          $('.p3-paper-img').attr('src', data.data.url);
          app.showPage(3);
        } else {
          errorTips(data.msg);
        }
      },
      error: function (xhr, errorType, error) {
        //请求失败
        window._hmt && window._hmt.push(['_trackEvent', '计算器页', '向后台传递数据ajax失败']);

        errorTips('网络异常，请稍后再试');
        console.log('error', xhr, errorType, error);
      },
      complete: function (xhr, status) {
        $('.d-loading').hide(); //关闭菊花
        console.log('complete', xhr, status);
      }
    });
  }

  function onLoad() {
    setTimeout(function () {
      page.isFlipReady = true;
    }, 1000);

  }

  function onLeave() {
    page.isFlipReady = false;
    setTimeout(function () {
      //离开页面将所有按键置为初始状态
      $('.p2-total').text('');  //放总值
      $('.p2-now-num').text('');  //放当前按键值，有计算值放计算值
      $('.p2-symbol').text('');  //放符号
      $('.p2-calculator-box .p2-calculator-number').each(function () {
        $(this).removeClass('p2-active');
      });
      numFlag = false;  //数字键盘flag  true-按过加号  false-连着按数字键盘
      addFlag = false;  //加号flag   true-按过数字  false-连着按加号    只有按完数字可以接着按加号
      totalFlag = false;  //等号flag  true-按过数字  false-连着按等号   只有按完数字可以接着按等号
    }, 1000);

  }

  return page;
})();
