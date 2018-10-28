var URL = '../';

(function () {
  imgBackground = new Image(); //每次加载完都会绘制一次图片
  imgBackground.src = 'img/bg.jpg';
  imgBackground.onload = function () { //背景图片加载完场
    init();
  };
})();

$(function () {
  let cont = $("#goBack");
  let contW = $("#goBack").width();
  let contH = $("#goBack").height();
  let startX, startY, sX, sY, moveX, moveY,leftX,rightX,topY,bottomY;
  let winW = $(window).width();
  let winH = $(window).height();

  cont.on({//绑定事件
    touchstart: function (e) {
      startX = e.originalEvent.targetTouches[0].pageX;	//获取点击点的X坐标
      startY = e.originalEvent.targetTouches[0].pageY;    //获取点击点的Y坐标
      console.log("startX="+startX+"************startY="+startY);
      sX = $(this).offset().left;//相对于当前窗口X轴的偏移量
      sY = $(this).offset().top;//相对于当前窗口Y轴的偏移量
      console.log("sX="+sX+"***************sY="+sY);
      leftX = startX - sX;//鼠标所能移动的最左端是当前鼠标距div左边距的位置
      rightX = winW - contW + leftX;//鼠标所能移动的最右端是当前窗口距离减去鼠标距div最右端位置
      topY = startY - sY;//鼠标所能移动最上端是当前鼠标距div上边距的位置
      bottomY = winH - contH + topY;//鼠标所能移动最下端是当前窗口距离减去鼠标距div最下端位置
    },
    touchmove: function (e) {
      e.preventDefault();
      moveX = e.originalEvent.targetTouches[0].pageX;//移动过程中X轴的坐标
      moveY = e.originalEvent.targetTouches[0].pageY;//移动过程中Y轴的坐标
      console.log("moveX="+moveX+"************moveY="+moveY);
      if (moveX < leftX) {
        moveX = leftX;
      }
      if (moveX > rightX) {
        moveX = rightX;
      }
      if (moveY < topY) {
        moveY = topY;
      }
      if (moveY > bottomY) {
        moveY = bottomY;
      }
      $(this).css({
        // "left": (moveX + sX - startX)+'rem',
        "top": moveY + sY - startY,
      })
    },
  })
});

function init() {
  document.getElementById('showBox').style.display = 'block';
  document.getElementById('loadingImgBox').style.display = 'none';
  let dom = document.getElementsByClassName('title');
  let rightBox = document.getElementById('rightBox');
  let iframeBox = document.getElementById('contIframe');
  let goBackDom = document.getElementById('goBack');
  for (let i = 0; i < dom.length; i++) {
    let jumpName = dom[i].dataset.name;
    dom[i].addEventListener('click', function (e) {
      rightBox.style.display = 'block';
      iframeBox.src = URL + jumpName;
      if(jumpName==='2048Game'){
        // rightBox.style.display = 'block';
        rightBox.style.background='#fff';
        // iframeBox.src = URL + jumpName;
        iframeBox.style.transform='scale(0.9,0.9)';
      }
      // else{
      //   window.location.href=URL+jumpName;
      // }
    }, false);
  }
  goBackDom.addEventListener('click',function (e) {
    rightBox.style.display = 'none';
    iframeBox.src = ''
  })
}
