;(function() {
  var defaults = {
    $container: null,
    $input: null,
    filter: null,
    $touchElement: null
  };


  function ImgCropper(opts) {
    this.opts = {};
    $.extend(this.opts, defaults, opts);

    this.init();
  }

  ImgCropper.prototype.init = function() {
    this.transformer = null;
    this.$canvas = $('<canvas></canvas>');
    this.$img = $('<img>');
    this.img = this.$img.get(0);
    this.opts.$container.append(this.$canvas);
    this.opts.$container.append(this.$img);
    this.$canvas.css({
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      // borderRadius: '20px'
    });
    this.$img.css({
      width: '100%',
    });

    this.opts.$touchElement = this.opts.$touchElement || this.$img;

    this.containerWidth = this.opts.$container.width();
    this.containerHeight = this.opts.$container.height();
    this.hwRatio = this.containerHeight / this.containerWidth;

    this.canvas = this.$canvas.get(0);
    this.ctx = this.canvas.getContext('2d');

    var me = this;
    this.opts.$input.change(function(e) {
      var files = e.target.files;
      if (files.length == 1) {
        me.load(files[0]);
      }
    });
  };

  ImgCropper.prototype.clearCanvas = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  ImgCropper.prototype.load = function(file) {
    var me = this;
    lrz(file, {
      filter: this.opts.filter,
      done: function(results) {
        me.clearCanvas();

        // console.log(results);
        var url = results.base64;
        me.$img.attr('src', url);
        me.$img.css('visibility', 'visible');
        me.transformer = new ObjectTransformer(me.img, me.opts.$touchElement.get(0));

        // var originSize = results.origin.size;
        // var size = results.base64.length;
        // log('原图: ' + toSizeString(originSize));
        // log('现图: ' + toSizeString(size));
      },
      fail: function(err) {
        alert('Error: ' + err);
        console.error('Error:', err);
      }
    });
  };

  var MAX_WIDTH = 1024;

  ImgCropper.prototype.crop = function() {
    if (!this.transformer) return;

    var transform = this.transformer.transform;

    var img = this.$img.get(0);
    var width = img.naturalWidth;
    if (width > MAX_WIDTH) {
      width = MAX_WIDTH;
    }
    if (this.opts.canvasWidth) {
      width = this.opts.canvasWidth;
    }

    var height = img.naturalHeight * width / img.naturalWidth;

    var scale = width / img.width;

    this.canvas.width = width;
    this.canvas.height = width * this.hwRatio;
    var ctx = this.ctx;

    ctx.save();

    ctx.translate(width / 2, height / 2);
    ctx.translate(transform.translate.x * scale, transform.translate.y * scale);
    ctx.scale(transform.scale, transform.scale);
    ctx.rotate(transform.angle * Math.PI / 180);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);

    ctx.restore();

    this.$img.css('visibility', 'hidden');
  };

  window.ImgCropper = ImgCropper;

})();
