app.pages[6] = (function() {

  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask: 'p6',
    isFlipReady: false,
    hasBranch: true,
  };
  var sw = $(window).width();
  var sh = $(window).height();
  var $scene = $('#p6-scene');
  var scene = document.getElementById('p6-scene');
  var sceneWidth = sh * 1885 / 1250;
  // console.log('sceneWidth', sceneWidth);
  var parallax = null;

  function initParallax() {
    $scene.css({
      'margin-left': -(sceneWidth - sw) / 2,
      width: sceneWidth
    })
    parallax = new Parallax(scene, {
      pointerEvents: true
    });
    parallax.calibrate(false, false);
    parallax.invert(false, false);
    parallax.limit((-sw / 2 + sceneWidth / 2), 0);
    parallax.scalar((-sw / 2 + sceneWidth / 2) / 10, 0);
    parallax.origin(0.5, 0.5);
    parallax.friction(0.05, 0.1);
    parallax.updateLayers();
    parallax.disable();


  }

  function init() {
    initParallax();
    initEvents();
  }

  function initEvents() {
    $('.p6 .dialog').click(function() {
      $(this).fadeOut(500);
      // console.log('click');
    });
    $('.p6 .btn-circle').click(function() {
      var id = $(this).data('id');
      // console.log('this', id);
      if (id == 2) {
        app.showPage(7);
      } else {
        $('.p6-dialog' + id).fadeIn(300);
      }
    });

  }

  function onLoad() {
    parallax.enable();
    setTimeout(function() {
      page.isFlipReady = true;
    }, 1000);
    setTimeout(function(){
      $('.p6-hint').fadeOut(500);
    },4000);
  }

  function onLeave() {
    parallax.disable();
    page.isFlipReady = false;
  }

  return page;
})();