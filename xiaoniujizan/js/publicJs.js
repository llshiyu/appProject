/***
 * 公共js
 */


//IOS 弹窗内滚动带动body滚动问题
var ModalHelper = (function (bodyCls) {
  var scrollTop;
  return {
    afterOpen: function () {
      scrollTop = document.scrollingElement.scrollTop;
      document.body.classList.add(bodyCls);
      document.body.style.top = -scrollTop + 'px';
    },
    beforeClose: function () {
      document.body.classList.remove(bodyCls);
      // scrollTop lost after set position:fixed, restore it back.
      document.scrollingElement.scrollTop = scrollTop;
    }
  };
})('modal-open');

$(function () {
  //去指定页
  goPage();
  //弹窗
  showDialog();
});
window.onload=function () {
  //初始化iscroll
  // initIscroll();
};
/**
 * 共有的页面点击跳转
 */
function goPage() {
  //去我的奖品页
  $('.go-myPrize').on('click', function () {
    window.location = 'myPrize.html';
  });
}

/**
 * 共有的弹窗触发
 */
function showDialog() {
  //活动规则-弹窗
  $('.btn-activity-rules').on('click',function () {
    app.showDialog('rule');
    ModalHelper.afterOpen();
    $('body').css('overflow', 'hidden');
  });
  $('.d-rule-btn').on('click',function () {
    app.closeDialog('rule');
    ModalHelper.beforeClose();
    $('body').css('overflow', 'auto');
  });
  //点击任何地方都隐藏指定弹窗，点自己除外
  hideDialog('rule'); //活动规则-弹窗
}

/**
 * 倒计时
 * @param intDiff
 */
function countDown(intDiff) {

  window.setInterval(function () {
    var day = 0,
      hour = 0,
      minute = 0,
      second = 0;//时间默认值
    if (intDiff === 0) { //倒计时结束弹窗提示 活动已结束
      //不可以发起砍价 弹窗
      app.showDialog('notBargain');
      $('body').css('overflow', 'hidden');
    }
    if (intDiff > 0) {
      day = Math.floor(intDiff / (60 * 60 * 24));
      hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
      minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
      second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    }
    if (hour <= 9) hour = '0' + hour;
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;
    $('.time-day1').html(parseInt(day/10));
    $('.time-day2').html(day%10);
    $('.time-hour1').html(parseInt(hour/10));
    $('.time-hour2').html(hour%10);
    $('.time-minute1').html(parseInt(minute/10));
    $('.time-minute2').html(minute%10);
    $('.time-second1').html(parseInt(second/10));
    $('.time-second2').html(second%10);
    intDiff--;
  }, 1000);
}

/***
 * 获取url中的参数
 * @param name
 * @returns {null}
 */
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg);  //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}

function initIscroll() {
  var myScroll_1 = new IScroll('.iscroll-box', {
    useTransition: true, //是否用css3滚动
    momentum: true, //是否采用惯性
    hScroll: true, //是否横向滚动
    scrollX: true,
    scrollbars: false, //是否显示滚动条
    bounce: true, //是否弹动
    click: true //是否允许点击
  });

}

/**
 * 展示提示消息
 */
function showToast() {
  $('.tip-box').fadeIn();
  setTimeout(function () {
    $('.tip-box').fadeOut();
  }, 1000);
}

/***
 * 点击任何地方都隐藏弹窗，点自己除外
 */
function hideDialog(dialogName) {
  //点击任何地方都隐藏弹窗
  $('.d-'+dialogName).on('touchstart',function(){
    app.closeDialog(dialogName);
    ModalHelper.beforeClose();
    $('body').css('overflow', 'auto');
  });
  //阻止冒泡事件,点自己不隐藏
  $(".d-"+dialogName+"-box").on('touchstart',function(e){
    e.stopPropagation();
  });
}

/***
 * 点击任何地方input框失去焦点，自身除外
 */
function blurInput() {
  //点击任何地方 所有input框失去焦点
  $(document).on('touchstart',function () {
    //所有input框失去焦点
    $('input').each(function () {
      $(this).blur();
    });
  });
  //点自己不影响
  $('input').on('touchstart',function (e) {
    e.stopPropagation();
  });
}