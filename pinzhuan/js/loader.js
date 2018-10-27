// 实现分步加载；
app.loader = (function() {

  var Event = {
    _events: {},
    on: function(type, fn) {
      if (!this._events[type]) {
        this._events[type] = [];
      }
      this._events[type].push(fn);
    },
    off: function(type, fn) {
      if (!this._events[type]) {
        return;
      }
      var index = this._events[type].indexOf(fn);
      if (index > -1) {
        this._events[type].splice(index, 1);
      }
    },
    trigger: function(type) {
      if (!this._events[type]) {
        return;
      }
      var i = 0;
      var l = this._events[type].length;
      if (!l) {
        return;
      }
      for (; i < l; i++) {
        this._events[type][i].apply(this, [].slice.call(arguments, 1));
      }
    }
  };


  function getNow() {
    var now = new Date();
    var ms = now.getTime() % 1000;
    var ts = now.toLocaleTimeString() + '.' + ms;
    return ts;
  }

  function deleteItem(arr, item) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == item) {
        // console.log('---------------deleteItem');
        arr[i] = arr[arr.length - 1];
        arr.pop();
      }
    }
  }


  function Preloader(imgs, id, opts) {
    this.imgs = imgs;
    this.id = id; //任务名称
    this.each = opts && opts.each || null;
    this.all = opts && opts.all || null;
    this.onProcessChange = opts && opts.onProcessChange || function() {};

    this.isFinish = false; //是否结束
    this._paused = false;
    this._numItems = 0;
    this._numLoadings = 0; //正在加载的数量
    this._numItemsLoaded = 0;
    this._loadedPercent = 0;
    this._maxConnections = 3;
    this._loadQueueBackup = [];
    this._loadQueue = []; //还没加载的
    this._loadedQueue = []; //加载完的
    this._loadingQueue = []; //加载中的
    this._loadfiles();
    // this.load();
  }

  Preloader.prototype = {
    // @todo 删除指定项目
    // remove: function() {},
    // @todo  获取某个加载项
    // getItem: function(value) {},

    // 设置最大连接数，据说android最多同时连接4，ios最多5
    // setMaxConnections: function(value) {
    //   this._maxConnections = value;
    //   if (!this._paused && this._loadQueue.length > 0) {
    //     this._loadNext();
    //   }
    // },

    // 开始任务
    load: function() {
      this._paused = false;
      this._loadNext();
    },
    pause: function(value) {
      for (var i = 0; i < this._loadingQueue.length; i++) {
        var img = this._loadingQueue[i];
        img.setAttribute('data-loaded', 'unload');
        img.onload = null;
        img.onerror = null;
        img.src = '';
        this._loadQueue.push(img);
      }
      // this._numLoaded -= this._numLoadings;
      this._numLoadings = 0;
      this._loadingQueue = [];
      this._paused = true;
    },

    reset: function(imgs) {
      this.imgs = imgs;
      this.isFinish = false; //是否结束
      this._paused = false;
      this._numItems = 0;
      this._numLoadings = 0; //正在加载的数量
      this._numItemsLoaded = 0;
      this._loadedPercent = 0;
      this._loadQueueBackup = [];
      this._loadQueue = []; //还没加载的
      this._loadedQueue = []; //加载完的
      this._loadingQueue = []; //加载中的
      this._loadfiles();
    },

    // 将所有图片
    _loadfiles: function() {
      var ret = [];
      var hash = {};
      // console.log('_loadfiles',this.id, this.imgs);
      this._loadQueue = [];
      this._loadQueueBackup = [];
      this._loadQueueBackup = [];

      this._numItems = this.imgs.length;
      for (var i = 0; i < this.imgs.length; i++) {

        var src = this.imgs[i].getAttribute('data-src');
        // console.log('src',src);
        if (!src) {
          src = this.imgs[i].src;
          this.imgs[i] = new Image();
        }
        this.imgs[i].url = src;
        this.imgs[i].setAttribute('data-loaded', 'unload');
        this.imgs[i].percent = 0;

        this._loadQueue.push(this.imgs[i]);
        this._loadQueueBackup.push(this.imgs[i]);
      }
    },
    _loadNext: function() {
      // console.log(getNow(),'Preloader._loadNext---------');
      // 1，如果暂停，则退出
      // 2，如果当前在加载的>最大连接数，则退出
      // 3，如果可以加载，加载，并从全部队列中移除

      if (this._numItems === 0) {
        var that = this;
        // console.log('-----this length===0');
        this.isFinish = true;
        this._paused = true;
        Event.trigger('taskFinished', [that.id]);
        if (that.all) {
          // that.all();
          that.all.call(app.loader);
        }
        return;
      }

      if (this._paused) {
        // console.log(getNow(),'Preloader._loadNext',this._paused);
        return;
      }

      for (var i = 0; i < this._loadQueue.length; i++) {
        if (this._numLoadings >= this._maxConnections) {
          break;
        }
        var img = this._loadQueue[i];
        img.setAttribute('data-loaded', 'loading');
        this._loadingQueue.push(img);
        this._numLoadings++;
        this._loadQueue.splice(i, 1);
        i--;
        this._loadImg(img);
      }
    },

    _loadImg: function(img) {
      var that = this;
      img.setAttribute('data-loaded', 'loading');

      img.src = img.url;

      if (img.complete) {
        // console.log('-----'+getNow(),'_loadImg img.complete',img.src);
        img.setAttribute('data-loaded', 'loaded');
        that._onImgLoaded(img);
      } else {
        img.onload = function() {
          // console.log('-----'+getNow(),'_loadImg img.onload',img.src);
          img.setAttribute('data-loaded', 'loaded');
          that._onImgLoaded(img);
          img.onload = null;
        };
        img.onerror = function() {
          // console.log('_loadImg img.onerror',this.id,img.src);
          img.setAttribute('data-loaded', 'error');
          that._onImgLoaded(img);
          img.onerror = null;
        };
      }
    },
    _onImgLoaded: function(img) {
      this._numLoadings--;
      this._numItemsLoaded++;
      // delete this._loadingQueue[img.url];
      deleteItem(this._loadingQueue, img);


      // this._loadedQueue[img.url]=img.toString();
      this._loadedQueue.push(img);

      // console.log('_onImgLoaded() img:');
      // console.log('_onImgLoaded() _loadingQueue _loadedQueue');

      // console.log('_onImgLoaded,_numLoadings',this._numLoadings,'_numItemsLoaded',this._numItemsLoaded);
      var that = this;
      if (this.onProcessChange instanceof Function) {
        that._loadedPercent = this._numItemsLoaded / this._numItems;
        if (that.onProcessChange) {
          that.onProcessChange.call(img, {
            img: img,
            src: img.src,
            index: this._numItemsLoaded,
            percent: that._loadedPercent
          });
        }
      }
      if (this._numItemsLoaded >= this._numItems) {
        that.isFinish = true;
        that._paused = true;
        Event.trigger('taskFinished', [that.id]);
        if (that.all) {
          this.all();
          // this.all.call(app.loader);
          // console.log('that',that.all);

        }
      }

      this._loadNext();
    },
  };


  function Controller() {
    this.manifest = null;
    // this.hasFrontloader = true;
    // this.useXML = true;
    this.onEachFrontImgLoaded = null;
    this.onAllFrontImgLoaded = null;
    this.onFrontProcessChange = null;
    this.showPageNo = 0;
    this.isAllTaskDone = false;
    this.currentTask = null;
    this._rawTaskQueue = [];
    this._doneTaskQueue = [];
    this._waitingTaskQueue = [];
    // this.nextTask = null;
  }
  Controller.prototype = {

    // 初始化
    init: function(opts) {
      this.manifest = opts.manifest; //任务列表数组
      this.firstTaskId = opts.firstTaskId;
      // this.hasFrontloader = opts.hasFrontloader;
      this.onEachFrontImgLoaded = opts.onEachFrontImgLoaded;
      this.onFrontProcessChange = opts.onFrontProcessChange;
      this.onAllFrontImgLoaded = opts.onAllFrontImgLoaded;

      var that = this;
      var tempList = that.manifest;

      // 将任务添加到任务列表

      for (var i = 0, l = tempList.length; i < l; i++) {
        var imgs = that.getImgs(tempList[i]);
        that.addTask(imgs, tempList[i].id, tempList[i]);
      }

      // 任务结束后调用下一个任务
      Event.on('taskFinished', function(taskId) {
        // console.log('taskFinished', e);
        that.currentTask = that.getNextTask();
        if (that.currentTask == -1) {
          that.allTaskDoneCallback();
          that.isAllTaskDone = true;
        } else {
          // 开始下一个任务
          that.currentTask.load();
        }
      });
    },
    getImgs: function(opts) {
      var selectImgs = this._getImgArray(opts.selector);
      var imgs = [];
      for (var j = 0; opts.imgs && (j < opts.imgs.length); j++) {
        var tempImg = new Image();
        tempImg.setAttribute('data-src', opts.imgs[j]);
        imgs.push(tempImg);
      }
      Array.prototype.push.apply(imgs, selectImgs);

      return imgs;
    },

    // 开始，指定一个taskId 作为第一个任务，并将第一个任务作为loading任务
    start: function(taskId) {
      this.currentTask = this.getNextTask(taskId);
      this.currentTask.onProcessChange = this.onFrontProcessChange;
      this.currentTask.all = this.onAllFrontImgLoaded;
      this.currentTask.load();
    },

    // 新建一个任务
    addTask: function(imgs, id, opts) {
      var task = new Preloader(imgs, id, opts);
      this._rawTaskQueue.push(task);
      // this._waitingTaskQueue.push(task);
    },

    // 所有结束的回调
    allTaskDoneCallback: function() {
      // console.log('allTaskDoneCallback');
    },

    // 判断任务是否完成
    isTaskDone: function(taskId) {
      for (var i = 0, l = this._rawTaskQueue.length; i < l; i++) {
        // console.log('isTaskDone this._rawTaskQueue['+i+'].isFinish',this._rawTaskQueue[i].isFinish);
        if (this._rawTaskQueue[i].id == taskId) {
          return this._rawTaskQueue[i].isFinish;
        }
      }
      return -1;
    },
    // 找到下一个任务，如果指定任务名，则加载指定任务
    getNextTask: function(taskId) {
      var that = this;
      var i = 0;
      var len = that._rawTaskQueue.length;
      // console.log('getNextTask(): that._rawTaskQueue.length', that._rawTaskQueue.length);
      // 指定taskId时，找到执行任务
      if (taskId !== undefined && taskId !== null && taskId !== '') {
        for (i = 0; i < len; i++) {
          if (that._rawTaskQueue[i].id == taskId) {
            return that._rawTaskQueue[i];
          }
        }
      }

      // @todo 优化策略
      // 不指定taskId时，从前往后加载
      for (i = 0; i < len; i++) {
        if (that._rawTaskQueue[i].isFinish === true) {
          continue;
        } else {
          return that._rawTaskQueue[i];
        }
      }
      if (i == len) {
        return -1;
      }
    },
    resetTask: function(taskId, opts) {
      var that = this;
      var imgs = that.getImgs(opts);
      // if(!that.currentTask.isFinish){
      //   that.currentTask.pause();
      // }
      var task = that.getNextTask(taskId);
      task.reset(imgs);
      that.currentTask = that.getNextTask(taskId);
      that.currentTask.load();
    },
    // 获取图片集合，形参为选择器
    _getImgArray: function() {
      var imgs = [];
      var temps = [];
      for (var i = 0; i <= arguments.length; i++) {
        temps = Array.prototype.slice.call(document.querySelectorAll(arguments[i]));
        Array.prototype.push.apply(imgs, temps);
      }
      return imgs;
    }
  };

  return new Controller();
})();