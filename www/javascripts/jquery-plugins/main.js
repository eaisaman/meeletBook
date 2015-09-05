requirejs.config(
    {
        paths: {
            "icheck": JQUERY_PLUGINS_LIB_PATH + "icheck/1.0.2/icheck.min",
            "sly": JQUERY_PLUGINS_LIB_PATH + "sly/1.2.7/sly",
            "knob": JQUERY_PLUGINS_LIB_PATH + "knob/1.2.11/jquery.knob"
        },
        shim: {
            "icheck": {deps: ["jquery-lib"]},
            "sly": {deps: ["jquery-lib"]},
            "knob": {deps: ["jquery-lib"]}
        },
        waitSeconds: 0
    }
);

define(
    [
        "icheck", "sly", "knob"
    ],
    function () {
        [
            JQUERY_PLUGINS_LIB_PATH + "icheck/1.0.2/skins/" + "all.css"
        ].forEach(function (href) {
                var link = window.document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = href;
                window.document.getElementsByTagName("head")[0].appendChild(link);
            }
        );

        return function () {
        }
    }
);