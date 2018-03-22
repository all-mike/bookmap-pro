angular.module('bookmap')
  .factory('userSettings', () => {
    const settings = {}

    settings.save = (obj) => {
      chrome.storage.sync.set({store: obj}, () => {
      })
    }

    settings.get = (cb) => {
      chrome.storage.sync.get(null, result => {
        cb(result.store)
      })
    }

    settings.singlesave = (key, value) => {
      chrome.storage.sync.set({[key]: value}, () => {
      })
    }

    settings.singleget = (key, cb) => {
      chrome.storage.sync.get([key], result => {
        cb(result)
      })
    }

    settings.multiget = cb => {
      chrome.storage.sync.get(['option', 'theme'], result => {
        cb(result)
      });
    }

    return settings
  })