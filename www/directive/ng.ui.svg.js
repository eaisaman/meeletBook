define(
    ["angular-lib", "jquery-lib", "snap-svg-lib"],
    function () {
        var SVGAnimation = function ($log, $compile, $parse, $timeout, $q, $exceptionHandler, uiUtilService, angularConstants, angularEventTypes) {
                this.$log = $log;
                this.$compile = $compile;
                this.$parse = $parse;
                this.$timeout = $timeout;
                this.$q = $q;
                this.$exceptionHandler = $exceptionHandler;
                this.uiUtilService = uiUtilService;
                this.angularConstants = angularConstants;
                this.angularEventTypes = angularEventTypes;
            },
            defaults = {
                speedIn: 500,
                speedOut: 500,
                easingIn: mina.linear,
                easingOut: mina.linear
            };

        SVGAnimation.$inject = ["$log", "$compile", "$parse", "$timeout", "$q", "$exceptionHandler", "uiUtilService", "angularConstants", "angularEventTypes"];

        SVGAnimation.prototype.init = function (element, options, openingSteps, closingSteps) {
            if (element) {
                var $el;

                if (element.jquery) {
                    $el = element;
                } else if (typeof element === "string" || angular.isElement(element)) {
                    $el = $(element);
                }

                if ($el.length) {
                    var animationPath = $el.data("animationPath");
                    if (!animationPath) {
                        var s = Snap($el.find("svg").get(0)),
                            animationPath = _.extend(s.select("path"), {attachedObj: {}});

                        animationPath.attachedObj.initialPath = animationPath.attr('d');
                        $el.data("animationPath", animationPath);
                    }
                    options = _.extend({}, defaults, animationPath.attachedObj.options, options);
                    animationPath.attachedObj.options = options;
                    animationPath.attachedObj.openingSteps = openingSteps || animationPath.openingSteps;
                    animationPath.attachedObj.closingSteps = closingSteps || animationPath.closingSteps || [animationPath.attachedObj.initialPath];

                    return animationPath;
                }
            }
        }

        SVGAnimation.prototype.show = function (element, options, openingSteps) {
            var self = this;

            if (element) {
                var animationPath = self.init(element, options, openingSteps, null);

                if (animationPath) {
                    var steps = animationPath.attachedObj.openingSteps,
                        speed = animationPath.attachedObj.options.speedIn,
                        easing = animationPath.attachedObj.options.easingIn,
                        stepsTotal = steps && steps.length || 0,
                        defer = self.$q.defer();

                    (function nextStep(pos) {
                        if (pos <= stepsTotal - 1) {
                            animationPath.animate({'path': steps[pos]}, speed, easing, function () {
                                nextStep(pos);
                            });
                            pos++;
                        } else {
                            defer.resolve();
                        }
                    })(0);

                    return defer.promise;
                }
            }

            return self.uiUtilService.getResolveDefer();
        }

        SVGAnimation.prototype.hide = function (element, options, closingSteps) {
            var self = this;

            if (element) {
                var animationPath = self.init(element, options, null, closingSteps);

                if (animationPath) {
                    var steps = animationPath.attachedObj.closingSteps,
                        speed = animationPath.attachedObj.options.speedOut,
                        easing = animationPath.attachedObj.options.easingOut,
                        stepsTotal = steps && steps.length || 0,
                        defer = self.$q.defer();

                    (function nextStep(pos) {
                        if (pos <= stepsTotal - 1) {
                            animationPath.animate({'path': steps[pos]}, speed, easing, function () {
                                nextStep(pos);
                            });
                            pos++;
                        } else {
                            animationPath.attr('d', animationPath.attachedObj.initialPath);

                            defer.resolve();
                        }
                    })(0);

                    return defer.promise;
                }
            }

            return self.uiUtilService.getResolveDefer();
        }

        return function (appModule) {
            appModule.
                config(["$provide", function ($provide) {
                    $provide.service('uiSVGService', SVGAnimation);
                }]);
        };
    }
);