app.pages[4] = (function() {

  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask: 'p4',
    isFlipReady: false,
    hasBranch: true,
  };
  var p4MySwiper = {};
  var isAjax = true; //是否需要提交ajax

  //轮播的四份文案
  var dataList = ['时光是个贼，偷走了青春，偷不走我们的友谊。',
    'A cheery Christmas hold lots of happiness for you! 给你特别的祝福，愿圣诞带给你无边的幸福。',
    '圣诞不重要，重要的是，我想你了。',
    '这个冬天，只要一想到你，心里就暖洋洋的。'
  ];


  function init() {
    initEvents();
  }

  function checkInput(obj) {
    var checkFlag = true;
    var reg2 = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;
    if (!obj) {
      toastError('请输入祝福语');
      checkFlag = false;
    } else if (obj.length < 2 || obj.length > 75) {
      toastError('祝福语长度范围为2-75字');
      checkFlag = false;
    } else if (reg2.exec(obj)) {
      toastError('请去掉表情或特殊符号');
      checkFlag = false;
    }
    // console.log('字符长度：',obj.length);

    return checkFlag;
  }

  function initEvents() {
    //监听左右切换按钮
    $('.p4-swiper-btn').on('click', function() {
      //按钮切换 内容复位
      var thisIndex = p4MySwiper.realIndex;
      $('.p4-swiper').find('.swiper-slide-active').find('.slick-txt-box').empty().val(dataList[thisIndex]);
      isAjax = true;
    });



    //选择是手动编写还是选择模板
    $('.p4-btn-mail-box').on('click', function() {
      isAjax = true;
      // $(this).removeClass('p4-btn-mail-btn-own').addClass('p4-btn-mail-btn-select');
      if ($(this).hasClass('p4-btn-mail-btn-own')) {
        $(this).removeClass('p4-btn-mail-btn-own').addClass('p4-btn-mail-btn-select');
        $('.p4-textarea-box').find('textarea').val('');
        $('.p4-textarea-box').show();
        $('.p4-swiper').hide();
      } else {
        $(this).addClass('p4-btn-mail-btn-own').removeClass('p4-btn-mail-btn-select');
        $('.p4-textarea-box').hide();
        $('.p4-swiper').show();
      }
    });



    //下一步
    $('.p4-btn-next').on('click', function() {
      var nextFlag = false;
      if (!$('.p4-btn-mail-box').hasClass('p4-btn-mail-btn-own')) {
        var writeTextVal = $("textarea[name='p4_blessings']").val();
        if (!checkInput(writeTextVal)) {
          nextFlag = false;
          // toastError('请填写祝福语');
        } else {
          nextFlag = true;
          app.userBlessings = writeTextVal;
        }
      } else {
        var activeTextId = $('.p4-swiper').find('.swiper-slide-active').attr('data-id');
        var activeTextVal = $('.p4-swiper').find('.swiper-slide-active').find('.slick-txt-box').val();

        if (!checkInput(activeTextVal)) {
          nextFlag = false;
          // toastError('祝福语不能为空');
        } else {
          nextFlag = true;
          app.userBlessings = activeTextVal;
        }
      }
      if (app.shareId) {
        isAjax = false;
      }

      if (nextFlag) {
        app.nickName = $('.p4-name-bottom').val();
        // ajaxCreateACard();
        app.showPage(5);

      }
    });
  }

  function ajaxCreateACard() {
    $.ajax({
      url: app.root0 + 'home/index/makeGreetingCard',
      type: 'POST',
      dataType: 'jsonp',
      data: {
        name: app.username, //收件人昵称
        pic_url: app.userImg, //收件人照片
        tpl_id: app.tplId, //收件人卡片的模板
        bless_word: app.userBlessings, //卡片上的祝福语
        nickname: $('.p4-name-bottom').val() //卡片上发件人名字
      },
      beforeSend: function(xhr, settings) {
        //发送请求前
        $('.d-loading').show(); //显示菊花
        console.log('beforeSend', xhr, settings);
      },
      success: function(data, status, xhr) {
        //请求成功
        if (data.code == 0) {
          console.log(data);
          $('.p5 .p5-card-my-name').text($('.p4-name-bottom').val());
          app.shareId = data.data.share_id;
          app.showCard = data.data.pic_url;

          $('.p5-card').css({'background':'url('+data.data.pic_url+') no-repeat center center','background-size':'100% 100%'})

          app.showPage(5);
          // console.log(app.link + 'public/static/img/share'+app.tplId+'.jpg?v=1');

          window.wxshare.config({
            imgUrl: app.link + 'public/static/img/share'+app.tplId+'.jpg?v=1'
          });
        } else {
          toastError(data.msg);
          console.log('success error ', data.msg);
        }
        console.log('success', data, status, xhr);
      },
      error: function(xhr, errorType, error) {
        //请求失败
        toastError('网络异常，请稍后再试');

        console.log('error', xhr, errorType, error);
      },
      complete: function(xhr, status) {
        $('.d-loading').hide(); //关闭菊花
        console.log('complete', xhr, status);
      }
    });
  }

  function onLoad() {
    setTimeout(function() {
      page.isFlipReady = true;
    }, 1000);
    $('.p4-btn-mail-box').addClass('p4-btn-mail-btn-own').removeClass('p4-btn-mail-btn-select');


    p4MySwiper = new Swiper('.p4-swiper', {
      nextButton: '.p4-swiper-next-btn',
      prevButton: '.p4-swiper-prev-btn'
      // onSlideChangeStart: function (item){
      //   // console.log('kaishi',item.activeIndex);
      //   var index = item.activeIndex;
      //   var str = '<textarea class="slick-txt-box" rows="4" maxlength="70">';
      //   str += dataList[index];
      //   str += '</textarea>';
      //   $('.swiper-slide-active').append(str);

      // },
      // onSlideChangeEnd: function (item){
      //   // console.log(item.activeIndex);
      //   // var index = item.activeIndex;
      //   $('.swiper-slide').not('.swiper-slide-active').empty();
      //   // var str = '<textarea class="slick-txt-box" rows="4" cols="20" maxlength="60">';
      //   // str += dataList[index];
      //   // str += '</textarea>';
      //   // $('.swiper-slide-active').append(str);
      // }
    });




    var sendMailName = app.nickName;
    $('.p4-name-bottom').val(sendMailName.substring(0, 8));

  }

  function onLeave() {
    page.isFlipReady = false;
  }

  return page;
})();