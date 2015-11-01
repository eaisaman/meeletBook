requirejs.config(
    {
        paths: {
            "bootstrap": BOOTSTRAP_LIB_PATH + "bootstrap.min"
        },
        waitSeconds: 0
    }
);

define(
    [
            "bootstrap"
    ],
    function () {
        return function () {
        }
    }
);