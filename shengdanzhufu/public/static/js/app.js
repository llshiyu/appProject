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

  app.showPage = function(nextPage, branch) {
    // console.log('showPage', nextPage);
    var cp = app.currentPage;
    var setSlide = function(pageNum, lastTime, x, y) {
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
        if(task.id != dependingTask ){
          task.pause();
          task = app.loader.getNextTask(dependingTask);
          task.load();
        }
        task.all = function() {
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
      if (nextPage > 1) {
        setSlide(nextPage, 0, 0, 0);
        setSlide(cp, 0, 0, 0);
      }
      // if (cp == 1 && nextPage == 2) { //p1 to p2
      //   setSlide(nextPage, 1, 100, 0);
      //   $('.p' + nextPage).show(0, function() {
      //     setSlide(nextPage, 1, 0, 0);
      //     setSlide(cp, 1, '-100', 0);
      //   });
      // } else if (cp == 2 && nextPage == 1) { //p2 to p1
      //   $('.p' + nextPage).css({
      //     '-webkit-transform': 'translate(-100%,0%)'
      //   }).show(0, function() {
      //     setSlide(nextPage, 1, 0, 0);
      //     setSlide(cp, 1, 100, 0);
      //   });
      // } else
      //   if (nextPage - 1 == cp && nextPage > 1) { //下一页
      //   // console.log('next');
      //   $('.p' + nextPage).css({
      //     '-webkit-transform': 'translate(0%,100%)'
      //   }).show(0, function() {
      //     setSlide(cp, 1, 0, '-100');
      //     setSlide(nextPage, 1, 0, 0);
      //   });
      // } else if (nextPage == cp - 1 && nextPage >= 1) { //上一页
      //   // console.log('pre');
      //   $('.p' + nextPage).css({
      //     '-webkit-transform': 'translate(0%,-100%)'
      //   }).show(0, function() {
      //     setSlide(cp, 1, 0, 100);
      //     setSlide(nextPage, 1, 0, 0);
      //   });
      // } else {
        $('.page:not(.p' + nextPage + ')').fadeOut(500);
        $('.p' + nextPage).hide().fadeIn(500);
      // }

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


  app.showDialog = function(dname) {
    $('.dialog').fadeOut(300);
    $('.d-' + dname).fadeIn(300);
  };
  app.hideDialog = function(dname) {
    $('.d-' + dname).fadeOut(300);
    // console.log('hideDialog');
  };

}());
