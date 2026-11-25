// 把页面错误直接显示出来，方便排查（保持最老的语法，任何浏览器都能运行）
(function () {
  function show(text) {
    var box = document.getElementById('errbox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'errbox';
      box.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99;background:#b3261e;color:#fff;padding:10px 14px;font:13px/1.5 monospace;white-space:pre-wrap;max-height:40vh;overflow:auto';
      (document.body || document.documentElement).appendChild(box);
    }
    box.textContent += text + '\n';
  }
  window.addEventListener('error', function (e) {
    show('出错了（请截图发给 Claude）：' + e.message + '  @ ' + (e.filename || '').split('/').pop() + ':' + e.lineno + '\n浏览器：' + navigator.userAgent);
  });
  window.addEventListener('unhandledrejection', function (e) {
    show('出错了（请截图发给 Claude）：' + (e.reason && (e.reason.message || e.reason)) + '\n浏览器：' + navigator.userAgent);
  });
  window.addEventListener('DOMContentLoaded', function () {
    if (!(window.chrome && chrome.runtime && chrome.runtime.id)) {
      show('这个页面要从浏览器工具栏的「AI 圆桌」插件图标打开，不能直接双击 app.html 打开。');
    }
  });
})();
