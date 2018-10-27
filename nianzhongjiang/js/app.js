(function () {
  app.initPages = function () {

    $.each(app.pages, function (key, value) {
      // console.log("Key: " + key + ", Value: ", value);
      if (app.pages[key].init) {
        app.pages[key].init();
      }
    });
    app.dialogs.init();

  };

  app.showPage = function (nextPage, branch) {
    console.log('showPage', nextPage);
    var cp = app.currentPage;
    var setSlide = function (pageNum, lastTime, x, y) {
      $('.p' + pageNum).css({
        '-webkit-transition': '-webkit-transform ' + lastTime + 's',
        '-webkit-transform': 'translate(' + x + '%,' + y + '%)'
      });
    };


    if (cp !== 0 && !app.pages[cp].isFlipReady) {
      return false;
    }
    // console.log('showPage cp nextPage', cp, nextPage);

    if (app.pages[nextPage]) {
      var dependingTask = app.pages[nextPage].dependingTask;
      if (app.isMultiLoad && !app.loader.isTaskDone(dependingTask)) {
        app.showDialog('loading');

        var task = app.loader.currentTask;
        // console.log('.....dependingTask,task',dependingTask,task.id);
        if (task.id != dependingTask) {
          task.pause();
          task = app.loader.getNextTask(dependingTask);
          task.load();
        }
        task.all = function () {
          app.showPage(nextPage);
          task.all = null;
        };
        return false;
      }
      app.hideDialog('loading');

      if (app.pages[nextPage].hasBranch) {
        if (!branch) {
          branch = 1;
        }
        $('.p' + nextPage).find('.branch').hide();
        $('.p' + nextPage + '-' + branch).show();
      }

      $('.page:not(.p' + nextPage + ')').fadeOut(500);
      $('.p' + nextPage).hide().fadeIn(500);


      if (app.pages[cp] && app.pages[cp].onLeave) {
        app.pages[cp].onLeave();
      }
      if (app.pages[nextPage].onLoad) {
        app.pages[nextPage].onLoad();
      }
      app.currentPage = nextPage;
      window._hmt && _hmt.push(['_trackEvent', '进入页面', '进入第' + nextPage + '页']);
    }
  };


  app.showDialog = function (dname) {
    $('.dialog').fadeOut(300);
    $('.d-' + dname).fadeIn(300);
  };
  app.hideDialog = function (dname) {
    $('.d-' + dname).fadeOut(300);
    console.log('hideDialog');
  };

}());
