define(
    ["angular", "jquery", "app-route", "app-service", "app-service-registry", "app-util"],
    function () {
        return function (appModule, extension) {
            function RootController($scope, $rootScope, $q, $timeout, angularEventTypes, angularConstants, appService, serviceRegistry, urlService, utilService) {

                extension && extension.attach && extension.attach($scope, {
                    "$timeout": $timeout,
                    "$q": $q,
                    "angularConstants": angularConstants,
                    "utilService": utilService,
                    "element": $("#rootBody"),
                    "scope": $scope
                });

                $rootScope.showAlert = function (alertObj) {
                    alertObj.id = $scope.alertUidGen();
                    $rootScope.alertList.splice(0, 0, alertObj);

                    return $scope.toggleDisplay("#alertBar", null, true);
                };

                $rootScope.hideAlert = function (id, event) {
                    $scope.toggleDisplay("#alertBar", null, false).then(function () {
                        var index;
                        if (!$rootScope.alertList.every(function (a, i) {
                                if (a.id === id) {
                                    index = i;
                                    return false;
                                }

                                return true;
                            })) {
                            $rootScope.alertList.splice(index, 1);
                        }
                    });
                };

                function initMaster() {
                    return $q.all([
                        appService.getServerUrl(),
                        appService.getChatServerHost(),
                        appService.getChatServerPort(),
                        appService.getDeviceId()
                    ]).then(function (result) {
                        window.serverUrl = result[0].data.result == "OK" && result[0].data.resultValue || "";
                        var deviceId = result[1].data.result == "OK" && result[1].data.resultValue || "";
                        var chatServerHost = result[2].data.result == "OK" && result[2].data.resultValue || "";
                        var chatServerPort = result[3].data.result == "OK" && result[3].data.resultValue || "";

                        window.pomeloContext = {deviceId: deviceId, host: chatServerHost, port: chatServerPort};
                        return utilService.getResolveDefer();
                    });
                }

                initMaster().then(function () {
                    urlService.firstPage();
                });

                $rootScope.alertList = [];
                $scope.alertUidGen = utilService.uniqueIdGen("alert-");
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

                    serviceRegistry.makeGlobal();//Called by snippets in project html
                    window.APP_PROJECT_PATH = projectId + "/";//Used to set base url for project to be loaded

                    var styleElement = document.getElementById("mobileProjectStylesheet");
                    styleElement && styleElement.remove();

                    require(["json!" + APP_PROJECT_PATH + "meta.json", APP_PROJECT_PATH + "mobile-main"], function (meta, mobileConfig) {
                        meta.locations = meta.locations.map(function (location) {
                            return APP_PROJECT_PATH + location;
                        });

                        meta.displayControlLocations = meta.displayControlLocations && meta.displayControlLocations.map(function (location) {
                            return APP_PROJECT_PATH + location;
                        });

                        $scope.thumbList = meta.thumbnails.map(function (thumbnail) {
                            if (thumbnail)
                                return APP_PROJECT_PATH + "resource/images/" + thumbnail;
                            else
                                return "images/default_page_thumb.svg";
                        });

                        $scope.locations = _.clone(meta.location);
                        $scope.displayControlLocations = _.clone(meta.displayControlLocations);

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

                $scope.hasTopicInvitation = function (pageNum) {                    
                    if (pageNum >= 0 && pageNum< $scope.locations.length) {
                        var gotoLocation = $scope.locations[pageNum];
                        if ($scope.displayControlLocations && $scope.displayControlLocations.length) {
                            if (!$scope.displayControlLocations.every(function(loc) {
                                return loc !== gotoLocation;
                            })) {
                                return $scope.topicInvitationList.every(function(topicInvitation) {
                                    return gotoLocation.indexcOf(topicInvitation.page) >= 0;
                                });
                            }
                        }
                    }

                    return false;
                }

                $scope.displayPage = function (pageNum) {
                    //BaseService's pageMeta contains page information of loaded project
                    if ($scope.chatContent.joinType === "invitation") {
                        if (window.pomeloContext) {
                            //If has topic invitation
                            return serviceRegistry.invoke("BaseService", "gotoPage")(pageNum, $scope.hasTopicInvitation(pageNum));
                        }
                    }

                    return serviceRegistry.invoke("BaseService", "gotoPage")(pageNum);
                }

                $scope.createChat = function () {
                    return utilService.getResolveDefer();
                }

                $scope.startPauseChat = function () {
                    return utilService.getResolveDefer();
                }

                $scope.sendChatInvitation = function (inviteeList) {
                    return utilService.getResolveDefer();
                }

                $scope.displayProjectModal = function (usage) {
                    $scope.modalUsage = usage;
                    var scope = angular.element($("#projectContainer .md-modal")).scope();
                    return scope.toggleModalWindow();
                };

                $scope.hideProjectModal = function () {
                    var scope = angular.element($("#projectContainer .md-modal")).scope();
                    return scope.toggleModalWindow();
                }

                $scope.invite = function () {
                    if ($scope.canInvite($scope.chatContent)) {
                        if ($scope.chatContent.joinType === "chat") {
                            return $scope.displayProjectModal("chatInvite");
                        }
                    }

                    return utilService.getResolveDefer();
                }

                $scope.startPause = function () {
                    if ($scope.canToggle($scope.chatContent)) {
                        if ($scope.chatContent.joinType === "project") {
                            return $scope.displayProjectModal("chatCreation");
                        } else if ($scope.chatContent.joinType === "chat") {
                            return $scope.displayProjectModal("chatToggle");
                        }
                    }

                    return utilService.getResolveDefer();
                }

                $scope.stopChat = function () {
                    if ($scope.chatContent.joinType === "chat") {
                        return $scope.displayProjectModal("chatStop");
                    }

                    return utilService.getResolveDefer();
                }

                $scope.toggleInviteeSelection = function (selectionList) {
                    if (selectionList && selectionList.length) {
                        if ($scope.hasAllSelection(selectionList)) {
                            selectionList.forEach(function (item) {
                                item.selected = false;
                            });
                        } else {
                            selectionList.forEach(function (item) {
                                item.selected = true;
                            });
                        }
                    }

                    return utilService.getResolveDefer();
                }

                $scope.toggleInviteeItem = function (item) {
                    item.selected = !item.selected;

                    return utilService.getResolveDefer();
                }

                $scope.canInvite = function (content) {
                    if (content) {
                        switch (content.joinType) {
                            case "project":
                                return false;
                            case "chat":
                                return content.chatState !== 3;
                            default:
                                break;
                        }
                    }

                    return false;
                }

                $scope.canToggle = function (content) {
                    if (content) {
                        switch (content.joinType) {
                            case "project":
                                return true;
                            case "chat":
                                return content.chatState !== 3;
                            default:
                                break;
                        }
                    }

                    return false;
                }

                $scope.canStart = function (content) {
                    if (content) {
                        switch (content.joinType) {
                            case "project":
                                return true;
                            case "chat":
                                return content.chatState !== 3;
                            default:
                                break;
                        }
                    }

                    return false;
                }

                $scope.canStop = function (content) {
                    if (content) {
                        switch (content.joinType) {
                            case "project":
                                return false;
                            case "chat":
                                return content.chatState !== 3;
                            default:
                                break;
                        }
                    }

                    return false;
                }

                $scope.hasNoSelection = function (selectionList) {
                    if (selectionList && selectionList.length) {
                        return selectionList.every(function (item) {
                            return !item.selected;
                        });
                    }

                    return true;
                }

                $scope.hasAllSelection = function (selectionList) {
                    if (selectionList && selectionList.length) {
                        return selectionList.every(function (item) {
                            return item.selected;
                        });
                    }

                    return false;
                }

                $scope.hasPartialSelection = function (selectionList) {
                    if (selectionList && selectionList.length) {
                        return !selectionList.every(function (item) {
                            return item.selected;
                        });
                    }

                    return false;
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
                    var inviteeList = [
                        {
                            "_id": "52591a12c763d5e4585563d0",
                            "name": "王欣芸"
                        },
                        {
                            "_id": "52591a12c763d5e4585563b4",
                            "name": "毕嘉利"
                        },
                        {
                            "_id": "52591a12c763d5e4585563b6",
                            "name": "陈羽"
                        },
                        {
                            "_id": "52591a12c763d5e4585563b8",
                            "name": "陈妍文"
                        },
                        {
                            "_id": "52591a12c763d5e4585563ba",
                            "name": "蔡智先"
                        },
                        {
                            "_id": "52591a12c763d5e4585563bc",
                            "name": "冯婷晖"
                        },
                        {
                            "_id": "52591a12c763d5e4585563be",
                            "name": "管悦欣"
                        },
                        {
                            "_id": "52591a12c763d5e4585563c0",
                            "name": "黄文轩"
                        },
                        {
                            "_id": "52591a12c763d5e4585563c2",
                            "name": "倪晨怡"
                        },
                        {
                            "_id": "52591a12c763d5e4585563c4",
                            "name": "田奕霖"
                        },
                        {
                            "_id": "52591a12c763d5e4585563c6",
                            "name": "王昕"
                        },
                        {
                            "_id": "52591a12c763d5e4585563ca",
                            "name": "殷奕蕊"
                        },
                        {
                            "_id": "52591a12c763d5e4585563cc",
                            "name": "周璎泓"
                        },
                        {
                            "_id": "52591a12c763d5e4585563ce",
                            "name": "许景凯"
                        }
                    ];
                    $scope.thumbList = [];
                    $scope.chatList = list;
                    $scope.inviteeList = inviteeList;
                    $scope.topicInvitationList = [];
                    $scope.chatState = 0;//0 Stopped;1 Started;2 Paused;3 Closed

                    var demoProjectItem = {
                        projectId: "56104bec2ac815961944b8bf",
                        porojectName: "Basic Book Demo",
                        time: new Date(),
                        userId: "52591a12c763d5e4585563d0",
                        joinType: "project"
                    };
                    var demoChatItem = {
                        projectId: "56104bec2ac815961944b8bf",
                        porojectName: "Basic Book Demo",
                        time: new Date(),
                        userId: "52591a12c763d5e4585563d0",
                        chatId: "1",
                        joinType: "chat",
                        route: "SIRIUS_CHAT_ROUTE",
                        chatState: 2
                    };
                    var demoInvitationItem = {
                        projectId: "56104bec2ac815961944b8bf",
                        porojectName: "Basic Book Demo",
                        time: new Date(),
                        userId: "52591a12c763d5e4585563d0",
                        chatId: "1",
                        joinType: "invitation",
                        route: "SIRIUS_CHAT_ROUTE"
                    };
                    $scope.chatContent = demoInvitationItem;

                    $timeout(function () {
                        //$scope.loadProject("56104bec2ac815961944b8bf");
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