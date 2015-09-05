requirejs.config(
    {
        paths: {
            "app-route": APP_LIB_PATH + "route",
            "app-util": APP_LIB_PATH + "util",
            "app-filter": APP_LIB_PATH + "filter",
            "app-service": APP_LIB_PATH + (window.cordova && "embedded/service" || "browser/service"),
            "app-controller": APP_LIB_PATH + "controller",
            "text": APP_LIB_PATH + "requirejs-plugins/text",
            "json": APP_LIB_PATH + "requirejs-plugins/json"
        },
        shim: {
            "app-service": {deps: ["app-util"]}
        }
    }
);

define(
    ["json!" + APP_LIB_PATH + "meta.json", "ng.ui.extension", "app-route", "app-util", "app-filter", "app-service", "app-controller"],
    function (meta, extension) {
        var extension = arguments[1],
            routeConfig = arguments[2],
            appConfigs = Array.prototype.slice.call(arguments, 3);

        return function (appModule, callback) {
            //Configure route
            var locations = meta.locations;
            routeConfig(appModule, locations);

            //Load app relevant controller, filter, service, etc.
            appConfigs && appConfigs.forEach(function (config) {
                config(appModule, extension);
            });

            callback && callback();
        }
    }
);