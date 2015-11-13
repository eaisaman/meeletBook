requirejs.config(
    {
        paths: {
            "angular": ANGULAR_LIB_PATH + "angular",
            "angular-animate": ANGULAR_LIB_PATH + "angular-animate.min",
            "angular-cookies": ANGULAR_LIB_PATH + "angular-cookies.min",
            "angular-route": ANGULAR_LIB_PATH + "angular-route.min",
            "angular-sanitize": ANGULAR_LIB_PATH + "angular-sanitize.min",
            "angular-touch": ANGULAR_LIB_PATH + "angular-touch.min"
        },
        shim: {
            "angular": {exports: "angular"},
            "angular-animate": {deps: ["angular"]},
            "angular-cookies": {deps: ["angular"]},
            "angular-route": {deps: ["angular"]},
            "angular-sanitize": {deps: ["angular"]},
            "angular-touch": {deps: ["angular"]}
        },
        waitSeconds: 0
    }
);

define(
    [
            "angular",
            "angular-animate",
            "angular-cookies",
            "angular-route",
            "angular-sanitize",
            "angular-touch"
    ],
    function () {
        return function () {
        }
    }
);