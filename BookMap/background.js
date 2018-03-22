chrome.commands.onCommand.addListener( command => {
  let store = {};
  let preset = command[6];

  chrome.storage.sync.get(null, result => {
    store = result.store
    chrome.tabs.getSelected(null, tab => {
      if (store[preset] == undefined){
        return;
      }
      chrome.bookmarks.create({
        parentId: store[preset].id,
        title: tab.title,
        url: tab.url
      }, tree => {
      });
    })
  });


});
