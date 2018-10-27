/**
 * lrz3
 * https://github.com/think2011/localResizeIMG3
 * @author think2011
 */
;
(function() {
  window.URL = window.URL&&window.URL.createObjectURL?window.URL:window.webkitURL&&window.webkitURL.createObjectURL?window.webkitURL:null;
  var ua = detect.parse(navigator.userAgent);

  /**
   * 客户端压缩图片
   * @param file
   * @param [options]
   * @constructor
   */
  function Lrz(file, options) {
    this.file = file;
    this.defaults = {
      quality: 0.3,
      // width: 1000,
      // height: 1000,
      maxWidth: 828,
      done: null,
      fail: null,
      before: null,
      always: null
    };

    for (var p in options) {
      this.defaults[p] = options[p];
    }
    if (this.defaults.quality > 1) this.defaults.quality = 1;

    this.results = {
      origin: null,
      base64: null,
      base64Len: null
    };

    this.init();
  }

  Lrz.prototype = {
    constructor: Lrz,

    /**
     * 初始化
     */
    init: function() {
      var that = this;

      // 简单的兼容性检测
      if (typeof window.URL === 'undefined' ||
        typeof document.createElement('canvas').getContext !== 'function') {
        var error = new Error('不支持此设备');

        // 错误回调
        if (typeof that.defaults.fail === 'function') {
          that.defaults.fail(error);
        }

        // 压缩结束回调
        if (typeof that.defaults.always === 'function') {
          that.defaults.always();
        }

        return;
      }

      that.create(that.file);
    },

    handleFilter: function(canvas) {
      if (this.defaults.filter) {
        var ctx = canvas.getContext('2d');
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.defaults.filter(imageData);
        ctx.putImageData(imageData, 0, 0);
      }
    },

    /**
     * 生成base64
     * @param file
     * @param callback
     */
    create: function(file) {
      var that = this,
        img = new Image(),
        results = that.results,
        blob = (typeof file === 'string') ? file : window.URL.createObjectURL(file);
        // blob = window.URL.createObjectURL(file);


      // img.crossOrigin = "*";
      img.onerror = function() {
        var error = new Error('图片加载失败');
        // 读取文件失败
        if (typeof that.defaults.fail === 'function') {
          that.defaults.fail(error);
        }

        // 压缩结束回调
        if (typeof that.defaults.always === 'function') {
          that.defaults.always();
        }
      };
      img.onload = function() {
        // 获得图片缩放尺寸
        var resize = that.resize(this);

        EXIF.getData(img, function() {
          var orientation = EXIF.getTag(this, "Orientation");
          // 初始化canvas
          var canvas = document.createElement('canvas'),
            ctx;

          // 根据旋转重置尺寸
          that.rotateResize(resize, orientation);

          that.limitSize(resize);

          canvas.width = resize.w;
          canvas.height = resize.h;
          ctx = canvas.getContext('2d');

          // 渲染画布
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, resize.w, resize.h);

          // 生成结果
          results.origin = file;

          // 兼容iOS6/iOS7
          if (ua.os.family === 'iOS' && +ua.os.version < 8) {

            var mpImg = new MegaPixImage(img);

            mpImg.render(canvas, {
              width: canvas.width,
              height: canvas.height,
              orientation: orientation
            });

            that.handleFilter(canvas);

            results.base64 = canvas.toDataURL('image/jpeg', that.defaults.quality);

            // 执行回调
            _resultCallback(results);

          }
          // 其他设备&IOS8+
          else {
            switch (orientation) {
              case 3:
                ctx.rotate(180 * Math.PI / 180);
                ctx.drawImage(img, -resize.w, -resize.h, resize.w, resize.h);
                break;

              case 6:
                canvas.width = resize.h;
                canvas.height = resize.w;
                ctx.rotate(90 * Math.PI / 180);
                ctx.drawImage(img, 0, -resize.h, resize.w, resize.h);
                break;

              case 8:
                canvas.width = resize.h;
                canvas.height = resize.w;
                ctx.rotate(270 * Math.PI / 180);
                ctx.drawImage(img, -resize.w, 0, resize.w, resize.h);
                break;

              default:
                ctx.drawImage(img, 0, 0, resize.w, resize.h);
            }

            that.handleFilter(canvas);

            if (ua.os.family === 'Android' && ua.os.version.slice(0, 3) < 4.5) {
              var encoder = new JPEGEncoder();
              results.base64 = encoder.encode(ctx.getImageData(0, 0, canvas.width, canvas.height), that.defaults.quality * 100);
            } else {
              results.base64 = canvas.toDataURL('image/jpeg', that.defaults.quality);
            }

            results.width = canvas.width;
            results.height = canvas.height;

            // 执行回调
            _resultCallback(results);

          }
        });


        /**
         * 包装回调
         */
        function _resultCallback(results) {
          // 释放内存
          canvas = null;
          img = null;
          URL.revokeObjectURL(blob);

          // 加入base64Len，方便后台校验是否传输完整
          results.base64Len = results.base64.length;

          // 压缩成功回调
          if (typeof that.defaults.done === 'function') {
            that.defaults.done(results);
          }

          // 压缩结束回调
          if (typeof that.defaults.always === 'function') {
            that.defaults.always();
          }
        }
      };

      // 压缩开始前回调
      this.defaults.before && this.defaults.before();
      img.src = blob;
    },

    limitSize: function(resize) {
      if (resize.w > this.defaults.maxWidth) {
        var hwRatio = resize.h / resize.w;
        resize.h = this.defaults.maxWidth * hwRatio;
        resize.w = this.defaults.maxWidth;
      }
    },

    /**
     * 获得图片的缩放尺寸
     * @param img
     * @returns {{w: (Number), h: (Number)}}
     */
    resize: function(img) {
      var w = this.defaults.width,
        h = this.defaults.height,
        scale = img.width / img.height,
        ret = {
          w: img.width,
          h: img.height
        };

      if (w & h) {
        ret.w = w;
        ret.h = h;
      } else if (w) {
        ret.w = w;
        ret.h = Math.ceil(w / scale);
      } else if (h) {
        ret.w = Math.ceil(h * scale);
        ret.h = h;
      }

      // 超过这个值base64无法生成，在IOS上
      if (ret.w >= 3264 || ret.h >= 2448) {
        ret.w *= 0.8;
        ret.h *= 0.8;
      }

      return ret;
    },

    /**
     * 根据旋转角度重置之前设定的宽高
     * @param resize
     * @param orientation
     * @return
     */
    rotateResize: function(resize, orientation) {
      switch (orientation) {
        case 6:
        case 8:
          if (this.defaults.width && this.defaults.height) {
            var oldW = resize.w,
              oldH = resize.h;

            resize.w = oldH;
            resize.h = oldW;
            return false;
          }

          var diffVal;

          if (this.defaults.width) {
            if (resize.w > resize.h) {
              diffVal = resize.w - resize.h;
              resize.w += diffVal;
              resize.h += diffVal;
            } else if (resize.w < resize.h) {
              diffVal = resize.h - resize.w;
              resize.w -= diffVal;
              resize.h -= diffVal;
            }
            return false;
          }

          if (this.defaults.height) {
            if (resize.w > resize.h) {
              diffVal = resize.w - resize.h;
              resize.w -= diffVal;
              resize.h -= diffVal;
            } else if (resize.w < resize.h) {
              diffVal = resize.h - resize.w;
              resize.w += diffVal;
              resize.h += diffVal;
            }
            return false;
          }
          break;

        default:
          // do nothing
      }
    }
  };

  function toDataURL(canvas) {
    var quality = 0.3;
    if (ua.os.family === 'Android' && ua.os.version.slice(0, 3) < 4.5) {
      var encoder = new JPEGEncoder();
      var ctx = canvas.getContext('2d');
      return encoder.encode(ctx.getImageData(0, 0, canvas.width, canvas.height), quality * 100);
    } else {
      return canvas.toDataURL('image/jpeg', quality);
    }
  }

  window.LrzUtil = {
    toDataURL: toDataURL
  };

  // 暴露接口
  window.lrz = function(file, options) {
    return new Lrz(file, options);
  };

})();
