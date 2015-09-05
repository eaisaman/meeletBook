requirejs.config(
    {
        paths: {
            "flowchart": FLOWCHART_LIB_PATH + "flowchart.amd-1.4.0.min"
        },
        shim: {
            "flowchart": {
                deps: ["raphael-lib"]
            }
        },
        waitSeconds: 0
    }
);

define(
    [
        "flowchart"
    ],
    function (flowchart) {
        window.flowchart = flowchart;

        return function () {
        }
    }
);