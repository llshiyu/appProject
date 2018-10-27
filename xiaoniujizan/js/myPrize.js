/***
 * 我的奖品页
 */

$(function () {
  init();
});

function init() {
  initEvent();

  //点击任何地方都隐藏指定弹窗，点自己除外
  hideDialog('prizesIntroduction'); //奖品介绍-弹窗
}

/***
 * 事件触发
 */
function initEvent() {
  //点击任何地方input框失去焦点，自身除外
  blurInput();

  //奖品介绍-弹窗
  $('.btn-prizesIntroduction').on('click', function () {
    app.showDialog('prizesIntroduction');
    ModalHelper.afterOpen();
    $('body').css('overflow', 'hidden');
  });
  $('.d-prizesIntroduction-btn').on('click', function () {
    app.closeDialog('prizesIntroduction');
    ModalHelper.beforeClose();
    $('body').css('overflow', 'auto');
  });

  //去首页
  $('.go-index').on('click', function () {
    //返回首页
    window.location = 'index.html';
  });

  //去个人信息页
  $('.go-person').on('click', function () {
    window.location = 'person.html';
  });

  //点击复制按钮
  $('.click-copy').on('click', function () {
    let codeInput = $(this).prev('input.p4-media-input');

    codeInput.select();
    let codeInputVal = codeInput.val();
    let clipboard = new Clipboard('.click-copy', {
      text: function () {
        return codeInputVal;
      }
    });

    clipboard.on('success', function (e) {
      // console.log('success ',e);
      $('.tip-infor').text("已复制好，可贴粘。");
      showToast();
    });

    clipboard.on('error', function (e) {
      // console.log('error ',e);
      $('.tip-infor').text("error!");
      showToast();
    });

  });

}