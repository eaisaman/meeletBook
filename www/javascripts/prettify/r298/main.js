requirejs.config(
    {
        paths: {
            "prettify": PRETTIFY_LIB_PATH + "prettify.min"
        },
        waitSeconds: 0
    }
);

define(
    [
        "prettify"
    ],
    function () {
        [
            PRETTIFY_LIB_PATH + "prettify.css"
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