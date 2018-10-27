(function() {
  var ww = document.documentElement.clientWidth;
  var wh = document.documentElement.clientHeight;
  var fontSize;
  if(ww/wh<=0.6){
    fontSize = ww / 37.5;
  } else {
    fontSize = wh / 62.5;
  }


  fontSize = fontSize > 18 ? 18 : fontSize;

  document.documentElement.style.fontSize = fontSize + 'px';
})();
