requirejs.config(
    {
        paths: {
            "snap.svg": SNAP_SVG_LIB_PATH + "snap.svg-min"
        },
        waitSeconds: 0
    }
);

define(
    [
            "snap.svg"
    ],
    function () {
        return function () {
        }
    }
);