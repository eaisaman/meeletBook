define(
    ["angular", "jquery"],
    function () {
        return function (appModule, extension, opts) {
            var inject = ["$rootScope", "$timeout", "$q", "$exceptionHandler", "urlService", "uiUtilService"];

            appModule.directive("uiMobileTopbar", _.union(inject, [function ($rootScope, $timeout, $q, $exceptionHandler, urlService, uiUtilService) {
                'use strict';

                var defaults = {},
                    options = angular.extend(defaults, opts),
                    injectObj = _.object(inject, Array.prototype.slice.call(arguments));

                return {
                    restrict: "A",
                    scope: {
                    },
                    replace: false,
                    transclude: true,
                    templateUrl: "include/_mobile_topbar.html",
                    compile: function (element, attrs) {
                        return {
                            pre: function (scope, element, attrs) {
                                extension && extension.attach && extension.attach(scope, _.extend(injectObj, {
                                    element: element,
                                    scope: scope
                                }));

                                scope.urlService = urlService;
                            },
                            post: function (scope, element, attrs) {
                            }
                        }
                    }
                }
            }]));
        }
    }
);