var isEnabled = true;
var maxTabs = 20;
var tabsCount;

function updateBadgeText() {
    var tabsBalance = maxTabs - tabsCount;
    var tabsAllowanceRemaining = (tabsBalance > 0) ? tabsBalance : 0;

    chrome.action.setBadgeText({
        text: "" + tabsAllowanceRemaining
    });
}

function updateTabsCount() {
    chrome.tabs.query({
        windowType: 'normal',
        pinned: false
    }, function (tabs) {
        tabsCount = tabs.length;
        updateBadgeText();
    });
}

function handleTabCreated(tab) {
    if (tabsCount >= maxTabs) {
        chrome.tabs.remove(tab.id);
        
        // アクティブタブにステータスバーメッセージを表示
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'showStatusBarMessage',
                    text: `タブ数が上限(${maxTabs}個)に達しました。新しいタブを開くには、既存のタブを閉じてください。`
                });
            }
        });
    }
    else {
        updateTabsCount();
    }
}

function handleTabRemoved(tab) {
    updateTabsCount();
}

function handleTabUpdated(tab) {
    updateTabsCount();
}

function init() {
    updateTabsCount();
    chrome.tabs.onCreated.addListener(handleTabCreated);
    chrome.tabs.onRemoved.addListener(handleTabRemoved);
    chrome.tabs.onUpdated.addListener(handleTabUpdated);
}

function teardown() {
    chrome.tabs.onCreated.removeListener(handleTabCreated);
    chrome.tabs.onRemoved.removeListener(handleTabRemoved);
    chrome.tabs.onUpdated.removeListener(handleTabUpdated);
}

chrome.action.onClicked.addListener(function (tab) {
    if (!isEnabled) {
        init();
        chrome.action.setIcon({ path: "icons/19.png" });
    }
    else {
        teardown();
        chrome.action.setIcon({ path: "icons/19-disabled.png" });
        chrome.action.setBadgeText({ 'text': '' });
    }

    isEnabled = !isEnabled;
});

init();
