requirejs.config(
    {
        paths: {
            "app-filter": APP_LIB_PATH + "filter",
            "app-controller": APP_LIB_PATH + "controller",
            "date": APP_LIB_PATH + "date"
        },
        waitSeconds: 0
    }
);

define(
    ["app-extension", "date", "json!joinItem.json", "app-filter", "app-controller"],
    function (extension, datejs, joinItem) {
        var appConfigs = Array.prototype.slice.call(arguments, 3);

        return function (appModule, callback) {
            if (isBrowser) {
                appConfigs.forEach(function (config) {
                    config(appModule, extension, joinItem);
                });
            }

            callback && callback();
        }
    }
);