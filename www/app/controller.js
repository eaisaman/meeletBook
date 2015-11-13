define(
    ["angular", "jquery", "app-route", "app-service", "app-service-registry", "app-util"],
    function () {
        return function (appModule, extension) {
            function RootController($scope, $rootScope, $q, $timeout, angularEventTypes, angularConstants, appService, serviceRegistry, urlService, utilService) {

                function initMaster() {
                    return $q.all([
                        appService.getServerUrl(),
                        appService.getChatServerHost(),
                        appService.getChatServerPort(),
                        appService.getDeviceId()
                    ]).then(function(result) {
                        window.serverUrl = result[0].data.result == "OK" && result[0].data.resultValue || "";
                        var deviceId = result[1].data.result == "OK" && result[1].data.resultValue || "";
                        var chatServerHost = result[2].data.result == "OK" && result[2].data.resultValue || "";
                        var chatServerPort = result[3].data.result == "OK" && result[3].data.resultValue || "";

                        window.pomeloContext = {deviceId:deviceId, host:chatServerHost, port:chatServerPort};
                        return utilService.getResolveDefer();
                    });
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

                        serviceRegistry.setServiceAttribute("BaseService", {pageMeta: meta});

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

                $scope.startPauseChat = function () {
                    if ($scope.chatId) {
                        if ($scope.chatState == 1) {
                            return serviceRegistry.invoke("BaseService", "pauseChat")("", $scope.chatId).then(function () {
                                $scope.chatState = 2;
                                return utilService.getResolveDefer();
                            }, function (error) {
                                return utilService.getRejectDefer(error);
                            });
                        } else {
                            return serviceRegistry.invoke("BaseService", "connectChat")("", $scope.chatId).then(function (chatId) {
                                $scope.chatState = 1;
                                return utilService.getResolveDefer();
                            }, function (error) {
                                return utilService.getRejectDefer(error);
                            });
                        }
                    } else {
                        return serviceRegistry.invoke("BaseService", "createChat")("").then(function (chatId) {
                            $scope.chatId = chatId;
                            $scope.chatState = 1;
                            return utilService.getResolveDefer();
                        }, function (error) {
                            return utilService.getRejectDefer(error);
                        });
                    }
                }

                $scope.stopChat = function () {
                    if ($scope.chatId) {
                        return serviceRegistry.invoke("BaseService", "closeChat")("", $scope.chatId).then(function () {
                            $scope.chatState = 0;
                            delete $scope.chatId;
                            return utilService.getResolveDefer();
                        }, function (error) {
                            return utilService.getRejectDefer(error);
                        });
                    } else {
                        return utilService.getResolveDefer();
                    }
                }

                function initMaster() {
                    var start = new Date(), end = start.addMinutes(1);
                    var list = [
                        {
                            "type": "timeMark",
                            "content": start.toString("yyyy年MM月dd日tthh:mm").replace("AM", "上午").replace("PM", "下午"),
                            "start": start,
                            "end": end,
                        },
                        {
                            "type": "myTalk",
                            "content": "我在吃早饭",
                            "userId": "66591a12c763d5e45855637e",
                        },
                        {
                            "type": "myTalk",
                            "content": "凤凰楼的点心好正点哦",
                            "userId": "66591a12c763d5e45855637e",
                        },
                        {
                            "type": "friendTalk",
                            "content": "请客",
                            "userId": "66591a12c763d5e45855637e",
                        },
                        {
                            "type": "friendTalk",
                            "content": "浙江将中医药知识纳入中小学课程",
                            "userId": "66591a12c763d5e45855637e",
                        },
                        {
                            "type": "friendTalk",
                            "content": "Evernote似乎正在陷入危机之中。这家曾经被认为是“独角兽公司”最为完美的注脚的企业，在本月初宣布将裁员47人，并将关闭位于台湾、新加坡和莫斯科的三个办公室。此外，Evernote还关闭了一些运营不太顺利的功能，比如用于记录菜谱的“食记(Evernote Food)”。联系到今年七月的换帅和九月中国区总经理谷懿的辞职，以及意外停办的Evernote开发者大会，种种迹象都表明，这只独角兽已经处于泥潭的边缘。",
                            "userId": "66591a12c763d5e45855637e",
                        },
                        {
                            "type": "friendTalk",
                            "content": "种子起源于3亿6千万年前，是种子植物产生的最为复杂的器官之一，为裸子植物和被子植物所特有。",
                            "userId": "66591a12c763d5e45855637e",
                        },
                    ];
                    $scope.thumbList = [];
                    $scope.chatList = list;
                    $scope.chatState = 0;//0 Stopped;1 Going on;2 Paused

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