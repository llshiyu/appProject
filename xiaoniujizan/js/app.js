// app.initPages() : 初始化page 和 dialog;
// app.showPage(nextPage, branch): 显示nextPage页面，如果当前页处在不可翻页状态，则退出; 如果目标页面存在，且依赖的家在任务没有完成，则停止当前的加载任务，立即切换到依赖的加载任务，并显示loading;如果依赖的任务加载完，则切换到目标页面;
// app.showDialog(dname) :显示dname弹框;
// app.closeDialog(dname) :关闭dname弹框;
(function() {
  app.initPages = function() {
    $.each(app.pages, function(key, value) {
      // console.log("Key: " + key + ", Value: ", value);
      if (app.pages[key].init) {
        app.pages[key].init();
      }
    });

    app.dialogs.init();

  };

  // app.showPage = function(nextPage, branch) {
  //   $('html , body').animate({scrollTop: 0},'fast');
  //   console.log('showPage', nextPage);
  //   var cp = app.currentPage;
  //   var setSlide = function(pageNum, lastTime, x, y) {
  //     $('.p' + pageNum).css({
  //
  //       // '-webkit-transition': '-webkit-transform ' + lastTime + 's',
  //       // '-webkit-transform': 'translate(' + x + '%,' + y + '%)'
  //     });
  //   };
  //
  //
  //   if (cp !== 0 && !app.pages[cp].isFlipReady) {
  //     return false;
  //   }
  //   // console.log('showPage cp nextPage', cp, nextPage);
  //
  //   if (app.pages[nextPage]) {
  //     var dependingTask = app.pages[nextPage].dependingTask;
  //     if (app.isMultiLoad && !app.loader.isTaskDone(dependingTask)) {
  //       app.showDialog('loading');
  //       var task = app.loader.currentTask;
  //       console.log('.....dependingTask,task', dependingTask, task.id);
  //       if (task.id != dependingTask) {
  //         task.pause();
  //         task = app.loader.getNextTask(dependingTask);
  //         task.load();
  //       }
  //       task.all = function() {
  //         app.showPage(nextPage);
  //       };
  //       return false;
  //     }
  //     app.closeDialog('loading');
  //
  //
  //     console.log('是否隐藏');
  //     $('.page:not(.p' + nextPage + ')').fadeOut(100);
  //     $('.p' + nextPage).fadeIn(100);
  //
  //
  //     if (app.pages[cp] && app.pages[cp].onLeave) {
  //       app.pages[cp].onLeave();
  //     }
  //     if (app.pages[nextPage].onLoad) {
  //       app.pages[nextPage].onLoad();
  //     }
  //     app.currentPage = nextPage;
  //     window._hmt && _hmt.push(['_trackEvent', '进入页面', '进入第' + nextPage + '页']);
  //   }
  // };

  app.showDialog = function(dname) {
    $('.dialog').hide();
    $('.d-' + dname).fadeIn(500);
  };
  app.closeDialog = function(dname) {
    $('.d-' + dname).fadeOut(300);
  };
  // app.onPreLoad = function(callback) {
  //   window.onload = callback;
  // };
}());