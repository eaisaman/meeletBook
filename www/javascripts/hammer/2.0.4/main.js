requirejs.config(
    {
        paths: {
            "hammer": HAMMER_LIB_PATH + "hammer.min"
        },
        waitSeconds: 0
    }
);

define(
    [
            "hammer"
    ],
    function (hammer) {
        window.Hammer = hammer;

        return function () {
        }
    }
);