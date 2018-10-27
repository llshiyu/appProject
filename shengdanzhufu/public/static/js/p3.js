app.pages[3] = (function() {

  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask: 'p3',
    isFlipReady: false,
    hasBranch: true,
  };
  var p3MySwiper = {};

  function initSlider() {

    p3MySwiper = new Swiper('.p3-swiper', {
      loop: true,
      initialSlide: 0,
      nextButton: '.p3-swiper-next-btn',
      prevButton: '.p3-swiper-prev-btn',
      onSlideChangeEnd: function(swiper) {
        // console.log('swiper.activeIndex', swiper.activeIndex);
        var index = swiper.activeIndex;
        var pre = swiper.previousIndex;
        index = index == 5 ? 1 : index;
        index = index == 0 ? 4 : index;
        pre = pre == 5 ? 1 : pre;
        pre = pre == 0 ? 0 : pre;
        // console.log('onSlideChangeEnd activeIndex',  swiper.activeIndex,index, sprite[index]);
        // console.log('onSlideChangeEnd previousIndex',  swiper.previousIndex,pre, sprite[pre]);
        if (app.sprite[index]) {
          app.sprite[index].resetEle($('.swiper-slide-active').find('img')[0]);
          app.sprite[index].play();
        }
        if (app.sprite[pre]) {
          app.sprite[pre].resume();
        }
      }
    });
  }

  function initEvents() {
    //下一步
    $('.p3-btn-next').on('click', function() {
      var activeImgId = $('.p3-swiper').find('.swiper-slide-active').attr('data-id');
      console.log('activeImgId ', activeImgId);
      if (activeImgId) {
        // alert('选择的图ID：'+activeImgId);
        // ajaxSetImg(activeImgId);
        app.tplId = activeImgId;
        app.showPage(4);
      }
    });

  }


  function init() {
    initSlider(); 
    initEvents();
  }



  function onLoad() {
    p3MySwiper.update();
    p3MySwiper.slideTo(1, 0);
    setTimeout(function() {
      app.sprite[1].resume();
    }, 2);
    setTimeout(function() {
      page.isFlipReady = true;
      app.sprite[1].play();
    }, 500);

  }

  function onLeave() {
    page.isFlipReady = false;
  }

  return page;
})();