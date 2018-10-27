app.bgm = (function() {
  var ROOT = app.root;
  var opt = {
    'hasIcon': 'true',
    'audio': '',
    'iOn': ROOT + 'img/music_on.png',
    'iOff': ROOT + 'img/music_off.png',
    'src': ROOT + 'media/bgm.mp3'
  };
  var data = {
    audio: null,
    init: init,
    change: change,
    play: playBgm,
    pause: pauseBgm
  };


  var $mIcon = $('<img id="icon-bgm">');

  function initIcon() {
    if (!opt.hasIcon) {
      opt.iOn = '';
      opt.iOff = '';
      return false;
    }
    $mIcon.css({
      'position': 'fixed',
      'right': '20px',
      'top': '20px',
      'width': '22px',
      'height': '22px',
      'z-index': '999'
    });
    $mIcon.on('click', function() {
      if (data.audio.paused) {
        playBgm();
      } else {
        pauseBgm();
      }
    });
    $mIcon.appendTo($('body'));
  }

  function playBgm() {
    data.audio.play();
    $mIcon[0].src = opt.iOn;
    $mIcon.removeClass('tag-music-off');
    $mIcon.addClass('tag-music-on');
  }

  function pauseBgm() {
    data.audio.pause();
    $mIcon[0].src = opt.iOff;
    $mIcon.removeClass('tag-music-on');
    $mIcon.addClass('tag-music-off');
  }

  function initAudio() {

    data.audio = opt.audio || new Audio();
    data.audio.volume = 1;
    data.audio.loop = true;
    data.audio.autoPlay = true;
    data.audio.src = opt.src;


    $('.p0,.p1,.dialog0').one("touchend", function() {
      if ($mIcon.hasClass('tag-music-on')) {
        playBgm();
      }
    });
    playBgm();
    
    document.addEventListener("WeixinJSBridgeReady", function () {  /*IOS音乐不会自动播放，需调微信接口*/
      playBgm();
    }, false);
  }

  function init(options) {
    opt = $.extend(opt, options);
    initIcon();
    initAudio();
  }

  function change(src) {
    var state = data.audio.paused;
    src = ROOT + src;
    pauseBgm();
    data.audio.src = src;
    if (!state) {
      playBgm();
    }
  }
  return data;

}());
