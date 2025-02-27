var Status = false;

function setIcon() {
  if (Status) {
    chrome.action.setIcon({
      path: 'icon-128x128.png'
    });
  } else {
    chrome.action.setIcon({
      path: 'icon-sit-128x128.png'
    });
  }
}

function setStatus(status) {
  Status = status;
  chrome.storage.sync.set({
    active: Status
  });
  setIcon();
}

chrome.storage.sync.get({
  active: true
}, function (result) {
  setStatus(result.active);
});


chrome.action.onClicked.addListener(function (t) {
  setStatus(!Status);
  console.log(t);
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      if (tab.id == t.id) {
        chrome.scripting.executeScript({
          target: {
            tabId: tab.id,
            allFrames: false
          },
          files : [ "content.min.js" ],
          // code: "window.postMessage({ type: 'smjStatus', active: " + Status + "},'*')"
        }).then(() => {
          console.log('executed..')
        });
      }
    });
  });
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  switch (msg && msg.type) {
    case 'isActive':
      sendResponse({
        active: Status
      });
      break;
  }
});

chrome.runtime.setUninstallURL("https://sites.google.com/view/popular-browser-wallpaper");


chrome.runtime.onInstalled.addListener(function (object) {

  if (object.reason == "install") {
    var pageurl = 'https://coolthemestores.com/among-us-shimeji-for-chrome-browser/?utm_campaign=si_extensions&utm_medium=newinstall&utm_source=si_amongusshimeji';
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function (tabs) {
      if (tabs.length > 0) {
        var tabid = tabs[0].id;
        chrome.tabs.update(tabid, {
          url: pageurl
        });
      }
    });

  }


});