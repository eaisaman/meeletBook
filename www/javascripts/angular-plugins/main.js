requirejs.config(
    {
        paths: {
            "angular-ui-tree": ANGULAR_PLUGINS_LIB_PATH + "angular-ui-tree"
        },
        shim: {
            "angular-ui-tree": {deps: ["angular-lib"]}
        },
        waitSeconds: 0
    }
);

define(
    [
        "angular-ui-tree"
    ],
    function () {
        if (isBrowser) {
            var directiveConfigs = Array.prototype.slice.call(arguments);

            return function (appModule) {
                directiveConfigs.forEach(function (config) {
                    config(appModule);
                });
            }
        }
    }
);