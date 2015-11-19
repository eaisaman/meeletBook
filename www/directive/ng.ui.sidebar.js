define(
    ["angular-lib", "jquery-lib"],
    function () {
        return function (appModule, extension, opts) {
            var inject = ["$rootScope", "$http", "$timeout", "$q", "$exceptionHandler", "$parse", "$compile", "angularConstants", "angularEventTypes", "utilService"];

            appModule.directive("uiSidebar", _.union(inject, [function ($rootScope, $http, $timeout, $q, $exceptionHandler, $parse, $compile, angularConstants, angularEventTypes, utilService) {
                'use strict';

                var injectObj = _.object(inject, Array.prototype.slice.call(arguments));

                return {
                    restrict: "A",
                    scope: {
                        /* Valid transitions include 'slideInOnTop', 'reveal', 'slideAlong', 'reverseSlideOut', 'scaleDownPusher',
                         * 'scaleUp', 'scaleRotatePusher', 'openDoor', 'fallDown', 'rotatePusher', 'rotateIn3D', 'rotateOut3D', 'delayed3DRotate'
                         * */
                        transition: "@",
                        side: "@",//Support 'leftSide', 'rightSide'
                        overlay: "@"//Support 'overlay', ''. Whether add overlay shadow when the side bar is open.
                    },
                    replace: true,
                    transclude: true,
                    templateUrl: "include/_sidebar.html",
                    compile: function (element, attrs) {
                        return {
                            pre: function (scope, element, attrs, ctrl) {
                                extension && extension.attach && extension.attach(scope, _.extend(injectObj, {
                                    element: element,
                                    scope: scope
                                }));

                                scope.toggleSideBar = function (event, state) {
                                    return scope.toggleSelect("> .sideBarContainer", event, state);
                                }
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