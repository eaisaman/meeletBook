requirejs.config(
    {
        paths: {
            "jquery.easing": JQUERY_UI_PLUGINS_LIB_PATH + "jquery.easing/1.3/jquery.easing.min"
        },
        shim: {
            "jquery.easing": {deps: ["jquery-ui-lib"]}
        },
        waitSeconds: 0
    }
);

define(
    [
        "jquery.easing"
    ],
    function () {

        return function () {
        }
    }
);