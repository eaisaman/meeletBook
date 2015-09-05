define(
    ["angular"],
    function () {
        return function (appModule, locations) {
            var needGoBack = true;

            var urlService = function ($location, $rootScope, $timeout, uiSVGService) {
                this.$location = $location;
                this.$rootScope = $rootScope;
                this.$timeout = $timeout;
                this.uiSVGService = uiSVGService;
                this.$rootScope.urlStack = [];
                this.locations = [];
                this.addLocation(locations);

                this.$rootScope.$on("$routeChangeStart", function (next, current) {
                    $('#loader').hasClass("show") && uiSVGService.hide("#loader").then(function () {
                        $('#loader').removeClass("show");
                    });
                });
            };

            urlService.$inject = ["$location", "$rootScope", "$timeout", "uiSVGService"];

            urlService.prototype.currentLocation = function () {
                if (this.$rootScope.urlStack.length) {
                    return this.$rootScope.urlStack[this.$rootScope.urlStack.length - 1].location;
                } else {
                    return "";
                }
            }
            urlService.prototype.back = function () {
                if (this.$rootScope.urlStack.length > 1) {
                    var urlObj = this.$rootScope.urlStack.pop();
                    delete this.$rootScope.urlParams[urlObj.location];

                    urlObj = this.$rootScope.urlStack[this.$rootScope.urlStack.length - 1];
                    urlObj.fn.apply(this, [urlObj.location, true, this.$rootScope.urlParams[urlObj.location]]);
                }
            }
            urlService.prototype.home = function (needLoad) {
                if (this.$rootScope.urlStack.length > 1) {
                    this.clearUrlStack(this.$rootScope.urlStack.length - 1);

                    if (needLoad == null || needLoad) {
                        var urlObj = this.$rootScope.urlStack[0];
                        urlObj.fn.apply(this, [urlObj.location, true, this.$rootScope.urlParams[urlObj.location]]);
                    }
                }
            }
            urlService.prototype.clearUrlStack = function (depth) {
                var self = this;

                depth = Math.min(depth || self.$rootScope.urlStack.length, self.$rootScope.urlStack.length);

                self.$rootScope.urlStack.slice(self.$rootScope.urlStack.length - depth, depth).forEach(function (urlObj) {
                    delete self.$rootScope.urlParams[urlObj.location];
                });

                self.$rootScope.urlStack.splice(self.$rootScope.urlStack.length - depth, depth);
            }
            urlService.prototype.route = function (location, skipUrlTrack, urlParams) {
                var self = this;

                self.$rootScope.step = location;
                self.$rootScope.urlParams = self.$rootScope.urlParams || {};
                urlParams = urlParams || {};
                if (urlParams !== self.$rootScope.urlParams[location])
                    self.$rootScope.urlParams[location] = _.clone(urlParams);
                if (needGoBack && (skipUrlTrack == null || !skipUrlTrack)) {
                    var locationAlreadyExists = false;

                    if (self.$rootScope.urlStack.length) {
                        var urlObj = self.$rootScope.urlStack[self.$rootScope.urlStack.length - 1];
                        locationAlreadyExists = urlObj.location === location;
                    }

                    !locationAlreadyExists && self.$rootScope.urlStack.push({fn: arguments.callee, location: location});
                }

                $('#loader').addClass("show");
                self.uiSVGService.show("#loader", {
                    speedIn: 300,
                    easingIn: mina.easeinout
                }, ["M -18 -26.90625 L -18 86.90625 L 98 86.90625 L 98 -26.90625 L -18 -26.90625 Z M 40 29.96875 C 40.01804 29.96875 40.03125 29.98196 40.03125 30 C 40.03125 30.01804 40.01804 30.03125 40 30.03125 C 39.98196 30.03125 39.96875 30.01804 39.96875 30 C 39.96875 29.98196 39.98196 29.96875 40 29.96875 Z"]).then(function () {
                    self.$location.path(location);
                });
            }
            urlService.prototype.addLocation = function (location) {
                var self = this,
                    arr;

                if (location) {
                    if (toString.call(location) == '[object Array]') {
                        arr = location;
                    } else if (typeof location === 'string') {
                        arr = [location];
                    }
                    arr = _.difference(arr, self.locations);
                    self.locations = Array.prototype.concat.apply(self.locations, arr);

                    arr.forEach(function (loc) {
                        self[loc] = self[loc] || function () {
                                var args = Array.prototype.slice.apply(arguments);
                                args.splice(0, 0, loc);
                                urlService.prototype.route.apply(self, args);
                            }
                    });
                }
            }
            urlService.prototype.firstPage = function () {
                this.locations.length && this[this.locations[0]]();
            }

            appModule.
                config(["$provide", function ($provide) {
                    $provide.service('urlService', urlService);
                }]).
                config(["$routeProvider", function ($routeProvider) {
                    locations.forEach(function (loc) {
                        $routeProvider.when("/" + loc, {templateUrl: loc + ".html"});
                    });
                    return $routeProvider.otherwise({redirectTo: "/"});
                }]);
        }
    });