var cmModePath = CODEMIRROR_LIB_PATH + "mode/";
var cmAddonPath = CODEMIRROR_LIB_PATH + "addon/";

define(
    [
        CODEMIRROR_LIB_PATH + "lib/codemirror",
        cmModePath + "markdown/markdown",

        cmAddonPath + "edit/trailingspace",
        cmAddonPath + "dialog/dialog",
        cmAddonPath + "search/searchcursor",
        cmAddonPath + "search/search",
        cmAddonPath + "scroll/annotatescrollbar",
        cmAddonPath + "search/matchesonscrollbar",
        cmAddonPath + "display/placeholder",
        cmAddonPath + "edit/closetag",
        cmAddonPath + "fold/foldcode",
        cmAddonPath + "fold/foldgutter",
        cmAddonPath + "fold/indent-fold",
        cmAddonPath + "fold/brace-fold",
        cmAddonPath + "fold/xml-fold",
        cmAddonPath + "fold/markdown-fold",
        cmAddonPath + "fold/comment-fold",
        cmAddonPath + "mode/overlay",
        cmAddonPath + "selection/active-line",
        cmAddonPath + "edit/closebrackets",
        cmAddonPath + "display/fullscreen",
        cmAddonPath + "search/match-highlighter"
    ],
    function (CodeMirror) {
        window.CodeMirror = CodeMirror;

        [
            CODEMIRROR_LIB_PATH + "lib/codemirror.css"
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