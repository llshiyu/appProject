app.pages[8] = (function() {
  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask: 'p8',
    isFlipReady: false, //标志页面是否可以翻页, 当页面所有动画运行完之后设置为true,离开页面后再重置为false
    hasBranch: false, //标志页面内是否有分支,默认为false,
    imgCropper1: null
  };
  var isFlag=false;
  var shareId = app.shareId;
  var addP11DomFlag = true;

  $('.p8-img-input').prop('capture', 'camera');
  $('.p8-friend').addClass('p8-hint-active');

  function init() {
    initEvents();
  }

  function initEvents() {

    $('.p8-img-input').change(function() {
      isFlag=true;
    });

    $('.p8-upload-btn').click(function() {
      isFlag=false;
      page.imgCropper1.clearCanvas();
      $('.p8-img-input').trigger('click');
    });

    $('.p8-ok-btn').click(function() {
      if (!isFlag) {
        // alert('请拍照');
        toastError('请拍照');
        return;
      }
      page.imgCropper1.crop();
      var imgBase = LrzUtil.toDataURL($('.p8-photo-box canvas')[0]);
      var sendData = {
        share_id: app.shareId,
        pic: imgBase
      };


      // ajaxCheckImg(sendData);
      app.showPage(9);


    });
  }

  function onLoad() {
    if (page.imgCropper1) {} else {
      //Picture drag
      page.imgCropper1 = new ImgCropper({
        $container: $(".p8-photo-box"),
        $containerWidth: $(".p8-photo-box").width(),
        $containerHeight: $(".p8-photo-box").height(),
        $input: $('.p8-img-input'),
        $touchElement: $('.p8'),
        canvasHeight: 700,
      });
    }
    $('.p8-img-input').trigger('click');

    setTimeout(function() {
      page.isFlipReady = true;
      // $('.p8-img-input').trigger('click');
    }, 1000);
  }

  function onLeave() {
    page.isFlipReady = false;
  }

  // 验证图片
  function ajaxCheckImg(sendData) {
    $.ajax({
      url: app.root0 + 'home/index/matchFace',
      type: 'POST',
      dataType: 'json',
      //timeout: 10000,
      data: sendData,
      // 发送请求前
      beforeSend: function(xhr, settings) {
        $('.d-loading').show(); //显示菊花
        // $('.p8-btn-box').hide();
        console.log('beforeSend', xhr, settings);
      },
      // 请求成功
      success: function(res, status, xhr) {
        console.log('success ',res);
        // alert(res.msg);
        if (res.code === 0) {
          console.log(res.msg);
          app.showCard = res.data.pic_url;
          $('#showCardImg').attr('src',app.showCard);
          $('#showCardCoverImg').attr('src','public/static/img/p3-content'+app.tplId+'.png?v=1');
          $('#saveCardImg').attr('src',res.data.pic_url_with_qrcode);

          if(addP11DomFlag){
            addP11DomFlag = false;
            app.p11MySwiper.appendSlide('<div class="swiper-slide">' +
              '              <div class="slick-img-box">' +
              '                <img src="'+res.data.pic_url+'" alt="">' +
              '              </div>' +
              '            </div>');
          }


          app.showPage(9);
          // alert(app.showCard);
        }else if(res.code == 111111){
          app.showPage(10);
        } else {
          toastError(res.msg);
          console.log(res.msg);
        }
      },
      error: function(xhr, errorType, error) {
        // $('.p8-btn-box').show();
        // 请求失败
        // alert('error');
        toastError('网络异常，请稍后再试');

        // console.log('error');
      },
      complete: function(xhr, status) {
        // $('.p8-btn-box').show();
        // 请求成功或失败都执行
        $('.d-loading').hide(); //关闭菊花
        // console.log('complete');
      }
    });
  }

  return page;
})();