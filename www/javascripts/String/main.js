requirejs.config(
    {
        paths: {
            "string": STRING_LIB_PATH + "String.min"
        },
        waitSeconds: 0
    }
);

define(
    [
        "string"
    ],
    function () {
        return function () {
        }
    }
);