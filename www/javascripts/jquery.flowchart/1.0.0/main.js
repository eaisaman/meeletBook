requirejs.config(
    {
        paths: {
            "jquery.flowchart": JQUERY_FLOWCHART_LIB_PATH + "jquery.flowchart.min"
        },
        shim: {
            "jquery.flowchart": {exports: "flowChart", deps: ["flowchart-lib", "jquery-lib"]}
        },
        waitSeconds: 0
    }
);

define(
    [
        "jquery.flowchart"
    ],
    function () {
        return function () {
        }
    }
);