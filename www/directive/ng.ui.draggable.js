define(
    ["angular", "jquery", "hammer"],
    function () {
        return function (appModule, extension, opts) {
            var DIRECTIVE = "uiDraggable";
            var VERBOSE = true;

            var DIRECTION_NONE = 1;
            var DIRECTION_LEFT = 2;
            var DIRECTION_RIGHT = 4;
            var DIRECTION_UP = 8;
            var DIRECTION_DOWN = 16;

            var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
            var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
            var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

            var directionOpt = {
                    'horizontal': DIRECTION_HORIZONTAL,
                    'vertical': DIRECTION_VERTICAL,
                    'all': DIRECTION_ALL
                },
                defaults = {
                    onceId: "draggable.dragHandler.handler",
                    scaleSetting: "sketchWidgetSetting.scale"
                },
                options = _.extend(defaults, opts);

            appModule.directive(
                DIRECTIVE,
                ['$parse', '$log', '$timeout', '$q', '$exceptionHandler', 'angularConstants', 'uiUtilService', function ($parse, $log, $timeout, $q, $exceptionHandler, angularConstants, uiUtilService) {
                    return function (scope, element, attr) {
                        var mc, dragHandler;

                        function registerHandlers(opts) {
                            mc = element.data("hammer");

                            if (!mc) {
                                mc = new Hammer.Manager(element[0]);
                            }
                            mc.add(new Hammer.Pan(_.extend({}, opts)));

                            dragHandler = function (event) {
                                function handler(event) {
                                    var defer = $q.defer();

                                    $timeout(function () {
                                        if (VERBOSE) {
                                            $log.debug(event.type);
                                        }

                                        if (!event.currentTarget)
                                            event.currentTarget = element[0];

                                        var $u = $(element[0]),
                                            target = event.srcEvent.target;

                                        if (target.id && $u.has("#" + target.id)) {
                                            $u = $(target);
                                        }

                                        var widget = $u.data("widgetObject"),
                                            touchX = $u.data("touchX"),
                                            touchY = $u.data("touchY");
                                        if (!widget || !widget.zoomed) {
                                            if (event.type === "panstart") {
                                                touchX = event.srcEvent.clientX - $u.parent().offset().left;
                                                touchY = event.srcEvent.clientY - $u.parent().offset().top;
                                                $u.data("touchX", touchX);
                                                $u.data("touchY", touchY);
                                            } else if (event.type === "panmove") {
                                                if (touchX != undefined && touchY != undefined) {
                                                    if (opts.direction & DIRECTION_VERTICAL) {
                                                        var moveY = event.srcEvent.clientY - ($u.parent().offset().top + touchY),
                                                            maxHeight = $u.parent().height(),
                                                            height = $u.height(),
                                                            ftTop,
                                                            top;

                                                        var m = ($u.css("top") || "").match(/([-\d\.]+)px$/);
                                                        if (m && m.length == 2)
                                                            ftTop = Math.floor(parseFloat(m[1]) * angularConstants.precision) / angularConstants.precision;
                                                        else
                                                            ftTop = Math.floor(($u.offset().top - $u.parent().offset().top) * angularConstants.precision) / angularConstants.precision;
                                                        top = ftTop + moveY;

                                                        if (widget && scope.scale) {
                                                            ftTop = $u.offset().top - $u.parent().offset().top;
                                                            top = ftTop + moveY;
                                                            maxHeight *= scope.scale;
                                                            height *= scope.scale;
                                                        }

                                                        if (top + height / 2 < 0)
                                                            top = -height / 2;
                                                        else if (top + height / 2 > maxHeight)
                                                            top = maxHeight - height / 2;

                                                        if (widget && scope.scale)
                                                            top = Math.floor(top / scope.scale * angularConstants.precision) / angularConstants.precision;
                                                        else
                                                            top = Math.floor(top * angularConstants.precision) / angularConstants.precision;

                                                        touchY += moveY;
                                                        event.moveY = top - ftTop;

                                                        if (widget) {
                                                            widget.css("top", top + "px");
                                                        } else {
                                                            $u.css("top", top + "px");
                                                        }

                                                        if (VERBOSE) {
                                                            $log.debug("top:" + top);
                                                            $log.debug("touchY:" + touchY);
                                                        }
                                                    }

                                                    if (opts.direction & DIRECTION_HORIZONTAL) {
                                                        var moveX = event.srcEvent.clientX - ($u.parent().offset().left + touchX),
                                                            maxWidth = $u.parent().width(),
                                                            width = $u.width(),
                                                            ftLeft,
                                                            left;

                                                        var m = ($u.css("left") || "").match(/([-\d\.]+)px$/);
                                                        if (m && m.length == 2)
                                                            ftLeft = Math.floor(parseFloat(m[1]) * angularConstants.precision) / angularConstants.precision;
                                                        else
                                                            ftLeft = Math.floor(($u.offset().left - $u.parent().offset().left) * angularConstants.precision) / angularConstants.precision;
                                                        left = ftLeft + moveX;

                                                        if (widget && scope.scale) {
                                                            ftLeft = $u.offset().left - $u.parent().offset().left;
                                                            left = ftLeft + moveX;
                                                            maxWidth *= scope.scale;
                                                            width *= scope.scale;
                                                        }

                                                        if (left + width / 2 < 0)
                                                            left = -width / 2;
                                                        else if (left + width / 2 > maxWidth)
                                                            left = maxWidth - width / 2;

                                                        if (widget && scope.scale)
                                                            left = Math.floor(left / scope.scale * angularConstants.precision) / angularConstants.precision;
                                                        else
                                                            left = Math.floor(left * angularConstants.precision) / angularConstants.precision;

                                                        touchX += moveX;
                                                        event.moveX = left - ftLeft;

                                                        if (widget) {
                                                            widget.css("left", left + "px");
                                                        } else {
                                                            $u.css("left", left + "px");
                                                        }

                                                        if (VERBOSE) {
                                                            $log.debug("left:" + left);
                                                            $log.debug("touchX:" + touchX);
                                                        }
                                                    }

                                                    $u.data("touchX", touchX);
                                                    $u.data("touchY", touchY);
                                                }
                                            } else {
                                                $u.removeData("touchX");
                                                $u.removeData("touchY");
                                            }

                                            touchX != undefined && touchY != undefined && fn(scope, {$event: event});
                                        }

                                        defer.resolve();
                                    });

                                    return defer.promise;
                                }

                                handler.onceId = options.onceId;

                                uiUtilService.once(handler, null, angularConstants.unresponsiveInterval)(event);
                            };

                            mc.on("panstart panmove panend", dragHandler);
                        }

                        function unregisterHandlers() {
                            mc = element.data("hammer");

                            if (mc) {
                                mc.off("panstart panmove panend", dragHandler);
                            }
                        }

                        attr.$observe(DIRECTIVE, function (value) {
                            var fn = $parse(value),
                                opts = $parse(attr[DIRECTIVE + 'Opts'])(scope, {});

                            opts.direction = directionOpt[opts.direction || 'all'] || DIRECTION_ALL;
                            options = _.extend(_.clone(options), opts)
                            scope.$watch(options.scaleSetting, function (value) {
                                scope.scale = value;
                            });

                            registerHandlers(opts);
                        });

                        scope.$on('$destroy', function () {
                            unregisterHandlers();
                        });
                    };
                }]);
        }
    }
);