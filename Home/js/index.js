var URL = 'http://176.122.153.17:8080/appProject/';

(function () {
  init();
})();

function init() {
  let dom = document.getElementsByClassName('title');
  for (let i = 0; i < dom.length; i++) {
    let jumpName = dom[i].dataset.name;
    dom[i].href = URL + jumpName;
  }
}