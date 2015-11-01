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

            function PreloadController($timeout, $q, urlService) {
                function initMaster() {
                    var defer = $q.defer();

                    $timeout(function () {
                        defer.resolve();
                    });

                    return defer.promise;
                }

                initMaster().then(function () {
                    urlService.project();
                });
            }

            function ProjectController($scope, $rootScope, $q, $timeout, angularEventTypes, angularConstants, appService, serviceRegistry, urlService, utilService) {
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

                $scope.displayPage = function (pageNum) {
                    var serviceRegistry = projectFrame.window.serviceRegistry;

                    if (serviceRegistry) {
                        return serviceRegistry.invoke("BaseService", "gotoPage")(pageNum);
                    } else {
                        return utilService.getResolveDefer();
                    }
                }

                function initMaster() {
                    $scope.thumbList = [
                        {
                            image: ""
                        }
                    ];
                }

                initMaster();
            }

            appModule.
                controller('RootController', ["$scope", "$rootScope", "$q", "$timeout", "angularEventTypes", "angularConstants", "appService", "serviceRegistry", "urlService", "utilService", RootController]).
                controller('PreloadController', ["$timeout", "$q", "urlService", PreloadController]).
                controller('ProjectController', ["$scope", "$rootScope", "$q", "$timeout", "angularEventTypes", "angularConstants", "appService", "serviceRegistry", "urlService", "utilService", ProjectController]);
        }
    }
)
;