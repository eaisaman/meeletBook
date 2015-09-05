requirejs.config(
    {
        paths: {
            "ng-flow": ANGULAR_MODULES_LIB_PATH + "ng-flow/2.5.1/ng-flow-standalone.min"
        },
        shim: {
            "ng-flow": {deps: ["angular-lib"]}
        },
        waitSeconds: 0
    }
);

define(
    [
        "ng-flow"
    ],
    function () {
        return function (appModule) {
        }
    }
);