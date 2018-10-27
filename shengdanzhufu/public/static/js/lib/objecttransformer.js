// polyfill
window.requestAnimationFrame = (function() {
  return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

function ObjectTransformer(el, touchEl) {
  this.el = el;
  this.touchEl = touchEl || el;
  this.mc = null;
  this.transform = null;

  this.ticking = false;

  this.startX = 0;
  this.startY = 0;
  this.initScale = 1;
  this.initAngle = 0;

  this.init();
}

ObjectTransformer.prototype.init = function() {
  this.mc = new Hammer.Manager(this.touchEl);
  var mc = this.mc;

  mc.add(new Hammer.Pan({
    threshold: 0,
    pointers: 0
  }));

  mc.add(new Hammer.Rotate({
    threshold: 0
  })).recognizeWith(mc.get('pan'));
  mc.add(new Hammer.Pinch({
    threshold: 0
  })).recognizeWith([mc.get('pan'), mc.get('rotate')]);

  var me = this;
  mc.on("panstart panmove", function(ev) {
    me.onPan(ev);
  });
  mc.on("rotatestart rotatemove", function(ev) {
    me.onRotate(ev);
  });
  mc.on("pinchstart pinchmove", function(ev) {
    me.onPinch(ev);
  });

  this.resetElement();
};


ObjectTransformer.prototype.logEvent = function() {
  // el.innerHTML = ev.type;
  // console.log(ev);
};

ObjectTransformer.prototype.resetElement = function() {
  this.transform = {
    translate: {
      x: this.startX,
      y: this.startY
    },
    scale: 1,
    angle: 0
  };
  this.requestElementUpdate();
};

ObjectTransformer.prototype.updateElementTransform = function() {
  var value = [
    'translate3d(' + this.transform.translate.x + 'px, ' + this.transform.translate.y + 'px, 0)',
    'scale(' + this.transform.scale + ', ' + this.transform.scale + ')',
    'rotate(' + this.transform.angle + 'deg)'
  ];

  value = value.join(' ');
  this.el.style.webkitTransform = value;
  this.el.style.mozTransform = value;
  this.el.style.transform = value;
  this.ticking = false;
};

ObjectTransformer.prototype.requestElementUpdate = function() {
  if (!this.ticking) {
    var me = this;
    requestAnimationFrame(function() {
      me.updateElementTransform();
    });
    this.ticking = true;
  }
};

ObjectTransformer.prototype.onPan = function(ev) {
  if (ev.type == 'panstart') {
    this.startX = this.transform.translate.x;
    this.startY = this.transform.translate.y;
  }
  this.transform.translate = {
    x: this.startX + ev.deltaX,
    y: this.startY + ev.deltaY
  };

  this.logEvent(ev);
  this.requestElementUpdate();
};

ObjectTransformer.prototype.onPinch = function(ev) {
  if (ev.type == 'pinchstart') {
    this.initScale = this.transform.scale || 1;
  }

  this.transform.scale = this.initScale * ev.scale;

  this.logEvent(ev);
  this.requestElementUpdate();
};

ObjectTransformer.prototype.onRotate = function(ev) {
  if (ev.type == 'rotatestart') {
    this.initAngle = this.transform.angle || 0;
  }

  this.transform.rz = 1;
  this.transform.angle = this.initAngle + ev.rotation;

  this.logEvent(ev);
  this.requestElementUpdate();
};
