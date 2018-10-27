app.pages[3] = (function() {
  
    var page = {
      init: init,
      onLoad: onLoad,
      onLeave: onLeave,
      dependingTask:'p3',
      isFlipReady: false,
      hasBranch: true,
    };
    var p3MySwiper = {};
    function init() {
      initEvents();
      //中间是我加的代码
      getImg(116,74,"Card-1");
      getImg(200,90,"Card-2");
      getImg(300,90,"Card-3");
      getImg(400,90,"Card-4");
      //中间是我加的代码
    }
  
    
    //中间是我加的代码
    var n = 0;
    var interval1;
    var interval2;
    var interval3;
    var interval4;
    var imgArray = [];
    function newImage(sum,folder){
      var img = new Image();
      img.src = app.root0+"public/static/img/"+folder+"/Card-"+sum+".png?v=1";
      sum++;
      img.onload=function(){
        imgArray.push(img); 
        console.log(imgArray.length);
        if(imgArray.length >= 344){
          controlDraw1();
        }
      }
    }
    function getImg(beginnum,imgnnum,folder){
      var sum = beginnum;
      for(var i=0;i < imgnnum;i++){
        newImage(sum,folder);
        sum++;
      }
    }
    function controlDraw1(){
      if(!(interval2 == "undefined")){
        clearInterval(interval2);
      }
      if(!(interval3 == "undefined")){
        clearInterval(interval3);
      }
      if(!(interval4 == "undefined")){
        clearInterval(interval4);
      }
      interval1 = setInterval(function(){
        if(n >=74){
          n = 0;
        }
        var c=document.getElementById("myCanvas1");
        var ctx=c.getContext("2d");
        ctx.drawImage(imgArray[n],0,0,imgArray[n].width,imgArray[n].height,0,0,c.width,c.height);
        n++;
      },20); 
    }
    function controlDraw2(){
      if(!(interval1 == "undefined")){
        clearInterval(interval1);
      }
      if(!(interval3 == "undefined")){
        clearInterval(interval3);
      }
      if(!(interval4 == "undefined")){
        clearInterval(interval4);
      }
      interval2 = setInterval(function(){
        if(n >=90){
          n = 0;
        }
        var c=document.getElementById("myCanvas2");
        var ctx=c.getContext("2d");
        ctx.drawImage(imgArray[74+n],0,0,imgArray[n].width,imgArray[n].height,0,0,c.width,c.height);
        n++;
      },20); 
    }
    function controlDraw3(){
      if(!(interval2 == "undefined")){
        clearInterval(interval2);
      }
      if(!(interval1 == "undefined")){
        clearInterval(interval1);
      }
      if(!(interval4 == "undefined")){
        clearInterval(interval4);
      }
      interval3 = setInterval(function(){
        if(n >=90){
          n = 0;
        }
        var c=document.getElementById("myCanvas3");
        var ctx=c.getContext("2d");
        ctx.clearRect(0,0,c.width,c.height);
        ctx.drawImage(imgArray[164+n],0,0,imgArray[n].width,imgArray[n].height,0,0,c.width,c.height);
        n++;
      },20); 
    }
    function controlDraw4(){
      if(!(interval2 == "undefined")){
        clearInterval(interval2);
      }
      if(!(interval3 == "undefined")){
        clearInterval(interval3);
      }
      if(!(interval1 == "undefined")){
        clearInterval(interval1);
      }
      interval4 = setInterval(function(){
        if(n >=90){
          n = 0;
        }
        var c=document.getElementById("myCanvas4");
        var ctx=c.getContext("2d");
        ctx.drawImage(imgArray[254+n],0,0,imgArray[n].width,imgArray[n].height,0,0,c.width,c.height);
        n++;
      },20); 
    }
  //中间是我加的代码
  
  
    function initEvents() {
      //下一步
      $('.p3-btn-next').on('click',function () {
        var activeImgId = $('.p3-swiper').find('.swiper-slide-active').attr('data-id');
        console.log('activeImgId ',activeImgId);
        if(activeImgId){
          alert('选择的图ID：'+activeImgId);
          // ajaxSetImg(activeImgId);
          app.cardImgId = activeImgId;
          app.showPage(4);
        }
      });
  
    }
  
    function ajaxSetImg(activeImgId) {
      $.ajax({
        url:app.p3url,
        type:'POST',
        dataType:'jsonp',
        data:{
          id:activeImgId
        },
        beforeSend:function(xhr,settings){
  //发送请求前
          console.log('beforeSend',xhr,settings);
        },
        success:function(data,status,xhr){
  //请求成功
          console.log('success',data,status,xhr);
        },
        error:function(xhr,errorType,error){
  //请求失败
          console.log('error',xhr,errorType,error);
        },
        complete:function(xhr,status){
  
          console.log('complete',xhr,status);
        }
      });
    }
  
    function onLoad() {
      setTimeout(function(){
        page.isFlipReady = true;
      },1000);
      p3MySwiper = new Swiper('.p3-swiper', {
        nextButton: '.p3-swiper-next-btn',
        prevButton: '.p3-swiper-prev-btn',
        onSlideChangeEnd: function(swiper){
          switch(swiper.activeIndex){
            case 0 :
            controlDraw1();
            break;
            case 1 :
            controlDraw2();
            break;
            case 2 :
            controlDraw3();
            break;
            case 3 :
            controlDraw4();
            break;
            default:
            controlDraw1();
          }
        }
        // navigation: {
        //   nextEl: '.p3-swiper-next-btn',
        //   prevEl: '.p3-swiper-prev-btn',
        // },
      })
    }
  
    function onLeave() {
      page.isFlipReady = false;
    }
  
    return page;
  })();
  