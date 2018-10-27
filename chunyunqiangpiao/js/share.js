 $(function() {
   function getLink() {
     if (window.location.host.indexOf('dev.benbun.com') >= 0) {
       return 'http://dev.benbun.com/web/demo/ocean/demo_mobile/';
     } else {
       return 'http://w.benbun.com/demo/ocean/demo_mobile/';
     }
   }
   var link = getLink();
   if (/MicroMessenger/i.test(navigator.userAgent)) {
     $.when($.getScript("http://res.wx.qq.com/open/js/jweixin-1.0.0.js"), $.getScript("js/wxshare.min.js"))
       .done(function() {
         window.wxshare.config({
           title: '哭屁了',
           desc: '这个效果哭屁了，下个项目就得用',
           link: link,
           imgUrl: link + 'img/share.jpg',
           onSuccess: function() {

           }
         });
       });
   }
 });
