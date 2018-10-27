app.dialogs = (function() {

  return {
    init: function() {
      $('.d-share').click(function() {
        $(this).fadeOut(300);
        return false; // 阻止事件冒泡
      });

      $('.d-success-btn-get').click(function() {
        app.showDialog('confirm');
        return false; // 阻止事件冒泡
      });

      $('.d-confirm-btn-ok,.d-confirm').click(function() {
        app.closeDialog('confirm');
        return false; // 阻止事件冒泡
      });
    }
  };

})();
