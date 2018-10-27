app.pages[2] = (function () {
  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask: 'p2',
    isFlipReady: false, //标志页面是否可以翻页, 当页面所有动画运行完之后设置为true,离开页面后再重置为false
    hasBranch: false, //标志页面内是否有分支,默认为false,
    imgCropper1: null
  };
  var isFlag = false;
  var isAjax = true;  //是否需要提交图片ajax

  function init() {
    initEvents();
  }

  function checkInput(obj){
    var checkFlag = true;
    var reg2 = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;
    if (!obj) {
      toastError('请输入昵称');
      checkFlag = false;
    }else if(obj.trim().length < 1 || obj.trim().length > 6){
      toastError('昵称长度范围为1-6字');
      checkFlag = false;
    }else if (reg2.exec(obj)) {
      toastError('请去掉表情或特殊符号');
      checkFlag = false;
    }
    return checkFlag;
  }

  function initEvents() {

    $('.p2-upload-btn').click(function () {
      $('.p2-img-input').trigger('click');
    });

    //上传照片--file变化时
    $("input[name='p2_img_file']").on('change', function (e) {
      var file = e.target.files[0];
      console.log(file);
      isFlag = true;
      isAjax = true;
      if($('.p2-photo-succ').hasClass('hide')){
        $('.p2-photo-succ').removeClass('hide');
        // $('.p2-photo-box').css('background-image','none');
         
      }
      // $('.p2-photo-box').addClass('p2-photo-active');
    });


    $('.p2-ok-btn').click(function () {
      var username = $("input[name='username']").val();
      if (!isFlag) {
        toastError('请上传照片');
        return;
      }

      if(!checkInput(username)){
        return;
      }

      page.imgCropper1.crop();
      var imgBase = LrzUtil.toDataURL($('.p2-photo-box canvas')[0]);

      var str=imgBase.substring(22);
      var equalIndex= str.indexOf('=');
      if(str.indexOf('=')>0)
      {
        str=str.substring(0, equalIndex);
      }
      var strLength=str.length;
      var fileLength=parseInt(strLength-(strLength/8)*2);
      console.log(fileLength);

      if(fileLength>2*1024*1024){
        toastError('上传的图片的大于2M,请重新选择');
        $(this).val('');
        return ;
      }

      var sendData = {
        original_pic: imgBase
      };
      app.username = username;
      $('.p4-name-top span').text(username);

      // console.log(imgBase);
      if($('.p2-photo-succ').hasClass('hide')){
        
      }

      if(isAjax){
        // ajaxSendImg(sendData);
        app.showPage(3);

      }else{
        // app.showPage(3);
      }

    });
  }

  function onLoad() {

    $('.p1-content-img').removeClass('p1-content-img-animate');
    if (page.imgCropper1) {
    } else {
      //Picture drag
      page.imgCropper1 = new ImgCropper({
        $container: $(".p2-photo-box"),
        $containerWidth: $(".p2-photo-box").width(),
        $containerHeight: $(".p2-photo-box").height(),
        $input: $('.p2-img-input'),
        $touchElement: $('.p2'),
        canvasHeight: 700,
      });
    }

    setTimeout(function () {
      page.isFlipReady = true;
    }, 1000);

  }

  function onLeave() {
    $('.p2-input').val('');
    $("input[name='p2_img_file']").val();
    page.imgCropper1.clearCanvas();
    //background: url(../img/p2_phone_cont.png?v=1) no-repeat center center;
    // background-size: 100% 100%;
    // $('.p2-photo-box').css('background','url(public/static/img/p2_phone_cont.png?v=1) no-repeat center center');
    //
    // $('.p2-photo-box').css('background-size','100% 100%');
    $('.p2-photo-succ').addClass('hide');
    page.isFlipReady = false;
  }

  // 提交图片
  function ajaxSendImg(sendData) {
    $.ajax({
      url: app.root0 + 'home/index/checkImg',
      type: 'POST',
      dataType: 'json',
      //timeout: 10000,
      data: {
        pic:sendData.original_pic
      },
      // 发送请求前
      beforeSend: function (xhr, settings) {
        $('.d-loading').show(); //显示菊花
        isAjax = false;
        // console.log('beforeSend', xhr, settings);
      },
      // 请求成功
      success: function (res, status, xhr) {
        // console.log('success ',res);
        if (res.code === 0) {
          app.userImg = res.data.pic_url;
          $('.p2-photo-succ').removeClass('hide');
          setTimeout(function () {
            app.showPage(3);
          },300);
        } else {
          toastError(res.msg);
          // console.log('处理失败');
        }
      },
      error: function (xhr, errorType, error) {
        // 请求失败
        toastError('网络异常，请稍后再试');
        // console.log('error', xhr, errorType, error);

      },
      complete: function (xhr, status) {
        // 请求成功或失败都执行
        $('.d-loading').hide(); //关闭菊花
        isAjax = true;
        // console.log('complete');
      }
    });
  }

  return page;
})();