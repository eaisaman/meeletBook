//Javascript libs
var ANGULAR_LIB_PATH = "javascripts/angular/1.3.0-beta.8/",
    ANGULAR_MODULES_LIB_PATH = "javascripts/angular-modules/",
    ANGULAR_PLUGINS_LIB_PATH = "javascripts/angular-plugins/",
    HAMMER_LIB_PATH = "javascripts/hammer/2.0.4/",
    JQUERY_LIB_PATH = "javascripts/jquery/2.1.1/",
    JQUERY_PLUGINS_LIB_PATH = "javascripts/jquery-plugins/",
    JQUERY_UI_LIB_PATH = "javascripts/jquery-ui/1.11.0/",
    JQUERY_UI_PLUGINS_LIB_PATH = "javascripts/jquery-ui-plugins/",
    UNDERSCORE_LIB_PATH = "javascripts/underscore/1.6.0/",
    CLASSIE_LIB_PATH = "javascripts/classie/",
    MODERNIZR_LIB_PATH = "javascripts/modernizr/",
    STRING_LIB_PATH = "javascripts/String/",
    RAPHAEL_LIB_PATH = "javascripts/raphael/2.1.2/",//Depended by flowchart, sequence-diagram
    FLOWCHART_LIB_PATH = "javascripts/flowchart/1.4.0/", //Depended by editormd
    JQUERY_FLOWCHART_LIB_PATH = "javascripts/jquery.flowchart/1.0.0/", //Depended by editormd
    SEQUENCE_DIAGRAM_LIB_PATH = "javascripts/sequence-diagram/1.0.4/", //Depended by editormd
    KATEX_LIB_PATH = "javascripts/katex/0.3.0/",//Depended by editormd
    CODEMIRROR_LIB_PATH = "javascripts/codemirror/5.2.0/",//Depended by editormd
    MARKED_LIB_PATH = "javascripts/marked/0.3.3/",//Depended by editormd
    PRETTIFY_LIB_PATH = "javascripts/prettify/r298/",//Depended by editormd
    EDITORMD_LIB_PATH = "javascripts/editormd/1.4.3/",
    SNAP_SVG_LIB_PATH = "javascripts/snap/0.4.1/",
    APP_LIB_PATH = "app/",
    DIRECTIVE_LIB_PATH = "directive/",
    isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && !/jsDom$/i.test(navigator.appName) && window.document);

//Angular app module
var APP_MODULE_NAME = "app",
    APP_MODULE_DEPS = ["ngRoute", "ngCookies", "ngTouch", "flow"];

requirejs.config({
    paths: {
        "angular-lib": ANGULAR_LIB_PATH + "main",
        "angular-modules-lib": ANGULAR_MODULES_LIB_PATH + "main",
        "angular-plugins-lib": ANGULAR_PLUGINS_LIB_PATH + "main",
        "hammer-lib": HAMMER_LIB_PATH + "main",
        "jquery-lib": JQUERY_LIB_PATH + "main",
        "jquery-plugins-lib": JQUERY_PLUGINS_LIB_PATH + "main",
        "jquery-ui-lib": JQUERY_UI_LIB_PATH + "main",
        "jquery-ui-plugins-lib": JQUERY_UI_PLUGINS_LIB_PATH + "main",
        "underscore-lib": UNDERSCORE_LIB_PATH + "main",
        "classie-lib": CLASSIE_LIB_PATH + "main",
        "modernizr-lib": MODERNIZR_LIB_PATH + "main",
        "string-lib": STRING_LIB_PATH + "main",
        "raphael-lib": RAPHAEL_LIB_PATH + "main",
        "flowchart-lib": FLOWCHART_LIB_PATH + "main",
        "jquery-flowchart-lib": JQUERY_FLOWCHART_LIB_PATH + "main",
        "sequence-diagram-lib": SEQUENCE_DIAGRAM_LIB_PATH + "main",
        "katex-lib": KATEX_LIB_PATH + "main",
        "codemirror-lib": CODEMIRROR_LIB_PATH + "main",
        "marked-lib": MARKED_LIB_PATH + "main",
        "prettify-lib": PRETTIFY_LIB_PATH + "main",
        "editormd-lib": EDITORMD_LIB_PATH + "main",
        "snap-svg-lib": SNAP_SVG_LIB_PATH + "main",
        "app-lib": APP_LIB_PATH + "main",
        "directive-lib": DIRECTIVE_LIB_PATH + "main"
    },
    shim: {
        "app-lib": {deps: ["directive-lib"]}
    }
});

requirejs(["jquery-lib", "jquery-plugins-lib", "hammer-lib", "jquery-ui-lib", "jquery-ui-plugins-lib", "angular-lib", "angular-modules-lib", "underscore-lib", "classie-lib", "modernizr-lib", "string-lib", "editormd-lib", "snap-svg-lib"], function () {
    window.appModule = angular.module(APP_MODULE_NAME, APP_MODULE_DEPS);
    window.appModule.value("angularEventTypes", {
        boundPropertiesEvent: "boundPropertiesEvent",
        beforeWidgetCreationEvent: "beforeWidgetCreationEvent",
        switchProjectEvent: "switchProjectEvent",
        widgetContentIncludedEvent: "widgetContentIncluded",

        //Used by Mobile App
        projectScanEvent: "projectScan",
        getProjectErrorEvent: "getProjectError",
        getProjectModulesErrorEvent: "getProjectModulesError",
        deleteLocalProjectEvent: "deleteLocalProject",
        downloadProjectStartEvent: "downloadProjectStart",
        downloadProjectStopEvent: "downloadProjectStop",
        downloadProjectDoneEvent: "downloadProjectDone",
        downloadProjectErrorEvent: "downloadProjectError",
        downloadProjectProgressEvent: "downloadProjectProgress",
        downloadProjectModulesStartEvent: "downloadProjectModulesStart",
        downloadProjectModulesDoneEvent: "downloadProjectModulesDone",
        downloadProjectModulesErrorEvent: "downloadProjectModulesError",
        downloadProjectModulesProgressEvent: "downloadProjectModulesProgress"
    });
    window.appModule.value("angularConstants", {
        precision: 1000,
        percentPrecision: 1000,
        treeNodeIdPrefix: "tree-node-",
        repoTypes: [
            {name: "widget", value: "widget"},
            {name: "effect", value: "effect"},
            {name: "icon", value: "icon"}
        ],
        VERBOSE: true,
        widgetClasses: {
            containerClass: "sketchHolder",
            deviceHolderClass: "deviceHolder",
            holderClass: "pageHolder",
            widgetClass: "sketchWidget",
            hoverClass: "widgetHover",
            activeClass: "pickedWidget",
            widgetContainerClass: "widgetContainer",
            widgetIncludeAnchorClass: "widgetIncludeAnchor"
        },
        anchorAttr: "widget-anchor",
        repoWidgetClass: "ui-widget",
        stateGroupEventPattern: "State Change Event of State Group {0}",
        widgetEventPattern: "Event {0} of widget {1}",
        draggingShapeZIndex: 101,
        actionDelay: 100,
        checkInterval: 20,
        loadCheckInterval: 40,
        unresponsiveInterval: 40,
        eventThrottleInterval: 300,
        renderTimeout: 3000,
        loadRenderTimeout: 6000,
        loadTimeout: 10000
    });
    //For upload file angular module 'ng-flow'
    window.appModule.config(['flowFactoryProvider', function (flowFactoryProvider) {
        flowFactoryProvider.defaults = {
            target: function (fileObj) {
                return 'api/public/file';
            },
            permanentErrors: [404, 500, 501],
            maxChunkRetries: 1,
            chunkRetryInterval: 5000,
            simultaneousUploads: 4
        };
        flowFactoryProvider.on('catchAll', function (event) {
        });
    }]);

    //Angular Modules Config
    arguments[6](window.appModule);

    document.addEventListener('deviceready', function () {
        requirejs(["angular-plugins-lib", "directive-lib", "app-lib"], function () {
            if (isBrowser) {
                var configs = Array.prototype.slice.call(arguments, 0, arguments.length - 1),
                    appConfig = arguments[arguments.length - 1];

                configs.forEach(function (config) {
                    config(window.appModule);
                });

                appConfig(window.appModule, function () {
                    angular.bootstrap(document, [APP_MODULE_NAME]);
                });
            }

            //On load function will be bound to window object if post processing needed.
            window.onModulesLoaded && window.onModulesLoaded();
        });
    }, false);

    if (!window.cordova) {
        var evt = document.createEvent('Events');
        evt.initEvent('deviceready', false, false)
        document.dispatchEvent(evt);
    }
});
