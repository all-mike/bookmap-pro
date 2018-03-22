angular.module('bookmap')
  .component('settingsPanel', {

    controller(bookMarks, userSettings, $timeout, $rootScope) {

      const panel = this

      this.getMapkeys = () => {
        userSettings.get( results => {
          $rootScope.settings = results
        })
      }

      this.toggleOption = () => {
        if ($rootScope.newfolderOpt == 'off'){
          $rootScope.newfolderOpt = 'on'
          userSettings.singlesave('option', 'on')
        } else {
          $rootScope.newfolderOpt = 'off'
          userSettings.singlesave('option', 'off')
        }
      }

      this.toggleTheme = () => {
        if ($rootScope.theme == 'dark-mode'){
          panel.updateTheme('light-mode')
          userSettings.singlesave('theme', 'light-mode')
        } else {
          panel.updateTheme('dark-mode')
          userSettings.singlesave('theme', 'dark-mode')
        }
      }

      this.updateTheme = classname => {
        $rootScope.theme = classname
        let body = angular.element(document).find('body')
        body.removeClass()
        body.addClass(classname)
        $timeout()
      }

      this.register = () => {
        userSettings.save($rootScope.settings)
      };

      this.openShortcuts = () => {
        chrome.tabs.create({
          url: 'chrome://extensions/configureCommands'
        });
      };

      this.removeKey = index => {
        let tempkeys = Object.entries($rootScope.settings)
        let temparr = []
        for (let i = 0 ; i < tempkeys.length ; i++){
          if (tempkeys[i][0] !== index){
            temparr.push([tempkeys[i][0], tempkeys[i][1]])
          }
        }
        for (let i = 0 ; i < temparr.length; i++){
          $rootScope.settings[i] = temparr[i][1]
        }
        let removedindex = temparr.length
        $rootScope.settings[removedindex] = undefined
        userSettings.save($rootScope.settings)
        userSettings.get( results => {
          $rootScope.settings = results
        })
        $timeout()
      }

      this.$onInit = () => {
        panel.getMapkeys()
        $timeout()
      }

    },

    template: `
    <div class="papapanel">

      <div id="miniheader">mapped folders</div>

      <div class="form-group">

        <div>
          <div class="input-group" id="topspace">
          <input name="sfolders" id="sfolders" type="text" placeholder="hotkey0 folder" ng-model="$root.settings[0]" uib-typeahead="bm as bm.title for bm in $root.folders | filter:$viewValue | limitTo:8" class="form-control" typeahead-on-select="$ctrl.register()" typeahead-editable="false" autocomplete="off">
            <span class="input-group-btn">
              <button class="btn btn-default" type="button" ng-click="$ctrl.removeKey('0')">
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              </button>
            </span>
          </div>
        <div>

        <div ng-if="$root.settings[0]" id="topspace">
          <div class="input-group">
          <input name="sfolders" id="sfolders" type="text" placeholder="hotkey1 folder" ng-model="$root.settings[1]" uib-typeahead="bm as bm.title for bm in $root.folders | filter:$viewValue | limitTo:8" class="form-control" typeahead-on-select="$ctrl.register()" typeahead-editable="false" autocomplete="off">
            <span class="input-group-btn">
              <button class="btn btn-default" type="button" ng-click="$ctrl.removeKey('1')">
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              </button>
            </span>
          </div>
        </div>

        <div ng-if="$root.settings[1]" id="topspace">
          <div class="input-group">
          <input name="sfolders" id="sfolders" type="text" placeholder="hotkey2 folder" ng-model="$root.settings[2]" uib-typeahead="bm as bm.title for bm in $root.folders | filter:$viewValue | limitTo:8" class="form-control" typeahead-on-select="$ctrl.register()" typeahead-editable="false" autocomplete="off">
            <span class="input-group-btn">
              <button class="btn btn-default" type="button" ng-click="$ctrl.removeKey('2')">
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              </button>
            </span>
          </div>
        </div>

        <div ng-if="$root.settings[2]" id="topspace">
          <div class="input-group">
          <input name="sfolders" id="sfolders" type="text" placeholder="hotkey3 folder" ng-model="$root.settings[3]" uib-typeahead="bm as bm.title for bm in $root.folders | filter:$viewValue | limitTo:8" class="form-control" typeahead-on-select="$ctrl.register()" typeahead-editable="false" autocomplete="off">
          <span class="input-group-btn">
            <button class="btn btn-default" type="button" ng-click="$ctrl.removeKey('3')">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </button>
          </span>
        </div>
      </div>
        
      <div>

        <div id="miniheader" style="margin-top:8px">settings</div>

        <div class="row" id="topspace">
          <div class="col-lg-10">
            <div class="input-group">
            <button class="btn btn-default" id="widebutt" ng-click="$ctrl.toggleTheme()" width="100%">high contrast mode</button>
              <span class="input-group-btn">
                <button class="btn btn-primary" type="button" ng-click="$ctrl.toggleTheme()">
                  <div ng-if="$root.theme =='dark-mode'" id="settingtoggle"> ON </div>
                  <div ng-if="$root.theme !=='dark-mode'" id="settingtoggle"> OFF </div>
                </button>
              </span>
            </div>
          </div>
        </div>

        <div class="row" id="topspace">
          <div class="col-lg-10">
            <div class="input-group">
            <button class="btn btn-default" id="widebutt" ng-click="$ctrl.toggleOption()" width="100%">create new folders</button>
              <span class="input-group-btn">
                <button class="btn btn-primary" type="button" ng-click="$ctrl.toggleOption()">
                  <div ng-if="$root.newfolderOpt == 'on'" id="settingtoggle"> ON </div>
                  <div ng-if="$root.newfolderOpt !== 'on'" id="settingtoggle"> OFF </div>
                </button>
              </span>
            </div>
          </div>
        </div>

        <div id="topspace">
          <button class="btn btn-default" id="widebutt" ng-click="$ctrl.openShortcuts()" width="100%">choose hotkeys</button>
        </div>
      </div>
    </div>
    `

  });