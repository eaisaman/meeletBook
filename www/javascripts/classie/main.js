requirejs.config(
    {
        paths: {
            "classie": CLASSIE_LIB_PATH + "classie"
        },
        waitSeconds: 0
    }
);

define(
    [
        "classie"
    ],
    function (classie) {
        if (classie)
            window.classie = classie;

        return function () {
        }
    }
);