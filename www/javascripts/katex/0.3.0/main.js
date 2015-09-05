requirejs.config(
    {
        paths: {
            "katex": KATEX_LIB_PATH + "katex.min"
        },
        waitSeconds: 0
    }
);

define(
    [
        "katex"
    ],
    function (katex) {
        window.katex = katex;

        [
            KATEX_LIB_PATH + "katex.min.css"
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