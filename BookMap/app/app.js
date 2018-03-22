angular.module('bookmap', ['ui.bootstrap'])
  .component('popup', {

    controller(bookMarks, userSettings, $timeout, $rootScope) {
      
      const ctrl = this

      this.getBookmarks = () => {
        bookMarks.get( results => {
          $rootScope.folders = results
        });
      }

      this.getTab = () => {
        chrome.tabs.getSelected(null, tab => {
          $rootScope.currentTab = tab.url
          $rootScope.currentTitle = tab.title
        })
      } 

      this.getOptions = () => {
        userSettings.multiget( result => {
          $rootScope.theme = result.theme || 'light-mode'
          $rootScope.newfolderOpt = result.option || 'on'
          ctrl.updateTheme(result.theme)
        })
      }

      this.updateTheme = classname => {
        $rootScope.theme = classname
        let body = angular.element(document).find('body')
        body.removeClass()
        body.addClass(classname)
        $timeout()
      }

      this.savebm = item => {
        ctrl.getTab()
        if (item) {
          bookMarks.save($rootScope.selected.id, $rootScope.currentTitle, $rootScope.currentTab, success => {
            window.close()
          })
        } else {
          let folders = angular.element(document).find('folders')
          let newtitle = folders.context.activeElement.value
          if ($rootScope.newfolderOpt == 'on'){
            bookMarks.newfolder(newtitle, successobj => {
              bookMarks.save(successobj.id, $rootScope.currentTitle, $rootScope.currentTab, success => {
                window.close()
              })
            })
          } else {
            window.close()
          }
        }
      }

      this.checkSubmit = $event => {
        let keyCode = $event.keyCode
        if (keyCode === 13){
          ctrl.savebm()
        }
      }

      this.$onInit = () => {
        $rootScope.openpanel = false
        ctrl.getOptions()
        ctrl.getBookmarks()
        ctrl.getTab()
        $timeout( () => {
          $(document).ready( () => {
            $("#folders").focus()
          });
        });
      };
    },

    template: 
    `
      <div class="motherdom">

        <div ng-if="!$root.openpanel"><h4>choose destination...</h4></div>
        <div ng-if="$root.openpanel" id="faded"><h4>choose destination...</h4></div>

        <div class="container-fluid">

          <div class="input-group">
              <input name="folders" id="folders" type="text" placeholder="enter a folder" ng-model="$root.selected" uib-typeahead="bm as bm.title for bm in $root.folders | filter:$viewValue | limitTo:8" class="form-control" typeahead-on-select="$ctrl.savebm($item)" ng-keypress="$ctrl.checkSubmit($event)" autocomplete="off" autofocus>
          </div>

          <div id="maincog">
            <button class="btn btn-primary" type="viewchange" id="cogbutt" ng-click="$root.openpanel = !$root.openpanel">
            <span class="glyphicon glyphicon-cog" id="cog" aria-hidden="true"></span>
            </button>
          </div>

          <div class="settings-panel" ng-if="$root.openpanel">
            <settings-panel></settings-panel>
          </div>

        </div>
      </div>
    `
  });


