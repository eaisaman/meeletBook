define(
    ["angular"],
    function () {
        var appService = function ($rootScope, $http, $timeout, $q, $compile, $cookies, $cookieStore, angularConstants, utilService) {
            this.$rootScope = $rootScope;
            this.$http = $http;
            this.$timeout = $timeout;
            this.$q = $q;
            this.$compile = $compile;
            this.$cookies = $cookies;
            this.$cookieStore = $cookieStore;
            this.angularConstants = angularConstants;
            this.utilService = utilService;
        };

        appService.$inject = ["$rootScope", "$http", "$timeout", "$q", "$compile", "$cookies", "$cookieStore", "angularConstants", "utilService"];

        appService.prototype.NOOP = function () {
            var self = this,
                defer = self.$q.defer();

            self.$timeout(function () {
                defer.resolve();
            });

            return defer.promise;
        }

        appService.prototype.getResolveDefer = function (result) {
            var self = this,
                defer = self.$q.defer();

            self.$timeout(function () {
                defer.resolve(result);
            });

            return defer.promise;
        }

        appService.prototype.getRejectDefer = function (err) {
            var self = this,
                errorDefer = self.$q.defer();

            self.$timeout(function () {
                errorDefer.reject(err);
            });

            return errorDefer.promise;
        }

        appService.prototype.getServerUrl = function () {
            return this.getResolveDefer("http://localhost:3000");
        };

        appService.prototype.refreshUser = function (loginName) {
            var self = this;

            return self.$http({
                method: 'get',
                url: this.angularConstants.serverUrl + '/api/private/user',
                params: {
                    userFilter: JSON.stringify({loginName: loginName})
                }
            }).then(function (result) {
                var defer = self.$q.defer(),
                    userObj = result.data && result.data.resultValue && result.data.resultValue.length && result.data.resultValue[0];

                self.$timeout(function () {
                    if (userObj) {
                        localStorage.loginUser = JSON.stringify(userObj);
                        self.$rootScope.loginUser = self.$rootScope.loginUser || {};
                        for (var key in self.$rootScope.loginUser) {
                            delete self.$rootScope.loginUser[key];
                        }

                        _.extend(self.$rootScope.loginUser, userObj);

                        defer.resolve(result);
                    } else {
                        defer.reject("User object not returned.");
                    }
                });

                return defer.promise;
            }, function (err) {
                return self.getRejectDefer(err);
            });
        }

        appService.prototype.doLogin = function (loginName, password) {
            var self = this,
                encoded = self.utilService.encode(loginName + ':' + password);

            this.$http.defaults.headers.common.Authorization = 'Basic ' + encoded;

            return self.refreshUser(loginName);
        }

        appService.prototype.doLogout = function () {
            var self = this,
                defer = self.$q.defer();

            self.$timeout(function () {
                delete localStorage.loginUser;

                for (var key in self.$rootScope.loginUser) {
                    delete self.$rootScope.loginUser[key];
                }
                self.$cookieStore.remove("connect.sid");
                self.$http.defaults.headers.common.Authorization = "";

                defer.resolve();
            });

            return defer.promise;
        }

        appService.prototype.restoreUserFromStorage = function () {
            var self = this,
                defer = self.$q.defer();

            self.$timeout(
                function () {
                    var sid = self.$cookies["connect.sid"];

                    !sid && delete localStorage.loginUser;

                    self.$rootScope.loginUser = self.$rootScope.loginUser || {};

                    var userObj = eval("(" + localStorage.loginUser + ")");

                    for (var key in self.$rootScope.loginUser) {
                        delete self.$rootScope.loginUser[key];
                    }

                    _.extend(self.$rootScope.loginUser, userObj);

                    defer.resolve(userObj);
                }
            );

            return defer.promise;
        }

        appService.prototype.getUserDetail = function (userFilter) {
            return this.$http({
                method: 'GET',
                url: this.angularConstants.serverUrl + '/api/private/userDetail',
                params: {userFilter: JSON.stringify(userFilter)}
            });
        }

        appService.prototype.getLocalProject = appService.prototype.NOOP;

        appService.prototype.deleteLocalProject = appService.prototype.NOOP;

        appService.prototype.checkProjectMode = appService.prototype.NOOP;

        appService.prototype.scanProjectCode = appService.prototype.NOOP;

        appService.prototype.getProject = function (projectFilter) {
            return this.$http({
                method: 'GET',
                url: this.angularConstants.serverUrl + '/api/public/project',
                params: {projectFilter: JSON.stringify(projectFilter)}
            });

        }

        appService.prototype.downloadModules = appService.prototype.NOOP;

        appService.prototype.downloadProject = appService.prototype.NOOP;

        appService.prototype.pauseDownloadProject = appService.prototype.NOOP;

        appService.prototype.showProject = appService.prototype.NOOP;

        return function (appModule) {
            appModule.
                config(['$httpProvider',
                    function ($httpProvider) {
                        $httpProvider.defaults.useXDomain = true;
                        $httpProvider.defaults.withCredentials = true;
                        delete $httpProvider.defaults.headers.common['X-Requested-With'];
                    }
                ]).
                config(["$provide", "$controllerProvider", "$compileProvider", "$injector", function ($provide, $controllerProvider, $compileProvider, $injector) {
                    $provide.service('appService', appService);
                    appService.prototype.$controllerProvider = $controllerProvider;
                    appService.prototype.$compileProvider = $compileProvider;
                    appService.prototype.$injector = $injector;
                }]);
        }
    }
)
;