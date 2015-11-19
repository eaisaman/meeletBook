requirejs.config(
    {
        paths: {
            "edge": EDGE_LIB_PATH + "edge.5.0.1"
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