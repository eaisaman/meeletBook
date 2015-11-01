requirejs.config(
    {
        paths: {
            "fabric": FABRIC_LIB_PATH + "fabric.require"
        },
        waitSeconds: 0
    }
);

define(
    [
        "fabric"
    ],
    function (flowchart) {

        return function () {
        }
    }
);