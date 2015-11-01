requirejs.config(
    {
        paths: {
            "modernizr": MODERNIZR_LIB_PATH + "modernizr.custom.63321"
        },
        shim: {
            "modernizr": {
                exports: 'Modernizr'
            }
        },
        waitSeconds: 0
    }
);

define(
    [
        "modernizr"
    ],
    function () {
        return function () {
        }
    }
);