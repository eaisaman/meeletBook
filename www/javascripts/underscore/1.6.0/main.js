requirejs.config(
    {
        paths: {
            "underscore": UNDERSCORE_LIB_PATH + "underscore-min"
        },
        waitSeconds: 0
    }
);

define(
    [
            "underscore"
    ],
    function () {
        return function () {
        }
    }
);