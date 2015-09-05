define(
    ["angular"],
    function () {
        var appService = function ($rootScope, $http, $timeout, $q, $compile, $cookies, $cookieStore, angularConstants, angularEventTypes, utilService, urlService) {
            this.$rootScope = $rootScope;
            this.$http = $http;
            this.$timeout = $timeout;
            this.$q = $q;
            this.$compile = $compile;
            this.$cookies = $cookies;
            this.$cookieStore = $cookieStore;
            this.angularConstants = angularConstants;
            this.angularEventTypes = angularEventTypes;
            this.utilService = utilService;
            this.urlService = urlService;
        };

        appService.$inject = ["$rootScope", "$http", "$timeout", "$q", "$compile", "$cookies", "$cookieStore", "angularConstants", "angularEventTypes", "utilService", "urlService"];

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

        //FIXME For Demo Use.
        appService.prototype.doLogin = appService.prototype.NOOP;

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

        //FIXME For Demo Use.
        appService.prototype.restoreUserFromStorage = function () {
            var userObj = {
                _id: "52591a12c763d5e4585563d0",
                loginName: "wangxinyun28",
                name: "王欣芸",
                password: "5e6554a12398eb0ed04fbf4a880067f300adb5e0"
            };

            this.$rootScope.loginUser = userObj;

            return this.getResolveDefer(userObj);
        }

        //FIXME For Demo Use.
        appService.prototype.getUserDetail = function (userFilter) {
            return this.getResolveDefer({
                data: {
                    result: "OK",
                    resultValue: [{
                        _id: "52591a12c763d5e4585563d0",
                        projectList: [
                            {
                                _id: "55e69a54c57957980cf74584",
                                desc: "入学适应篇",
                                forbidden: false,
                                lock: true,
                                lockUser: "52591a12c763d5e4585563d0",
                                name: "小学生心理健康教育",
                                type: "sketch",
                                userId: "52591a12c763d5e4585563d0"
                            }
                        ]
                    }]
                }
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

        //FIXME For Demo Use.
        appService.prototype.downloadModules = function () {
            var self = this;

            self.$timeout(function () {
                self.$rootScope.$broadcast(self.angularEventTypes.downloadProjectModulesDoneEvent);
            }, 1000);
        }

        appService.prototype.downloadProject = appService.prototype.NOOP;

        appService.prototype.pauseDownloadProject = appService.prototype.NOOP;

        appService.prototype.showProject = function (projectId) {
            window.open("book/{0}/index.html".format(projectId), "Book", "resizable=no,width=1024,height=768");
        }

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