requirejs.config(
    {
        paths: {
            "jquery": JQUERY_LIB_PATH + "jquery.min"
        },
        waitSeconds: 0
    }
);

define(
    [
            "jquery"
    ],
    function () {
        return function () {
        }
    }
);