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
  var $p1Select = $('.p1-select');
  var $p1Ul = $('.p1-select-list-box');

  function initEvents() {
    $('body').click(function () {
      if (!$('.p1-select').hasClass('p1-arrow-down')) {
        //展开状态--要闭合
        $('.p1-select').removeClass('p1-arrow-up').addClass('p1-arrow-down');
        $('.p1-select-list-box').addClass('hide');
      }
    });
    $('.p1-select').click(function (e) {
      window._hmt && window._hmt.push(['_trackEvent', '首页', '点击选择职业下拉框']);
      e.stopPropagation();
      $('.p1-tips-occupation').hide();
      if ($(this).hasClass('p1-arrow-down')) {
        $(this).removeClass('p1-arrow-down').addClass('p1-arrow-up');
        $('.p1-select-list-box').removeClass('hide');
      } else {
        $(this).removeClass('p1-arrow-up').addClass('p1-arrow-down');
        $('.p1-select-list-box').addClass('hide');
      }
    });
    $('.p1-select-list-box li').on('click', function (e) {
      window._hmt && window._hmt.push(['_trackEvent', '首页', '点击选择职业li']);
      e.stopPropagation();
      var p1ListVal = $(this).text();
      var p1ListId = $(this).data('id');

      var $p1Select = $('.p1-select');
      var $p1Ul = $('.p1-select-list-box');

      $p1Select.text(p1ListVal);
      $p1Select.attr('data-id', p1ListId);
      $p1Select.removeClass('gray-color');
      $p1Select.removeClass('p1-arrow-up').addClass('p1-arrow-down');
      $p1Ul.addClass('hide');
    });
    $('.p1-btn').on('click', function (e) {
      window._hmt && window._hmt.push(['_trackEvent', '首页', '点击提交按钮']);
      e.stopPropagation();
      var username = $("input[name='username']").val();
      var occupationId = $('.p1-select').attr('data-id');
      var occupationVal = $('.p1-select').text();
      if (!checkInput(username)) {
        return;
      }
      if (occupationId == 0) {
        console.log('请选择职业');
        // $('.p1-tips-occupation').show();
        errorTips('请选择职业');
        return;
      }

      console.log('下一页');
      var data = {
        username: username,
        occupationId: occupationId,
        occupationVal: occupationVal
      };
      console.log(data);
      // ajaxForm(data);
      app.showPage(2);

    });
    $("input[name='username']").on('change',function () {
      $('.p1-tips-name').hide();
    });
    $('.d-tips').click(function () {
      $(this).fadeOut(300);
    });
  }

  function ajaxForm(formData) {
    $.ajax({
      url:'api/home/index/getInfo',
      type:'POST',
      dataType:'json',
      data:{
        name: formData.username,
        job: formData.occupationVal
      },
      beforeSend:function(xhr,settings){
        //发送请求前
        $('.d-loading').show(); //显示菊花
        console.log('beforeSend',xhr,settings);
      },
      success:function(data,status,xhr){
        //请求成功
        console.log('success',data,status,xhr);
        if(data.code === 0){
          window._hmt && window._hmt.push(['_trackEvent', '首页', '提交信息ajax成功']);

          var numList = data.data;
          var p2List = '<li class="p2-calculator-number" data-txt="'+numList[0].score+'" data-id="'+numList[0].id+'"><a href="javascript:;">'+numList[0].press+'</a></li>' +
            '        <li class="p2-calculator-number" data-txt="'+numList[1].score+'" data-id="'+numList[1].id+'"><a href="javascript:;">'+numList[1].press+'</a></li>' +
            '        <li class="p2-calculator-number" data-txt="'+numList[2].score+'" data-id="'+numList[2].id+'"><a href="javascript:;">'+numList[2].press+'</a></li>' +
            '        <li class="p2-calculator-symbol" data-txt="-1"><a href="javascript:;">AC</a></li>' +
            '        <li class="p2-calculator-number" data-txt="'+numList[3].score+'" data-id="'+numList[3].id+'"><a href="javascript:;">'+numList[3].press+'</a></li>' +
            '        <li class="p2-calculator-number" data-txt="'+numList[4].score+'" data-id="'+numList[4].id+'"><a href="javascript:;">'+numList[4].press+'</a></li>' +
            '        <li class="p2-calculator-number" data-txt="'+numList[5].score+'" data-id="'+numList[5].id+'"><a href="javascript:;">'+numList[5].press+'</a></li>' +
            '        <li class="p2-calculator-symbol" data-txt="+"><a href="javascript:;">+</a></li>' +
            '        <li class="p2-calculator-number" data-txt="'+numList[6].score+'" data-id="'+numList[6].id+'"><a href="javascript:;">'+numList[6].press+'</a></li>' +
            '        <li class="p2-calculator-number" data-txt="'+numList[7].score+'" data-id="'+numList[7].id+'"><a href="javascript:;">'+numList[7].press+'</a></li>' +
            '        <li class="p2-calculator-number" data-txt="'+numList[8].score+'" data-id="'+numList[8].id+'"><a href="javascript:;">'+numList[8].press+'</a></li>' +
            '        <li class="p2-calculator-symbol" data-txt="="><a href="javascript:;">=</a></li>';
          $('.p2-calculator-box').empty().append(p2List);
          app.showPage(2);
        }else{
          errorTips(data.msg);
        }
      },
      error:function(xhr,errorType,error){
        //请求失败
        window._hmt && window._hmt.push(['_trackEvent', '首页', '提交信息ajax失败']);

        errorTips('网络异常，请稍后再试');
        console.log('error',xhr,errorType,error);
      },
      complete:function(xhr,status){
        $('.d-loading').hide(); //关闭菊花
        console.log('complete',xhr,status);
      }
    });
  }

  function checkInput(obj) {
    $('.p1-tips-name').hide();
    var checkFlag = true;
    var zhongwen = /^[\u4e00-\u9fa5A-Za-z\d]+$/;
    if (!obj) {
      console.log('请输入昵称');
      // $('.p1-tips-name-empty').show();
      errorTips('请输入昵称');

      checkFlag = false;
    }else if (!zhongwen.exec(obj)) {
      console.log('只能输入中文英文数字');
      // $('.p1-tips-name-error').show();
      errorTips('只能输入中文英文数字');

      checkFlag = false;
    } else if (obj.trim().length < 2 || obj.trim().length > 3) {
      console.log('昵称长度范围为2~3字');
      // $('.p1-tips-name-error').show();
      errorTips('昵称长度范围为2~3字');

      checkFlag = false;
    }
    return checkFlag;
  }

  function onLoad() {
    setTimeout(function () {
      page.isFlipReady = true;
    }, 1000);
  }

  function onLeave() {
    page.isFlipReady = false;
    setTimeout(function () {
      $p1Select.text('选择职业');
      $p1Select.attr('data-id', 0);
      $p1Select.addClass('gray-color');
      $("input[name='username']").val('');
    }, 1000);
  }



  return page;
})();


