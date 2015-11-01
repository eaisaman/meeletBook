requirejs.config(
    {
        paths: {
            "edge": EDGE_LIB_PATH + "edge.6.0.0.min"
        },
        waitSeconds: 0
    }
);

define(
    [
        "edge"
    ],
    function () {
        return function () {
        }
    }
);