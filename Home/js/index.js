var URL = './';

(function () {
  imgBackground = new Image(); //每次加载完都会绘制一次图片
  imgBackground.src = 'img/bg.jpg';
  imgBackground.onload = function () { //背景图片加载完场
    init();
  };
})();

function init() {
  document.getElementById('showBox').style.display='block';
  document.getElementById('loadingImgBox').style.display='none';
  let dom = document.getElementsByClassName('title');
  for (let i = 0; i < dom.length; i++) {
    let jumpName = dom[i].dataset.name;
    dom[i].addEventListener('click',function () {
      window.location.href=URL+jumpName;
    });
  }
}