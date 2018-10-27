/***
 * 个人（完善）信息页
 */

var EndTime = new Date(app.endTime); //获取截止时间
var NowTime = new Date();  //获取当前时间
var t = EndTime.getTime() - NowTime.getTime();
var intDiff = parseInt(t / 1000);//倒计时总秒数量，因为是以毫秒为单位的所以除以1000是秒
$(function () {
  init();
});

function initDom() {

}

function init() {
  initDom();
  //倒计时
  countDown(intDiff);
  initEvent();
}

function initEvent() {

  //去首页-返回按钮
  $('.go-index').on('click', function () {
    window.location = 'index.html';
  });

  //确定-提交表单-回首页
  $('.btn-submit').on('click', function () {
    //所有input框失去焦点
    $('#form').find('input').each(function () {
      $(this).blur();
    });
    if (isActivityInputOk()) {
      $('#form').submit();
    }
  });

  //点击任何地方input框失去焦点，自身除外
  blurInput();

  // input触发 ，隐藏error-tips
  $('input').on('focus', function () {
    $(this).siblings('.error-tips').hide();
  });

}

/***
 * 表单验证
 */
function isActivityInputOk() {
  let isInputOk = true;
  let username = $("input[name='username']").val(); //姓名
  let phone = $("input[name='phone']").val(); //电话
  let address = $("input[name='address']").val(); //收货地址
  var phone_yanzheng = /^1[34578][0-9]{9}$/;

  //所有input框验证不为空
  $('#form').find('.error-tips').each(function () {
    let $input = $(this).siblings(':input');
    if ($input) {
      if (!$.trim($input.val())) {
        $(this).show();
        isInputOk = false;
      } else {
        $(this).hide();
      }
    }
  });

  if (!phone_yanzheng.test(phone)) {
    $('.error-tips-phone').text('请输入合法的手机号!').show();
    isInputOk = false;
  }


  return isInputOk;
}
