$(function() {
  var ajaxAddressIDFlag = true;

  function initEvent() {

    //选完地址后  确认提交
    $('.confirm-buy').click(function(e) {
      e.preventDefault();
      var id = $('.p6-active').data('id');
      ajaxAddressID(id, app.case_id);
    });

    $('.p6-content-list').on('click', 'li', function(e) {
      $(this).addClass('p6-active').siblings().removeClass('p6-active');
      e.preventDefault();
    });

    $('.buy-shop').on('click', function(e) {
      e.preventDefault();
      // ajaxBuyShop(app.case_id);
    });

    $('.p6-content-list').on('click', '.p6-list-right-address', function(e) {
      var latWx = $(this).parents('li').data('lat') * 1 - 0.00552;
      var lngWx = $(this).parents('li').data('lng') * 1 - 0.00618;
      var nameWx = $(this).parents('li').find('.p6-list-tit').text();
      var addressWx = $(this).parents('li').find('.p6-list-address').text();
      // console.log('latWx='+latWx+'lngWx='+lngWx+'nameWx='+nameWx+'addressWx='+addressWx);

      window.location.href = 'http://apis.map.qq.com/uri/v1/marker?marker=coord:' + latWx + ',' + lngWx + ';title:' + nameWx + ';addr:' + addressWx + '&coord_type=2&referer=myapp'
      // window.location.href='http://apis.map.qq.com/uri/v1/routeplan?type=drive&to="'+addressWx+'"&policy=1&referer=myapp'
      // wx.ready(function() {
      //   // wx.openLocation({
      //   //   latitude: latWx,
      //   //   longitude: lngWx,
      //   //   name: nameWx,
      //   //   address: '',
      //   //   scale: 28,
      //   //   infoUrl: 'http://weixin.qq.com' // 在查看位置界面底部显示的超链接,可点击跳转
      //   // });
      //   wx.openLocation({
      //     latitude: 27.9478400000,
      //     longitude: 109.6042100000,
      //     name: '崇德堂',
      //     address: '',
      //     scale: 28,
      //     infoUrl: 'http://weixin.qq.com' // 在查看位置界面底部显示的超链接,可点击跳转
      //   });
      // });


      e.preventDefault();
    });
  }


  function initDom() {
    app.activity_id = getUrlParam('activity_id');
    app.id = getUrlParam('id');
    app.case_id = getUrlParam('case_id');
  }


  // function initWx(){
  //   var me = this;
  //   if (me.success) return;
  //   if (me.running) return;
  //   me.running = true;
  //   var url = location.href.split('#')[0];
  //   url = encodeURIComponent(url);




  //   $.ajax({
  //     url: '//api.benbun.com/wechat/jssign/',
  //     data: {
  //       url: url
  //     },
  //     dataType: 'jsonp',
  //     success: function(rsp) {
  //       console.log('rsp',rsp);
  //       if (rsp.code != 0) {
  //         return;
  //       }
  //       if (!window.wx) return;
  //       var wx = window.wx;
  //       var debug = (window.location.search.indexOf('__wxdebug__=1') !== -1);
  //       var data = rsp.data;
  //       wx.config({
  //         debug: debug,
  //         appId: data.appId,
  //         timestamp: data.timestamp,
  //         nonceStr: data.nonceStr,
  //         signature: data.signature,
  //         jsApiList: [
  //           'openLocation',
  //         ]
  //       });

  //       me.success = true;
  //     },
  //     complete: function() {
  //       me.running = false;
  //     }
  //   });
  // }
  // 初始设置地址列表
  function ajaxAddressID(id, caseid) {
    if(!ajaxAddressIDFlag){
      return;
    }
    $.ajax({
      url: app.addressIDUrl,
      type: 'POST',
      data: {
        address_id: id,
        case_id: caseid
      },
      dataType: 'jsonp',

      beforeSend: function(xhr, settings) {
        // 发送请求前
        ajaxAddressIDFlag = false;
      },
      success: function(resp, status, xhr) {
        console.log('success', resp);
        if (resp.code === 0) {
          if (resp.data.data === 200) {
            ajaxAddressISuccessDom();
          }
          console.log('成功');
        } else {
          console.log('失败');
        }
      },
      error: function(xhr, errorType, error) {
        // 请求失败
        console.log('error', xhr);
      },
      complete: function(resp, xhr, status) {
        console.log('complete', resp);
        ajaxAddressIDFlag = true;
      }
    });
  }

  function init() {
    initEvent();
    initDom();
    // initWx();
  }
  init();
});


function ajaxAddressISuccessDom(){

            app.showDialog('confirmBuy');
            $('body').css('overflow', 'hidden');
}

// 页面上渲染列表
// function addAddress(data) {
//   $('.p6-content-list').empty();
//   // console.log('data', data);
//   var str = '';
//   for (var i = 0, datalength = data.length; i < datalength; i++) {
//     str = '';
//     str += '<li  data-lat="'+data[i].lat+'" data-lng="'+data[i].lng+'"><span class="p6-list-tit span-block">' + data[i].name + '</span>';
//     str += '<span class="span-block"><span class="p6-list-left">营业时间：</span>';
//     str += '<span class="p6-list-right">' + data[i].open_time_start + ' - ' + data[i].open_time_end + '</span></span>';
//     str += '<span class="span-block">';
//     str += '<span class="p6-list-left">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：</span>';
//     str += '<span class="p6-list-right p6-list-address"> ' + data[i].address + '</span></span>';
//     str += '<span class="span-block">';
//     str += '<span class="p6-list-left">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话：</span>';
//     str += '<span class="p6-list-right"> ' + data[i].rescue + '</span></span>';
//     str += '<span class="span-block p6-list-route">查看路线导航 &gt;</span></li>';
//     $('.p6-content-list').append(str);
//   }
//   $('.p6-content-list li').eq(0).addClass('p6-active');
// }



/**
 * 点击 确定认购 触发ajax
 * @param caseid
 */
function ajaxBuyShop(caseid) {
  $.ajax({
    url: app.buyUrl,
    async: false,
    type: 'POST',
    dataType: 'jsonp',
    data: {
      case_id: caseid
    },
    beforeSend: function(xhr, settings) {
      // 发送请求前
      console.log('beforeSend', xhr, settings);
    },
    success: function(data, status, xhr) {
      // 请求成功
      console.log('success', data, status, xhr);
      if (data.code === 0) {
        if (data.data.data === 200) {
          showBuyShop();
        }
        console.log('处理成功');
      } else {
        console.log('处理失败');
      }
    },
    error: function(xhr, errorType, error) {
      // 请求失败
      console.log('error', xhr, errorType, error);
    },
    complete: function(xhr, status) {

      console.log('complete', xhr, status);
    }
  });
}




/**
 * 确定认购 成功展示函数
 */
function showBuyShop() {
  app.closeDialog('shopBuy');
  $('body').css('overflow', 'auto');
  window.location = app.detail + '?activity_id=' + app.activity_id + '&id=' + app.id + '&case_id=' + app.case_id;
}