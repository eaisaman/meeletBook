define(
    ["angular", "hammer"],
    function () {
        return function (appModule) {
            var HGESTURES = {
                    hmDoubleTap: 'doubletap',
                    hmDragstart: 'dragstart',
                    hmDrag: 'drag',
                    hmDragUp: 'dragup',
                    hmDragDown: 'dragdown',
                    hmDragLeft: 'dragleft',
                    hmDragRight: 'dragright',
                    hmDragend: 'dragend',
                    hmHold: 'hold',
                    hmPinch: 'pinch',
                    hmPinchIn: 'pinchin',
                    hmPinchOut: 'pinchout',
                    hmPress: 'press',
                    hmRelease: 'release',
                    hmRotate: 'rotate',
                    hmSwipe: 'swipe',
                    hmSwipeUp: 'swipeup',
                    hmSwipeDown: 'swipedown',
                    hmSwipeLeft: 'swipeleft',
                    hmSwipeRight: 'swiperight',
                    hmTap: 'tap',
                    hmPan: 'pan',
                    hmPanStart: 'panstart',
                    hmPanEnd: 'panend',
                    hmTouch: 'touch',
                    hmTransformstart: 'transformstart',
                    hmTransform: 'transform',
                    hmTransformend: 'transformend'
                },
                VERBOSE = false;

            angular.forEach(HGESTURES, function (eventName, directiveName) {
                appModule.directive(
                    directiveName,
                    ['$parse', '$log', '$timeout', function ($parse, $log, $timeout) {
                        return function (scope, element, attr) {
                            var hammertime, handler;
                            attr.$observe(directiveName, function (value) {
                                var fn = $parse(value);
                                var opts = $parse(attr[directiveName + 'Opts'])
                                (scope, {});
                                hammertime = new Hammer(element[0], opts);
                                handler = function (event) {
                                    if (VERBOSE) {
                                        $log.debug('hammer-gestures: %s',
                                            eventName);
                                    }
                                    if (!event.currentTarget)
                                        event.currentTarget = element[0];
                                    $timeout(function () {
                                        fn(scope, { $event: event });
                                    });
                                };
                                hammertime.on(eventName, handler);
                            });
                            scope.$on('$destroy', function () {
                                hammertime.off(eventName, handler);
                            });
                        };
                    }]);
            });
        }
    }
);