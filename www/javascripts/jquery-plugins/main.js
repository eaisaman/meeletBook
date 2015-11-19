requirejs.config(
    {
        paths: {
            "sly": JQUERY_PLUGINS_LIB_PATH + "sly/1.6.1/sly"
        },
        shim: {
            "sly": {deps: ["jquery-lib"]}
        },
        waitSeconds: 0
    }
);

define(
    [
        "sly"
    ],
    function () {
        [].forEach(function () {
            }
        );

        return function () {
        }
    }
);