app.pages[5] = (function() {

  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask: 'p5',
    isFlipReady: false,
    hasBranch: true,
  };

  function init() {
    initEvents();
  }

  var btnFlag = false;
  var aniFlag = true;
  var inputFlag = true;

  function initEvents() {

    //分享给指定好友弹窗
    $('.p5-btn-friend').on('click', function() {
      if (!aniFlag) {
        app.showDialog('share');
        return;
      }
      aniFlag = false;
      $('.p5-envelope-in').addClass('p5-down-in');
      setTimeout(function() {
        $('.p5-card').addClass('p5-down-out');
      }, 2000);
      setTimeout(function() {
        $('.p5-card-img-box').fadeOut(300);
      }, 3500);
      setTimeout(function() {
        $('.p5-envelope20').addClass('p5-envelopt2-rotate');
        $('.p5-envelope3').addClass('p5-envelopt3-rotate');
      }, 4000);
      setTimeout(function() {
        app.showDialog('share');
      }, 6300);
      // app.shareTitle = '据说，这份祝福全世界只有一个人才能打开';
      // app.shareDesc = '刚好那个人是你';

      // app.shareDesc = '送TA一份只有TA能打开的圣诞祝福';
      // $('.d-share').show();
      // console.log(app.link + 'public/static/img/share'+app.tplId+'.jpg?v=1');

      window.wxshare.config({
        title: '据说，这份祝福全世界只有一个人能打开',
        desc: '刚好那个人是你',
        imgUrl: app.link + 'public/static/img/share'+app.tplId+'.jpg?v=1',
        link: app.link + '?share_id=' + app.shareId
      });
    });
    //分享到朋友圈弹窗
    $('.p5-btn-friend-circle').on('click', function() {
      $('.share-input-box').fadeIn(300);
      $("input[name='share_friend_desc']").val('');
      if (!aniFlag) {
        app.showDialog('share-friend2');
        return;
      }
      aniFlag = false;
      $('.p5-envelope-in').addClass('p5-down-in');
      setTimeout(function() {
        $('.p5-card').addClass('p5-down-out');
      }, 2000);
      setTimeout(function() {
        $('.p5-card-img-box').fadeOut(300);
      }, 3500);
      setTimeout(function() {
        $('.p5-envelope20').addClass('p5-envelopt2-rotate');
        $('.p5-envelope3').addClass('p5-envelopt3-rotate');
      }, 4000);
      setTimeout(function() {
        app.showDialog('share-friend2');
      }, 6300);

    });
    //分享文案点击确定
    $('.share-friend-input-btn').on('click', function(e) {
      e.stopPropagation();
      inputFlag = true;
      var shareInputVal = $("input[name='share_friend_desc']").val();
      var input_yz = /^[\u4e00-\u9fa5a-zA-Z0-9]{0,6}$/;
      if (shareInputVal.trim().length > 5) {
        inputFlag = false;
        toastError('只能输入5个字以内');
      } else if (!input_yz.exec(shareInputVal)) {
        toastError('请输入字母数字汉字');
        inputFlag = false;
      }
      if (!shareInputVal) {
        shareInputVal = '一个人';
      }
      var friendsDesc = '这份专属圣诞祝福，只有' + shareInputVal + '能打开，会是你吗？';
      window.wxshare.config({
        timelineText: friendsDesc,
        imgUrl: app.link + 'public/static/img/share'+app.tplId+'.jpg?v=1',
        link: app.link + '?share_id=' + app.shareId
      });
      if (inputFlag) {
        $('.share-input-box').fadeOut(300);
      }
    });
    $('.share-input-box').on('click', function(e) {
      e.stopPropagation();
      $("input[name='share_friend_desc']").focus()
    });
    $('.d-share-friend2').click(function() {
      $(this).fadeOut();
    })

  }

  function onLoad() {
    // app.shareTitle = '据说，这份祝福全世界只有一个人才能打开';
    // app.shareDesc = '刚好那个人是你';

    window.wxshare.config({
      title: '据说，这份祝福全世界只有一个人能打开',
      desc: '刚好那个人是你',
      timelineText: '这份专属圣诞祝福，只有一个人能打开，会是你吗？',
      imgUrl: app.link + 'public/static/img/share'+app.tplId+'.jpg?v=1',
      link: app.link + '?share_id=' + app.shareId
    });
    if (app.username) {
      $('.p5-card-friend-name').find('span').text(app.username);
    }
    if (app.userBlessings) {
      $('.p5-card-cont').text(app.userBlessings);
    }
    if (app.nickName) {
      $('.p5-card-my-name').text(app.nickName);
    }

    setTimeout(function() {
      // $('.p5-card-cover').css('background-image','url(public/static/img/p3-content'+app.tplId+'.png)');

      // $('.p5-card-cover').fadeIn(500);
      $('.p5-card-cover').show();
      if(app.tplId=='0'||!app.tplId){
        app.tplId=1;
      }
      // console.log('app.tplId',app.tplId);
      // console.log('app.sprite[app.tplId]',app.tplId,app.sprite[app.tplId]);
      app.sprite[app.tplId].resetEle($('.p5-cover-sprite')[0]);
      app.sprite[app.tplId].resume();
      app.sprite[app.tplId].play();


      page.isFlipReady = true;
    }, 1000);
    setTimeout(function() {
      $('.p5-card-cover').fadeOut(300);
      $('.p5-card-box').fadeIn(500);
      $('.p5-btn-box').fadeIn(500);
    }, 4000);
  }

  function onLeave() {
    page.isFlipReady = false;
    setTimeout(function() {
      aniFlag = true;
      $('.p5-card-cover').fadeOut(500);
      $('.p5-card-box').fadeOut(500);
      $('.p5-btn-box').fadeOut(500);
      $('.p5-envelope-in').removeClass('p5-down-in');
      $('.p5-card').removeClass('p5-down-out');
      $('.p5-card-img-box').fadeIn(300);
      $('.p5-envelope20').removeClass('p5-envelopt2-rotate');
      $('.p5-envelope3').removeClass('p5-envelopt3-rotate');
      $('.d-share-friend2').fadeOut(300);
      window.wxshare.config({
        title: '送给TA一份只有TA能打开的圣诞祝福',
        desc: '什么，居然还有这种操作？',
        timelineText: '送给TA一份只有TA能打开的圣诞祝福',
        link: app.link
      });
    }, 1000);
  }

  return page;
})();