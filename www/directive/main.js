requirejs.config(
    {
        paths: {
            "ng.ui.util": DIRECTIVE_LIB_PATH + "ng.ui.util",
            "ng.ui.svg": DIRECTIVE_LIB_PATH + "ng.ui.svg",
            "ng.ui.extension": DIRECTIVE_LIB_PATH + "ng.ui.extension",
            "ng.ui.hammer-gestures": DIRECTIVE_LIB_PATH + "ng.ui.hammer-gestures",
            "ng.ui.draggable": DIRECTIVE_LIB_PATH + "ng.ui.draggable",
            "widget.anchor": DIRECTIVE_LIB_PATH + "widget.anchor",
            "ng.ui.multi-transclude": DIRECTIVE_LIB_PATH + "ng.ui.multi-transclude",
            "ng.ui.modal-window": DIRECTIVE_LIB_PATH + "ng.ui.modal-window",
            "ng.ui.mobile-topbar": DIRECTIVE_LIB_PATH + "ng.ui.mobile-topbar"
        }
    }
);


define([
        "ng.ui.util",
        "ng.ui.svg",
        "ng.ui.extension",
        "ng.ui.hammer-gestures",
        "ng.ui.draggable",
        "widget.anchor",
        "ng.ui.multi-transclude",
        "ng.ui.modal-window",
        "ng.ui.mobile-topbar"
    ],
    function () {
        var utilConfig = arguments[0],
            svgConfig = arguments[1],
            extension = arguments[2],
            directiveConfigs = Array.prototype.slice.call(arguments, 3);

        return function (appModule) {
            utilConfig(appModule);

            svgConfig(appModule);

            //Hammer gestures
            directiveConfigs[0](appModule);

            //Draggable directive
            directiveConfigs[1](appModule);

            //widget-anchor directive
            directiveConfigs[2](appModule);

            //Multitransclude
            directiveConfigs[3](appModule, extension);

            //Modal window
            directiveConfigs[4](appModule, extension);

            //Toolbar
            directiveConfigs[5](appModule, extension);
        }
    }
);