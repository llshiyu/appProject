app.pages[3] = (function() {

  var page = {
    init: init,
    onLoad: onLoad,
    onLeave: onLeave,
    dependingTask:'p3',
    isFlipReady: false,
    hasBranch: true,
  };
  var obj = {}
  var num = 1;
  function init() {
    initEvents();
  }

  function initEvents() {
    $(".click-btn-onceagain").on("click",function(){
      app.showPage(2);
    });
    $(".click-btn-share").on("click",function(){
      app.showDialog('share');
    });
  }
  function getTitle(){
    obj['timeCount'] = app.timeCount;
    obj['totalScore'] = app.totalScore;
    if(0 <= app.answerNumber && app.answerNumber <= 2){
      // $(".text-beat").text("10%");
      // $(".text-second").text(app.timeCount);
      num = 1;
      $(".p3 .content").css("background","url(img/p3_cont_1.png?v=1) no-repeat center center");
      $(".p3 .content").css("background-size","100% 100%");
      $(".text-score").text(app.totalScore);
      obj['beat'] = "10%";
      obj['trueNum'] = calculate(app.answerNumber);
      $(".text-true").text(calculate(app.answerNumber));
    }
    if(3 <= app.answerNumber && app.answerNumber <= 4){
      // $(".text-beat").text("50%");
      // $(".text-second").text(app.timeCount);
      num = 2;
      $(".p3 .content").css("background","url(img/p3_cont_2.png?v=1) no-repeat center center");
      $(".p3 .content").css("background-size","100% 100%");
      $(".text-score").text(app.totalScore);
      obj['beat'] = "50%";
      obj['trueNum'] = calculate(app.answerNumber);
      $(".text-true").text(calculate(app.answerNumber));
    }
    if(5 <= app.answerNumber && app.answerNumber <= 6){
      // $(".text-beat").text("70%");
      // $(".text-second").text(app.timeCount);
      num = 3;
      $(".p3 .content").css("background","url(img/p3_cont_3.png?v=1) no-repeat center center");
      $(".p3 .content").css("background-size","100% 100%");
      $(".text-score").text(app.totalScore);
      obj['beat'] = "70%";
      obj['trueNum'] = calculate(app.answerNumber);
      $(".text-true").text(calculate(app.answerNumber));
    }
    if(7 <= app.answerNumber && app.answerNumber <= 9){
      // $(".text-beat").text("90%");
      // $(".text-second").text(app.timeCount);
      num = 4;
      $(".p3 .content").css("background","url(img/p3_cont_4.png?v=1) no-repeat center center");
      $(".p3 .content").css("background-size","100% 100%");
      $(".text-score").text(app.totalScore);
      obj['beat'] = "90%";
      obj['trueNum'] = calculate(app.answerNumber);
      $(".text-true").text(calculate(app.answerNumber));
    }
    if(app.answerNumber == 10){
      // $(".text-beat").text("98%");
      // $(".text-second").text(app.timeCount);
      num = 5;
      $(".p3 .content").css("background","url(img/p3_cont_5.png?v=1) no-repeat center center");
      $(".p3 .content").css("background-size","100% 100%");
      $(".text-score").text(app.totalScore);
      obj['beat'] = "98%";
      obj['trueNum'] = calculate(app.answerNumber);
      $(".text-true").text(calculate(app.answerNumber));
    }
  }
  function calculate(answerNumber){
    return Math.round(answerNumber/10*100)+"%";
  }
  function drawImgByCanvas(){
    //文字的位置
    // var fontSize = $(".text-beat").css("font-size").split("p")[0] - 0;
    // var x1 = $(".text-beat").css("left").split("p")[0] - 0;
    // var y1 = $(".text-beat").css("top").split("p")[0] - 0 + 16;
    // var x2 = $(".text-second").css("left").split("p")[0] - 0;
    // var y2 = $(".text-second").css("top").split("p")[0] - 0 + 16;
    var x3 = $(".text-true").css("left").split("p")[0] - 0;
    var y3 = $(".text-true").css("top").split("p")[0] - 0 + 16;
    var x4 = $(".text-score").css("left").split("p")[0] - 0;
    var y4 = $(".text-score").css("top").split("p")[0] - 0 + 16;
    //车票的位置及宽高度
    var left = $(".p3-box-ticket").css("left").split("p")[0] - 0;
    var top = $(".p3-box-ticket").css("top").split("p")[0] - 0;
    var width = $(".p3-ticket-img").css("width").split("p")[0] - 0;
    var height = $(".p3-ticket-img").css("height").split("p")[0] - 0;
    var cwidth = $(".p3 .content").css("width").split("p")[0] - 0;
    var cheight = $(".p3 .content").css("height").split("p")[0] - 0;
    var canvas=document.getElementById("p3-canvas");
    canvas.width = cwidth;
    canvas.height = cheight;
    var ctx=canvas.getContext("2d");
    var img1=new Image();
    img1.src="img/p3_cont_"+num+".png?v=4";
    img1.onload=function(){
      ctx.drawImage(img1,0,0,cwidth,cheight);
    }
    var img=new Image();
    img.src="img/ticket.png?v=4";
    img.onload=function(){
      ctx.drawImage(img,left,top,width,height);
      ctx.font = 'bold 16px Arial'; //文字大小及字体
      // ctx.fillText(obj.beat,x1,y1);
      // ctx.fillText(obj.timeCount,x2,y2);
      ctx.fillText(obj.trueNum,x3,y3);
      ctx.fillText(obj.totalScore,x4,y4);
      $(".img-layer").attr("src",canvas.toDataURL('image/png'));
    }
    // var img=document.getElementsByClassName("p3-ticket-img")[0];
    
  }
  function onLoad() {
    getTitle();
    $(".p3-ticket-img").addClass("ticket-show");
    setTimeout(function(){
      drawImgByCanvas();
    },1000);
    setTimeout(function(){
      page.isFlipReady = true;
    },1000);
  }

  function onLeave() {
    $(".p3-ticket-img").removeClass("ticket-show");
    page.isFlipReady = false;
  }

  return page;
})();
