define(
    ["angular", "jquery"],
    function () {
        return function (appModule) {
            var inject = ["$parse", "$compile"],
                directiveName = "uiLink";

            appModule.directive(directiveName, _.union(inject, [function ($parse) {
                'use strict';

                return {
                    restrict: "A",
                    scope: {
                        base: "@"
                    },
                    replace: false,
                    transclude: false,
                    link: function (scope, element, attr) {
                        attr.$observe(directiveName, function (value) {
                            var relativeUrl = $parse(value)(scope) || "";

                            element.attr("href", "{0}{1}".format(scope.base || scope.$root.APP_PROJECT_PATH || "", relativeUrl));
                        });
                    }
                }
            }]));
        }
    }
);
