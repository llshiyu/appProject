/***
 * 好友看到的帮充电页
 */

app.endTime = GetDateDiff(app.endTime);
var EndTime = new Date(app.endTime); //获取截止时间
var NowTime = new Date();  //获取当前时间
var t = EndTime.getTime() - NowTime.getTime();
var intDiff = parseInt(t / 1000);//倒计时总秒数量，因为是以毫秒为单位的所以除以1000是秒

var progressVal;//进度条

var luckDrawFlag = true; //助力一次后不能再次助力
var luckBtnFlag = true; //点击时没走完ajax不能接着点击
var maxLuckNum = 20; //一次助力给多少电量

$(function () {
  init();
});

function initDom() {
  //进度条
  progressVal = $('#p2Progress').data('progress');
}

function init() {
  initDom();
  //倒计时
  countDown(intDiff);
  //好友帮充电文字自动向上滚动
  textTopScorll($('.p2-friends-help-txt'));

  //展示进度条
  showProgress();
  //点击任何地方都隐藏指定弹窗，点自己除外
  hideDialog('helpError'); //不可重复帮充电弹窗  //这个貌似没用了,充过电后按钮变了就进不来了
  hideDialog('maxPeople'); //人数已达上线弹窗
  hideDialog('over'); //活动已结束-弹窗

  initEvent();
}

function initEvent() {
  //活动已结束 弹窗
  if (intDiff <= 0) {
    app.showDialog('over');
    $('body').css('overflow', 'hidden');
  }

  //帮充电按钮点击
  $('.btn-activity-helpSucc').on('touchend', function (e) {
    //活动已结束
    if (intDiff <= 0) {
      app.showDialog('over');
      $('body').css('overflow', 'hidden');
      return;
    }
    if(luckBtnFlag){
      luckBtnFlag = false;

      //luckDrawFlag   true表示当前第一次点击，之后都是false
      // app.prizeSet 0表示可以充电   1表示已经充过电了
      //   app.allowPerson 0表示还有没达到上限  1表示已经达到上限不能充电

      //这个貌似没用了,充过电后按钮变了就进不来了
      if(!luckDrawFlag || app.prizeSet !== '0'){
        console.log('冲过电了');
        app.showDialog('helpError');//不可重复帮充电弹窗
        $(this).addClass('hide');
        $(this).siblings('.btn-gray').removeClass('hide');
      }

      if(luckDrawFlag && app.prizeSet === '0' && app.allowPerson !== '0'){
        console.log('已经达到上限不能充电');
        app.showDialog('maxPeople');//人数已达上线弹窗
      }
      if (luckDrawFlag && app.prizeSet === '0' && app.allowPerson === '0') {
        console.log('没达到上限,可以充电');
        app.showDialog('helpSucc');
        let nickname = '赵四';
        let lastLi = '<li>好友<span class="friends-name">'+nickname+'</span>帮TA充电<span class="friends-electricity">'+maxLuckNum+'</span>%</li>';
        $('.p2-friends-help-txt').append(lastLi);
        textTopScorll($('.p2-friends-help-txt'));
      }
      ModalHelper.afterOpen();
      $('body').css('overflow', 'hidden');
    }
    e.stopPropagation();
  });
  //帮充电成功-关闭弹窗
  $('.d-helpSucc-btn').on('touchstart', function (e) {
    app.closeDialog('helpSucc');
    ModalHelper.beforeClose();
    $('body').css('overflow', 'auto');

    progressVal += parseInt(maxLuckNum);
    showProgress();

    luckDrawFlag = false;
    luckBtnFlag = true;

    $('.btn-activity-helpSucc').addClass('hide');
    $('.btn-activity-helpSucc').siblings('.btn-gray').removeClass('hide');
    e.stopPropagation();
  });
  // 不可重复帮充电 - 关闭弹窗   //这个貌似没用了,充过电后按钮变了就进不来了
  $('.d-helpError-btn').on('touchstart', function (e) {
    app.closeDialog('helpError');
    ModalHelper.beforeClose();
    $('body').css('overflow', 'auto');
    luckBtnFlag = true;
    e.stopPropagation();
  });
  //最大人数-关闭弹窗
  $('.d-maxPeople-btn').on('touchstart', function (e) {
    app.closeDialog('maxPeople');
    ModalHelper.beforeClose();
    $('body').css('overflow', 'auto');
    luckBtnFlag = true;
    e.stopPropagation();
  });

  //去首页
  $('.go-index').on('click', function () {
    // app.prizeSet 0表示可以充电   1表示已经充过电了
    //   app.allowPerson 0表示还有没达到上限  1表示已经达到上限不能充电
    if(app.allowPerson === '1'){
      console.log('人数已达上线');
      $('.d-maxPeople-txt').empty().text('参加活动人数已达上线!');
      app.showDialog('maxPeople');//人数已达上线弹窗
      return;
    }
    //倒计时结束弹窗提示 活动已结束
    if (intDiff <= 0) {
      app.showDialog('over');
      $('body').css('overflow', 'hidden');
    } else {
      //返回首页
      window.location = 'index.html';
    }
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
  mui("#p2Progress").progressbar({progress: progressVal}).show();
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
  if(liLength <= 3){
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
