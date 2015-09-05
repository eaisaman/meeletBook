requirejs.config(
    {
        paths: {
            "marked": MARKED_LIB_PATH + "marked.min"
        },
        waitSeconds: 0
    }
);

define(
    [
        "marked"
    ],
    function (marked) {
        window.marked = marked;

        return function () {
        }
    }
);