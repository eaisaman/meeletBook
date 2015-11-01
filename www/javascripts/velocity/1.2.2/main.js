requirejs.config(
    {
        paths: {
            "velocity": VELOCITY_LIB_PATH + "velocity.min",
            "velocity.ui": VELOCITY_LIB_PATH + "velocity.ui.min"
        },
        waitSeconds: 0
    }
);

define(
    [
            "velocity", "velocity.ui"
    ],
    function (Velocity) {
        window.Velocity = Velocity;

        return function () {
        }
    }
);