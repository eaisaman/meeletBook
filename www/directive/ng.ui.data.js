define(
    ["angular", "jquery"],
    function () {
        return function (appModule) {
            var inject = ["$exceptionHandler"];

            appModule.directive("uiData", _.union(inject, [function ($exceptionHandler) {
                'use strict';

                return {
                    restrict: "A",
                    scope: false,
                    replace: false,
                    transclude: false,
                    link: function (scope, element, attrs) {
                        var expr = attrs.uiData;
                        if (expr) {
                            try {
                                var data = scope.$eval(expr),
                                    props = _.pairs(data),
                                    $element = $(element);

                                _.each(props, function (prop) {
                                    $element.data(prop[0], prop[1]);
                                });
                            } catch (err) {
                                $exceptionHandler(err);
                            }
                        }
                    }
                }
            }]));
        }
    }
);