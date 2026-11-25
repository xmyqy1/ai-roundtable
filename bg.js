// 点击工具栏图标：打开（或切换到）圆桌页面
chrome.action.onClicked.addListener(async () => {
  const url = chrome.runtime.getURL('app.html');
  const [tab] = await chrome.tabs.query({ url });
  if (tab) {
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  } else {
    await chrome.tabs.create({ url });
  }
});

// 一键更新后插件会重启：重启完自动重新打开圆桌页面
chrome.runtime.onInstalled.addListener((d) => {
  if (d.reason === 'update' || d.reason === 'install') chrome.tabs.create({ url: chrome.runtime.getURL('app.html') });
});
