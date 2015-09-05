requirejs.config(
    {
        paths: {
            "chart": CHART_LIB_PATH + "Chart.min"
        },
        waitSeconds: 0
    }
);

define(
    [
            "chart"
    ],
    function () {
        return function () {
        }
    }
);