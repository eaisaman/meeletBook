define(
    ["angular"],
    function () {
        var appService = function ($rootScope, $http, $timeout, $q, $compile, $cookies, $cookieStore, angularConstants, angularEventTypes) {
            this.$rootScope = $rootScope;
            this.$http = $http;
            this.$timeout = $timeout;
            this.$q = $q;
            this.$compile = $compile;
            this.$cookies = $cookies;
            this.$cookieStore = $cookieStore;
            this.angularConstants = angularConstants;
            this.angularEventTypes = angularEventTypes;
        };

        appService.$inject = ["$rootScope", "$http", "$timeout", "$q", "$compile", "$cookies", "$cookieStore", "angularConstants", "angularEventTypes"];

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

        appService.prototype.cordovaPromise = function (functionName) {
            var self = this;

            function cordovaReady(fn) {

                var queue = [];

                var impl = function () {
                    queue.push(Array.prototype.slice.call(arguments));
                };

                document.addEventListener('deviceready', function () {
                    queue.forEach(function (args) {
                        fn.apply(this, args);
                    });
                    impl = fn;
                }, false);

                return function () {
                    return impl.apply(this, arguments);
                };
            };

            return function () {
                var defer = self.$q.defer();

                cordovaReady(function () {
                    cordova.exec(
                        function (result) {
                            defer.resolve(result);
                        },
                        function (err) {
                            defer.reject(err);
                        },
                        "NativeBridge", functionName, Array.prototype.slice.call(arguments));

                }).apply(self, Array.prototype.slice.call(arguments));

                return defer.promise;
            }
        }

        appService.prototype.getServerUrl = function () {
            var self = this;

            return this.cordovaPromise("getServerUrl").apply(this, Array.prototype.slice.call(arguments)).then(function (result) {
                var defer = self.$q.defer();

                var serverUrl = result && result.data.result == "OK" && result.data.resultValue;
                self.$timeout(
                    function () {
                        defer.resolve(serverUrl);
                    }
                );

                return defer.promise;

            });
        };

        appService.prototype.refreshUser = function (loginName) {
            var self = this;

            return self.cordovaPromise("refreshUser").apply(self, [loginName]).then(
                function () {
                    return self.restoreUserFromStorage();
                },
                function (err) {
                    return self.getRejectDefer(err);
                }
            );
        }

        //FIXME For Demo Use.
        appService.prototype.doLogin = appService.prototype.NOOP;

        appService.prototype.doLogout = function () {
            var self = this;

            return this.cordovaPromise("doLogout").apply(this, Array.prototype.slice.call(arguments)).then(
                function () {
                    var defer = self.$q.defer();

                    self.$timeout(function () {
                        for (var key in self.$rootScope.loginUser) {
                            delete self.$rootScope.loginUser[key];
                        }

                        defer.resolve();
                    });

                    return defer.promise;
                },
                function (err) {
                    return self.getRejectDefer(err);
                }
            );
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

        appService.prototype.getLocalProject = function () {
            return this.cordovaPromise("getLocalProject").apply(this, Array.prototype.slice.call(arguments));
        }

        appService.prototype.deleteLocalProject = function (projectIdList) {
            return this.cordovaPromise("deleteLocalProject").apply(this, [JSON.stringify(projectIdList || [])]);
        }

        appService.prototype.scanProjectCode = function () {
            return this.cordovaPromise("scanProjectCode").apply(this, Array.prototype.slice.call(arguments));
        }

        appService.prototype.checkProjectMode = function (projectIdList) {
            return this.cordovaPromise("checkProjectMode").apply(this, [JSON.stringify(projectIdList || [])]);
        }

        appService.prototype.getProject = function (projectFilter) {
            return this.cordovaPromise("getProject").apply(this, [JSON.stringify(projectFilter)]);
        }

        appService.prototype.downloadModules = function () {
            return this.cordovaPromise("downloadModules").apply(this, Array.prototype.slice.call(arguments));
        }

        appService.prototype.downloadProject = function (projectId) {
            return this.cordovaPromise("downloadProject").apply(this, Array.prototype.slice.call(arguments));
        }

        appService.prototype.pauseDownloadProject = function (projectId) {
            return this.cordovaPromise("pauseDownloadProject").apply(this, Array.prototype.slice.call(arguments));
        }

        appService.prototype.showProject = function (projectId) {
            return this.cordovaPromise("showProject").apply(this, Array.prototype.slice.call(arguments));
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