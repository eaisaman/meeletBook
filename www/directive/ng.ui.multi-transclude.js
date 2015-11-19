define(
    ["angular-lib", "jquery-lib"],
    function () {
        return function (appModule) {

            appModule.controller('uiMultiTranscludeController', ['$scope', '$transclude', '$q', '$timeout', 'angularConstants', 'utilService', function ($scope, $transclude, $q, $timeout, angularConstants, utilService) {
                this.transclude = function (name, element) {
                    $transclude && $transclude(function (clone) {
                        for (var i = 0; i < clone.length; ++i) {
                            var el = angular.element(clone[i]);
                            if (el.attr('name') === name) {
                                utilService.whilst(
                                    function () {
                                        return !el.scope();
                                    }, function (err) {
                                        var defer = $q.defer();

                                        if (!err) {
                                            $timeout(function () {
                                                element.append(el);

                                                defer.resolve();
                                            });
                                        } else {
                                            $timeout(function () {
                                                defer.reject(err);
                                            });
                                        }

                                        return defer.promise;
                                    },
                                    angularConstants.checkInterval,
                                    "ui-multi-transclude.{0}-{1}".format(name, _.now()),
                                    angularConstants.renderTimeout
                                );
                                return;
                            }
                        }
                    });
                }
            }]);

            appModule.directive('uiMultiTransclude', function () {
                return {
                    scope: false,
                    controller: "uiMultiTranscludeController",
                    link: function (scope, element, attrs, ctrl) {
                        // Receive transcluded content.
                        ctrl.transclude(attrs.uiMultiTransclude, element);
                    }
                };
            });

        }
    }
);