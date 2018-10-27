window.onload = function () {
  app.bgm && app.bgm.init();
  $('.p0').hide();
  $('.p1').show();
};
$(function () {
  window.addEventListener("load", getVideoEvent);

  var mySwiper = {};
  //视频导图的文字动画
  var pzInter = setInterval(function () {
    $('.video-text-img').attr('src', 'img/video-text.gif');
  }, 3000);
  //点击按钮开始视频
  $('.video-btn-box').click(function () {
    clearInterval(pzInter);
    $('.video-img-box').hide();
    $('#pzVideo').show();
    var video = document.getElementById("pzVideo");
    video.play();
  });

  function getVideoEvent() {
    var videoes = document.getElementsByTagName("video");
    for (var i = 0; i < videoes.length; i++) {
      showEventLog("video" + (i + 1), videoes[i]);
    }
  }

  function showEventLog(videoNum, Media) {
    eventTester = function (e) {
      Media.addEventListener(e, function () {
        console.log(videoNum + ":" + e);
        if (e == 'ended') {
          $('.p1').fadeOut(300);
          $('.p2').fadeIn(300);
          setTimeout(function () {
            swiperImgs();
          }, 500);
        }
      });
    };
    eventTester("ended");    //播放结束
  }

  function swiperImgs() {
    mySwiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      paginationType: 'progress',
      loop: false,
      autoplay: 2500, //自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换
      // autoplayDisableOnInteraction: false, //用户操作swiper之后，是否禁止autoplay。默认为true：停止。
      onReachEnd: function (swiper) {
        mySwiper.stopAutoplay();
        $(".last-slick").swipe({
          swipeLeft: function (event, direction, distance, duration, fingerCount) {
            $('.p2').fadeOut(300);
            $('.p3').fadeIn(300);
          }
        });
      },
    });
  }

  $(".p3").swipe({
    swipeRight: function (event, direction, distance, duration, fingerCount) {
      $('.p3').fadeOut(300);
      $('.p2').fadeIn(300);
      mySwiper.slideTo(11, 2500, false);
    }
  });
});

