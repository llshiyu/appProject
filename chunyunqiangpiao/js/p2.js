app.pages[2] = (function () {

  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask: 'p2',
    isFlipReady: false,
    hasBranch: true,
  };

  var btnFlag = true;
  var answerNumber = 10;  //题目总数
  var nowAnswerNumber = 0; //答到第几题
  var succAnswerNumber = 0; //答对数目数
  var comboNumber = 0; //连击数
  var totalScore = 0; //总积分
  var timeCount = 0; //计时器
  var jumpAniArr = ['-15', '-27', '-40', '-53', '-65', '-78', '-91', '-103', '-115']; //上面跳跃的坐标
  var trainAniArr = ['-292.4', '-255.9', '-219.2', '-182.7', '-146.2', '-109.5', '-73', '-36.5', '0']; //火车的坐标
  var succAnswerArr = [6, 36, 36, 1, 3, 1, 1, 24, 4, 236];
  var answerNumArr = [5, 10, 15, 20, 20, 20, 20, 20, 20, 50]; //题目的连击分数

  var timeCountFun;  //计时器函数

  var randomNum = Math.floor(Math.random() * 10 + 1);  //生成1-10的随机数

  function init() {
    initEvents();
  }

  function initEvents() {
    //选择答案
    $('.p2-train-answer').on('touchstart', function () {
      if ($(this).hasClass('p2-train-answer-active')) {
        $(this).removeClass('p2-train-answer-active');
      } else {
        $(this).addClass('p2-train-answer-active');
        btnFlag = true;
      }
    });
    $('.p2-btn').on('click', function () {
      if (btnFlag) {
        btnFlag = false;
        var nowClickAnswer = getClickAnswer();
        if (!nowClickAnswer) {
          // console.log('请选择');
          $('.d-tips').fadeIn(300);
          setTimeout(function () {
            $('.d-tips').fadeOut(300);
          }, 600);
          btnFlag = true;
          return;
        }
        if (succAnswerNumber === randomNum) {  //随机出现的下一次点击消失
          $('.p2-jump-bai').hide();
        }

        showSuccAnswer(nowAnswerNumber); //展示正确答案
        if (checkAnswer(nowClickAnswer, nowAnswerNumber)){//答对
          if($('#icon-bgm').hasClass('tag-music-on')){
            aClickSucc.pause();
            aClickSucc.currentTime=0;
            aClickSucc.play();
          }
        }else{
          if($('#icon-bgm').hasClass('tag-music-on')){
            aClickError.pause();
            aClickError.currentTime=0;
            aClickError.play();
          }
        }
        setTimeout(function () {
          if (checkAnswer(nowClickAnswer, nowAnswerNumber)) { //答对
            showJumpAnimate(succAnswerNumber, comboNumber);
            totalScore += answerNumArr[comboNumber];  //答对积分累加
            if (succAnswerNumber === randomNum-1) {   //添加百度额外30加成
              totalScore += 30;
            }
            // console.log('succ', comboNumber);
            $('.p2-total-number').text(totalScore);
            succAnswerNumber++;
            comboNumber++;
            // console.log('succ2 ', comboNumber);
          } else {
            comboNumber = 0;  //答错连击从0开始
            // console.log('fail', comboNumber);
            $('.p2-jump-error').show();
            setTimeout(function () {
              $('.p2-jump-error').hide();
            }, 500);
          }

          clearActive();  //清空当前选中
          $('.p2-jump-people').addClass('p2-jump-animate');  //小人添加跳跃动画
          showTrainAnimate(nowAnswerNumber);  //火车动起来，展示下一题
          nowAnswerNumber++;   //题号+1

          if (nowAnswerNumber >= answerNumber) {   //答到最后一题
            app.timeCount = timeCount;    //获取计时
            // if (succAnswerNumber >= randomNum) {   //添加百度额外30加成
            //   totalScore += 30;
            // }
            app.totalScore = totalScore;   //获取当前总积分
            $('.p2-total-number').text(totalScore); //展示当前积分
            app.answerNumber = succAnswerNumber;    //获取答对题目数
            clearTimeout(timeCountFun);   //清空定时器
            window.wxshare.config({
              title: '我在抢票验证码大作战中，眼力值达到'+totalScore+'！',
              desc: '春运虐我千百遍，我待春运如初恋，不服来战！'
            });
            app.showPage(3);
            // console.log('app ', app);
            btnFlag = false;
          }
        }, 500);

        setTimeout(function () {
          $('.p2-jump-people').removeClass('p2-jump-animate');
          btnFlag = true;
        }, 1000);
      }
    })
  }

  /***
   * 展示当前题目的正确答案
   * @param nowAnswerNumber
   */
  function showSuccAnswer(nowAnswerNumber) {
    var nowSuccAnswerNums = succAnswerArr[nowAnswerNumber];
    var succAnswer = (nowSuccAnswerNums + '').split('');  //拆分答案
    // console.log('succAnswer', succAnswer);
    for (var i = 0; i < succAnswer.length; i++) {
      $('.p2-train-answer' + succAnswer[i] * 1).addClass('p2-train-succ-answer')
    }
  }

  /***
   * 遍历当前选中的选项，得到选择的答案
   */
  function getClickAnswer() {
    var clickAnswer = '';
    $('.p2-train-answer').each(function (i, item) {
      if ($(this).hasClass('p2-train-answer-active')) {
        var thisAnswer = $(this).data('id');
        clickAnswer += thisAnswer + ''
      }
    });
    // console.log(clickAnswer);
    return clickAnswer;
  }

  /***
   * 清空选中
   */
  function clearActive() {
    $('.p2-train-answer').each(function (i, item) {
      if ($(this).hasClass('p2-train-answer-active')) {
        $(this).removeClass('p2-train-answer-active');
      }
      if ($(this).hasClass('p2-train-succ-answer')) {
        $(this).removeClass('p2-train-succ-answer');
      }
    })
  }

  /***
   * 检查答案是否正确
   * @param a
   * @param answerI
   * @returns {boolean}
   */
  function checkAnswer(a, answerI) {
    if (succAnswerArr[answerI] == a) {
      return true;
    }
    return false;
  }

  /***
   * 答案正确后小人向前跳跃的动画
   * @param succAnswerNumber
   */
  function showJumpAnimate(succAnswerNumber, comboNumber) {
    $('.p2-jump-show').attr('src', 'img/jump_show' + (comboNumber + 1) + '.png?v=1').show();
    if (succAnswerNumber === randomNum - 1) {
      $('.p2-jump-bai').show();
      // console.log('succAnswerNumber random ', succAnswerNumber, randomNum);
    }
    setTimeout(function () {
      $('.p2-jump-show').hide();
    }, 500);
    $('.pa-jump-box-img').css({
      'transform': 'translateX(' + jumpAniArr[succAnswerNumber] + 'rem)',
      '-webkit-transform': 'translateX(' + jumpAniArr[succAnswerNumber] + 'rem)',
      'transition': 'all 0.5s linear'
    });
  }

  /***
   * 下一题火车移动动画
   * @param nowAnswerNumber
   */
  function showTrainAnimate(nowAnswerNumber) {
    $('.p2-train-img').css({
      'transform': 'translateX(' + trainAniArr[nowAnswerNumber] + 'rem)',
      '-webkit-transform': 'translateX(' + trainAniArr[nowAnswerNumber] + 'rem)',
      'transition': 'all 1s linear'
    });
  }

  /**
   * 计时器
   */
  function timedCount() {
    timeCount = timeCount + 1;
    timeCountFun = setTimeout(function () {
      timedCount();
    }, 1000);
  }

  function onLoad() {
    setTimeout(function () {
      page.isFlipReady = true;
      timedCount();
    }, 1000);
  }

  function onLeave() {
    page.isFlipReady = false;
    setTimeout(function () {
      btnFlag = true;
      $('.p2-train-img').css({
        'transform': 'translateX(-329rem)',
        '-webkit-transform': 'translateX(-329rem)',
        'transition': 'all 1s linear'
      });
      $('.p2-jump-show').attr('src', 'img/jump_show1.png?v=1').hide();
      $('.pa-jump-box-img').css({
        'transform': 'translateX(-2rem)',
        '-webkit-transform': 'translateX(-2rem)',
        'transition': 'all 0.5s linear'
      });
      answerNumber = 10;  //题目总数
      nowAnswerNumber = 0; //答到第几题
      succAnswerNumber = 0; //答对数目数
      totalScore = 0; //总积分
      timeCount = 0; //计时器
      comboNumber = 0; //连击数
      $('.p2-total-number').text(0);
    }, 500);
  }

  return page;
})();
