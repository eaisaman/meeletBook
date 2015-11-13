requirejs.config(
    {
        paths: {
            "pomeloclient": POMELO_LIB_PATH + "pomeloclient",
            "socket.io": POMELO_LIB_PATH + "socket.io"
        },
        shim: {},
        waitSeconds: 0
    }
);

define(
    [
        "pomeloclient", "socket.io"
    ],
    function () {
        return function () {
        }
    }
);