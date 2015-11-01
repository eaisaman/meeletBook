requirejs.config(
    {
        paths: {
            "widget.anchor": DIRECTIVE_LIB_PATH + "widget.anchor",
            "ng.ui.data": DIRECTIVE_LIB_PATH + "ng.ui.data",
            "ng.ui.multi-transclude": DIRECTIVE_LIB_PATH + "ng.ui.multi-transclude",
            "ng.ui.modal-window": DIRECTIVE_LIB_PATH + "ng.ui.modal-window",
            "ng.ui.sidebar": DIRECTIVE_LIB_PATH + "ng.ui.sidebar"
        }
    }
);

define([
        "app-extension",
        "widget.anchor",
        "ng.ui.data",
        "ng.ui.multi-transclude",
        "ng.ui.modal-window",
        "ng.ui.sidebar"
    ],
    function () {
        var extension = arguments[0],
            directiveConfigs = Array.prototype.slice.call(arguments, 1);

        return function (appModule) {
            //widget-anchor directive
            directiveConfigs[0](appModule, extension);

            //Data directive
            directiveConfigs[1](appModule, extension);

            //Multi transclude directive
            directiveConfigs[2](appModule, extension);

            //Modal window directive
            directiveConfigs[3](appModule, extension);

            //Side bar directive
            directiveConfigs[4](appModule, extension);
        }
    }
);