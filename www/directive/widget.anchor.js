define(
    ["angular", "jquery"],
    function () {
        return function (appModule) {
            var inject = ["$compile", "$templateCache", "angularConstants", "uiUtilService"];

            appModule.directive("widgetAnchor", _.union(inject, [function ($compile, $templateCache, angularConstants, uiUtilService) {
                'use strict';

                return {
                    restrict: "A",
                    scope: {},
                    replace: false,
                    transclude: false,
                    link: function (scope, element, attrs) {
                        var anchor = attrs.widgetAnchor;
                        if (anchor) {
                            var $element = $(element),
                                $parent = $element.closest("." + angularConstants.widgetClasses.widgetContainerClass).parent(),
                                widgetId = $parent.attr("id");

                            if (widgetId) {
                                var templateId = "Template_" + widgetId,
                                    html = $templateCache.get(templateId),
                                    $html = $(html);

                                var $template = $html.filter("[target-anchor='{0}']".format(anchor));
                                $template.children().each(function() {
                                    if (!element.find("#" + this.id).length) {
                                        element.append(this);
                                    }
                                });
                                $compile(element.contents())(scope);
                            }
                        }
                    }
                }
            }]));
        }
    }
);