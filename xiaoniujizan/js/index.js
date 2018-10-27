/***
 * 主页
 */

app.startTime = GetDateDiff(app.startTime);
var StartTime = new Date(app.startTime);

app.endTime = GetDateDiff(app.endTime);
var EndTime = new Date(app.endTime);
var NowTime = new Date();
var t = EndTime.getTime() - NowTime.getTime();
var startT = NowTime.getTime() - StartTime.getTime();
var intDiff = parseInt(t / 1000); //倒计时总秒数量，因为是以毫秒为单位的所以除以1000是秒

var progressVal;//进度条

var luckDrawFlag = true; //在旋转的时候不能再次被点击
var findFriendsBtnFlag = true; //点开始抽奖时不能点击 找人充电按钮
var maxLuckNum = app.integralJiang; //一次抽奖消耗多少电量

$(function () {
  init();
});

function initDom() {
  //进度条
  progressVal = $('#p1Progress').data('progress');
}

function init() {
  initDom();
  //倒计时
  countDown(intDiff);
  //进度条
  showProgress();
  //好友帮充电文字自动向上滚动
  textTopScorll($('.p1-friends-help-txt'));

  //点击任何地方都隐藏指定弹窗，点自己除外
  hideDialog('winning'); //恭喜中奖-弹窗
  hideDialog('noWinning'); //谢谢惠顾-弹窗
  hideDialog('electricity'); //找人充电-弹窗
  hideDialog('share'); //邀请好友充电-弹窗
  hideDialog('follow'); //关注公众号-弹窗
  hideDialog('fillInInformation'); //提示完善信息-弹窗
  hideDialog('over'); //活动已结束-弹窗

  initEvent();
}

function initEvent() {
  //活动未开始 弹窗
  if (startT < 0) {
    app.showDialog('notStart');
    $('body').css('overflow', 'hidden');
  }
  //活动已结束 弹窗
  if (intDiff <= 0) {
    app.showDialog('over');
    $('body').css('overflow', 'hidden');
  }

  //九宫格抽奖--初始化
  lottery.init('box');

  //为了能走通  本地点击去帮充电页
  $('.d-share .d-share-hint').on('touchstart',function (e) {
    window.location = 'friendsHelp.html';
    e.stopPropagation();
  });

  //九宫格抽奖
  $('.p1-luck-draw-btn').on('touchend', function (e) {
    //活动已结束
    if (intDiff <= 0) {
      app.showDialog('over');
      $('body').css('overflow', 'hidden');
      return;
    }
    if (luckDrawFlag) {
      luckDrawFlag = false; //在旋转的时候不能再次被点击
      findFriendsBtnFlag = false; //点开始抽奖时不能点击 找人充电按钮

      if (progressVal >= maxLuckNum) {  //电量够
        progressVal -= maxLuckNum;
        showProgress(); //展示进度条
        lottery.speed = 100; //初始转动速度
        let prize_id = 5; //选中商品的id
        let prize_type = 2; //1 实体  2 虚拟
        let prize_name = '电动车'; //选中商品的name
        let is_person = 0; //是否填写信息  0没填写   1填写
        $("#box").attr("prize_id", prize_id);
        $("#box").attr("prize_type", prize_type);
        $("#box").attr("prize_name", prize_name);
        $("#box").attr("is_person", is_person);
        roll(); //启动九宫格轮播动画
      } else {
        //电量不足弹窗
        app.showDialog('electricity');
        ModalHelper.afterOpen();
        $('body').css('overflow', 'hidden');
        luckDrawFlag = true;
        findFriendsBtnFlag = true;
      }
    }
    e.preventDefault();
  });

  //恭喜中奖 -关闭弹窗
  $('.d-winning-close').on('click', function (e) {
    app.closeDialog('winning');
    $('body').css('overflow', 'auto');
    e.stopPropagation();
  });
  //关注公众号-关闭
  $('.d-follow-btn').on('click', function (e) {
    app.closeDialog('follow');
    $('body').css('overflow', 'auto');
    e.stopPropagation();
  });
  //谢谢惠顾-关闭
  $('.d-noWinning-btn').on('click', function (e) {
    app.closeDialog('noWinning');
    $('body').css('overflow', 'auto');
    e.stopPropagation();
  });

  //最大人数-关闭弹窗
  $('.d-maxPeople-btn').on('click', function (e) {
    app.closeDialog('maxPeople');
    ModalHelper.beforeClose();
    $('body').css('overflow', 'auto');
    e.stopPropagation();
  });

  //去个人信息页
  $('.isPerson').on('click', function () {
    //去个人信息页
    if($(this).hasClass('go-person')){
      window.location = 'person.html';
    }
    //去我的奖品页
    if($(this).hasClass('go-myPrize')){
      window.location = 'myPrize.html';
    }
  });

  //邀请好友充电-弹窗
  $('.share-btn,.d-electricity-btn').on('click', function (e) {
    //活动已结束
    if (intDiff <= 0) {
      app.showDialog('over');
      $('body').css('overflow', 'hidden');
      return;
    }
    if (findFriendsBtnFlag) {
      //找人充电-弹窗
      app.closeDialog('electricity');
      app.showDialog('share');
      $('body').css('overflow', 'hidden');
    }
    e.stopPropagation();
  });
}

/**
 * 苹果手机兼容 时间转换  "2016-05-31 08:00" 转为 "2016/05/31 08:00"
 * @param diffTime
 * @constructor
 */
function GetDateDiff(diffTime) {
  return diffTime.replace(/\-/g, "/");
}

/***
 * 展示进度条
 */
function showProgress() {
  $('#p1Progress').Maximum = 500;
  if (progressVal === 0) {
    $('#p1Progress').find('span').css({
      'transform': 'translate3d(-100%,0,0)'
    });
  } else {
    mui("#p1Progress").progressbar({progress: progressVal}).show();
  }
  if (progressVal > 99) {
    $('.pregress1').html(parseInt(progressVal / 100));
  } else {
    $('.pregress1').html('');
  }
  if (progressVal > 9) {
    $('.pregress2').html(parseInt(progressVal / 10 % 10));
  } else {
    $('.pregress2').html('');
  }
  $('.pregress3').html(parseInt(progressVal % 10));
}

/***
 * 文字自动向上滚动
 * @param wrap
 */
function textTopScorll(wrap) {
  let liLength = wrap.find('li').length;
  if (liLength <= 1) {
    return;
  }
  let interval = 2000;//定义滚动间隙时间
  setInterval(function () {
    let _field = wrap.find('li:first');//此变量不可放置于函数起始处，li:first取值是变化的
    let _h = _field.height();//取得每次滚动高度
    _field.animate({marginTop: -_h + 'px'}, 600, function () {//通过取负margin值，隐藏第一行
      _field.css('marginTop', 0).appendTo(wrap);//隐藏后，将该行的margin值置零，并插入到最后，实现无缝滚动
    })
  }, interval)//滚动间隔时间取决于interval
}

/***
 * 九宫格抽奖
 * @returns {boolean}
 */
function roll() {
  lottery.times += 1;
  lottery.roll();

  var prize_type = $("#box").attr("prize_type"); //1 实体  2 虚拟
  var prize_id = $("#box").attr("prize_id"); //选中商品的id
  var is_person = $("#box").attr("is_person"); //是否填写信息
  var prize_name = $("#box").attr("prize_name"); //获奖名称
  var prize_site = -1;
  $("#box").find('.luckDrawBox').each(function (i) {
    if ($(this).data('id') == prize_id) {
      prize_site = $(this).data('cont'); //选中商品id对应前端的第几个
      prize_name = $(this).data('tit'); //获奖名称
      return;
    }
  });

  if (lottery.times > lottery.cycle + 9 && lottery.index == prize_site) {
    clearTimeout(lottery.timer);
    lottery.prize = -1;
    lottery.times = 0;
    // click = false;
    setTimeout(function () {
      $('.d-winning').find('.prizeName').text(prize_name);
      if (prize_type == 1 && is_person == 0) { //实体且没有填写信息
        $('.d-winning').find('.fillInAddress').empty().text('请完善信息');
        $('.isPerson').removeClass('go-myPrize').addClass('go-person').empty().text('完善信息');
        $('.d-winning-close').hide();
      } else if (prize_type == 1 && is_person == 1) { //实体且填写过信息
        $('.d-winning').find('.fillInAddress').empty().text('请到“我的奖品”查看奖品');
        $('.isPerson').addClass('go-myPrize').removeClass('go-person').empty().text('去领奖');
      } else {  //抽中虚拟
        $('.d-winning').find('.fillInAddress').empty().text('请到“我的奖品”领取奖品');
        $('.isPerson').addClass('go-myPrize').removeClass('go-person').empty().text('去领奖');
      }
      //恭喜中奖弹窗
      app.showDialog('winning');
      ModalHelper.afterOpen();
      $('body').css('overflow', 'hidden');
      luckDrawFlag = true; //在旋转的时候不能再次被点击
      findFriendsBtnFlag = true; //点开始抽奖时不能点击 找人充电按钮
    }, 1000);

  } else {
    if (lottery.times < lottery.cycle) {
      lottery.speed -= 10;
    } else if (lottery.times === lottery.cycle) {
      var index = Math.random() * (lottery.count) | 0;
      lottery.prize = index;
    } else {
      // if (lottery.times > lottery.cycle + 9 && ((lottery.prize == 0 && lottery.index == 6) || lottery.prize == lottery.index + 1)) {
      //   lottery.speed += 110;
      // } else {
      lottery.speed += 20;
      // }
    }
    if (lottery.speed < 40) {
      lottery.speed = 40;
    }
    lottery.timer = setTimeout(roll, lottery.speed);
  }
  return false;
}

/***
 * 定义九宫格轮播各个参数
 * @type {{index: number, count: number, timer: number, speed: number, times: number, cycle: number, prize: number, init: lottery.init, roll: lottery.roll, stop: lottery.stop}}
 */
var lottery = {
  index: 0, //当前转动到哪个位置，起点位置
  count: 0, //总共有多少个位置
  timer: 0, //setTimeout的ID，用clearTimeout清除
  speed: 20, //初始转动速度
  times: 0, //转动次数
  cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
  prize: 0, //中奖位置
  init: function (id) {
    if ($("#" + id).find(".luckDrawBox").length > 0) {
      $lottery = $("#" + id);
      $units = $lottery.find(".luckDrawBox");
      this.obj = $lottery;
      this.count = $units.length;
      $lottery.find(".luckDrawBox-" + this.index).addClass("active");
    }
  },
  roll: function () {
    var index = this.index;
    var count = this.count;
    var lottery = this.obj;
    $(lottery).find(".luckDrawBox-" + index).removeClass("active");
    index += 1;
    if (index > count) {
      index = 0;
    }
    $(lottery).find(".luckDrawBox-" + index).addClass("active");
    this.index = index;
    return false;
  },
  stop: function (index) {
    this.prize = index;
    return false;
  }
};

// /***
//  * 点击抽奖成功展示: 关注公众号且已填个人信息
//  */
// function succClickPrize(prizeContent) {
//   // if (luckDrawFlag) {
//   //   luckDrawFlag = false; //在旋转的时候不能再次被点击
//   //   findFriendsBtnFlag = false; //点开始抽奖时不能点击 找人充电按钮
//   //   if (progressVal > maxLuckNum) {
//   //     progressVal -= maxLuckNum;
//   //产生随机数
//   let prize = Math.ceil(Math.random() * ($('.p1-luck-draw .content').length - 1));
//   //控制概率
//   if (prize === maxLuckContentNum) {
//     prize = Math.ceil(Math.random() * ($('.p1-luck-draw .content').length - 2));
//   }
//   //默认先转3圈
//   prize += 9;
//   for (let i = 1; i <= prize; i++) {
//     setTimeout(luckDrawTime(i), 9 * i * i);
//   }
//
//   setTimeout(function () {
//     //指定抽中某一个
//     endIndex = 5;
//     let $luckDraw = $('.p1-luck-draw');
//     $luckDraw.find('.content').removeClass('active');
//     $luckDraw.find('.content-' + endIndex).addClass('active');
//     // let prizeContent = $luckDraw.find('.content-' + endIndex).data('content');
//     $('.d-winning').find('.prizeName').text(prizeContent);
//     setTimeout(function () {
//       //恭喜中奖弹窗
//       app.showDialog('winning');
//       ModalHelper.afterOpen();
//       $('body').css('overflow', 'hidden');
//       luckDrawFlag = true;
//       findFriendsBtnFlag = true;
//     }, 1000);
//   }, 9 * prize * prize);
//   // showProgress();
//   //   } else {
//   //     //电量不足弹窗
//   //     app.showDialog('electricity');
//   //     ModalHelper.afterOpen();
//   //     $('body').css('overflow', 'hidden');
//   //     luckDrawFlag = true;
//   //     findFriendsBtnFlag = true;
//   //   }
//   // }
// }
//
// /***
//  * 九宫格抽奖
//  */
// function luckDrawTime(a) {
//   let $luckDraw = $('.p1-luck-draw');
//   return function () {
//     if (a > maxLuckContentNum) {
//       a = parseInt(a % maxLuckContentNum);
//       if (a === 0) {
//         a = maxLuckContentNum;
//       }
//     }
//     $luckDraw.find('.content').removeClass('active');
//     $luckDraw.find('.content-' + a).addClass('active');
//     // endIndex = a;
//   }
// }