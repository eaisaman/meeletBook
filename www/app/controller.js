define(
    ["angular", "jquery", "app-route", "app-service", "app-service-registry", "app-util"],
    function () {
        return function (appModule, extension) {
            function RootController($scope, $rootScope, $q, $timeout, angularEventTypes, angularConstants, appService, serviceRegistry, urlService, utilService) {

                function initMaster() {
                    var defer = $q.defer();

                    $timeout(function () {
                        defer.resolve();
                    });

                    return defer.promise;
                }

                initMaster().then(function () {
                    urlService.firstPage();
                });
            }

            function ProjectController($scope, $rootScope, $q, $timeout, $compile, $http, angularEventTypes, angularConstants, appService, serviceRegistry, urlService, utilService) {
                extension && extension.attach && extension.attach($scope, {
                    "$timeout": $timeout,
                    "$q": $q,
                    "angularConstants": angularConstants,
                    "utilService": utilService,
                    "element": $("#projectContainer"),
                    "scope": $scope
                });

                $scope.toggleUserAccordian = function (event) {
                    return $q.all(
                        [
                            $scope.toggleSelect(event),
                            $scope.toggleSelect(".projectBarContent > .accordianGroup")
                        ]
                    );
                };

                $scope.loadProject = function (projectId) {
                    var element = $(".projectMainContent").children()[0];
                    if (element) {
                        var projectScope = angular.element(element).scope();
                        projectScope.$destroy();
                        element.remove();
                    }

                    serviceRegistry.makeGlobal();
                    window.APP_PROJECT_PATH = projectId + "/";
                    var styleElement = document.getElementById("mobileProjectStylesheet");
                    styleElement && styleElement.remove();

                    require(["json!" + APP_PROJECT_PATH + "meta.json", APP_PROJECT_PATH + "mobile-main"], function (meta, mobileConfig) {
                        meta.locations = meta.locations.map(function (location) {
                            return APP_PROJECT_PATH + location;
                        });

                        serviceRegistry.setServiceAttribute("BaseService", {pageMeta:meta});

                        mobileConfig(window.appModule, _.pick(appService, ["$injector", "$compileProvider", "$controllerProvider"]), function () {
                            var link = document.createElement("link");
                            link.type = "text/css";
                            link.rel = "stylesheet";
                            link.href = "{0}stylesheets/index.css".format(APP_PROJECT_PATH);
                            link.id = "mobileProjectStylesheet";

                            document.getElementsByTagName("head")[0].appendChild(link);

                            return $http.get(APP_PROJECT_PATH + "mobile-index.html").then(
                                function (result) {
                                    var $parent = $(".projectMainContent"),
                                        $element = $(result.data).appendTo($parent);

                                    $compile($element)($scope);
                                }, function (err) {
                                }
                            )
                        });
                    });
                }

                $scope.displayPage = function (pageNum) {
	                return serviceRegistry.invoke("BaseService", "gotoPage")(pageNum);
                }

                function initMaster() {
                    $scope.thumbList = [];

                    $timeout(function () {
                        $scope.loadProject("56104bec2ac815961944b8bf");
                    }, 300);
                }

                initMaster();
            }

            appModule.
                controller('RootController', ["$scope", "$rootScope", "$q", "$timeout", "angularEventTypes", "angularConstants", "appService", "serviceRegistry", "urlService", "utilService", RootController]).
                controller('ProjectController', ["$scope", "$rootScope", "$q", "$timeout", "$compile", "$http", "angularEventTypes", "angularConstants", "appService", "serviceRegistry", "urlService", "utilService", ProjectController]);
        }
    }
)
;