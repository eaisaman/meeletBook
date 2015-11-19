define(
    ["angular", "jquery"],
    function () {
        return function (appModule) {
            var inject = [];

            appModule.directive("uiIncludeReplace", _.union(inject, [function () {
                'use strict';

                return {
	                require: 'ngInclude',
                    restrict: "A",
                    scope: {},
                    replace: true,
                    transclude: false,
                    link: function (scope, element, attrs) {
                        element.replaceWith(element.children());
                    }
                }
            }]));
        }
    }
);