// ステータスバーメッセージを表示する関数
function showStatusBarMessage(message) {
  // ステータスバー要素が存在しない場合は作成
  let statusBar = document.getElementById('tab-limit-status-bar');
  if (!statusBar) {
    statusBar = document.createElement('div');
    statusBar.id = 'tab-limit-status-bar';
    statusBar.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: #f44336;
      color: white;
      text-align: center;
      padding: 10px;
      z-index: 9999;
      font-family: Arial, sans-serif;
      box-shadow: 0 -2px 5px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(statusBar);
  }
  
  // メッセージを設定して表示
  statusBar.textContent = message;
  
  // 5秒後に自動的に非表示
  setTimeout(() => {
    if (statusBar && statusBar.parentNode) {
      statusBar.parentNode.removeChild(statusBar);
    }
  }, 5000);
}

// バックグラウンドスクリプトからのメッセージをリッスン
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'showStatusBarMessage') {
    showStatusBarMessage(message.text);
  }
});
