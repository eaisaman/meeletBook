define(
    ["angular", "jquery", "app-route", "app-service", "app-service-registry", "app-util"],
    function () {
        return function (appModule, extension, joinItem) {
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

                $rootScope.onceWrapper = function (bindObj) {
                    var functionNames = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));

                    functionNames.forEach(function (functionName) {
                        var fn = bindObj[functionName];

                        bindObj[functionName] = function () {
                            var defer = $q.defer(),
                                args = Array.prototype.slice.call(arguments);

                            utilService.once(
                                function () {
                                    return fn.apply(bindObj, args);
                                },
                                function (result, err) {
                                    if (err) {
                                        defer.reject(err);
                                    } else {
                                        defer.resolve(result);
                                    }
                                },
                                angularConstants.appTimeout,
                                "{0}.{1}".format(bindObj.id, functionName)
                            )();

                            return defer.promise;
                        }
                    });
                };

                function initMaster() {
                    return $q.all([
                        appService.getServerUrl(),
                        appService.getChatServerHost(),
                        appService.getChatServerPort(),
                        appService.getDeviceId(),
                        appService.restoreUserFromStorage()
                    ]).then(function (result) {
                        window.serverUrl = result[0].data.result == "OK" && result[0].data.resultValue || "";
                        var deviceId = result[1].data.result == "OK" && result[1].data.resultValue || "";
                        var chatServerHost = result[2].data.result == "OK" && result[2].data.resultValue || "";
                        var chatServerPort = result[3].data.result == "OK" && result[3].data.resultValue || "";

                        window.pomeloContext = {
                            deviceId: deviceId,
                            host: chatServerHost,
                            port: chatServerPort,
                            route: angularConstants.pomeloRoute.defaultChatRoute
                        };
                        return utilService.getResolveDefer();
                    });
                }

                initMaster().then(function () {
                    urlService.firstPage();
                });

                $rootScope.alertList = [];
                $scope.alertUidGen = utilService.uniqueIdGen("alert-");
            }

            function ProjectController($scope, $rootScope, $q, $timeout, $compile, $http, $log, $exceptionHandler, angularEventTypes, angularConstants, appService, serviceRegistry, urlService, utilService) {
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
                    ).then(function() {
                        if ($(".projectBarContent > .accordianGroup").hasClass("select")) {
                            $scope.isContentSet = false;
                            $timeout(function() {
                                return $scope.isContentSet = true;
                            });
                        }

                        return utilService.getResolveDefer();
                    });
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
                    if (pageNum >= 0 && pageNum < $scope.locations.length) {
                        var gotoLocation = $scope.locations[pageNum];
                        if ($scope.displayControlLocations && $scope.displayControlLocations.length) {
                            if (!$scope.displayControlLocations.every(function (loc) {
                                    return loc !== gotoLocation;
                                })) {
                                return $scope.topicInvitationList.every(function (topicInvitation) {
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
                    delete $scope.chatContent.chatId;
                    delete window.pomeloContext.chatId;

                    $scope.hideProjectModal();

                    return utilService.chain(
                        function () {
                            return appService.createChat($rootScope.loginUser._id, $scope.chatContent.projectId).then(function (chatId) {
                                $scope.chatContent.chatId = chatId;
                                window.pomeloContext.chatId = chatId;
                                $scope.chatContent.chatState = angularConstants.pomeloState.chatOpenState;

                                return utilService.getResolveDefer();
                            }, function (err) {
                                $exceptionHandler(err);
                                return utilService.getRejectDefer(err);
                            });

                        },
                        function () {
                            return appService.startChat($rootScope.loginUser._id, $scope.chatContent.chatId).then(function () {
                                $scope.registerPomeloListeners();

                                return utilService.getResolveDefer();
                            }, function (err) {
                                $exceptionHandler(err);
                                return utilService.getRejectDefer(err);
                            });
                        },
                        "ProjectController.createChat"
                    );
                }

                $scope.connectChat = function () {
                    var chatId = $scope.chatContent.chatId || angularConstants.pomeloChannel.loginChannel;

                    return appService.connectChat($rootScope.loginUser._id, chatId).then(function () {
                        $scope.registerPomeloListeners();

                        return utilService.getResolveDefer();
                    }, function (err) {
                        $exceptionHandler(err);
                        return utilService.getRejectDefer(err);
                    });
                }

                $scope.pauseChat = function () {
                    $scope.hideProjectModal();

                    return appService.pauseChat($rootScope.loginUser._id, $scope.chatContent.chatId).then(function () {
                        $scope.chatContent.chatState = angularConstants.pomeloState.chatPauseState;
                        return utilService.getResolveDefer();
                    }, function (err) {
                        $exceptionHandler(err);
                        return utilService.getRejectDefer(err);
                    });
                }

                $scope.resumeChat = function () {
                    $scope.hideProjectModal();

                    return appService.resumeChat($rootScope.loginUser._id, $scope.chatContent.chatId).then(function () {
                        $scope.chatContent.chatState = angularConstants.pomeloState.chatOpenState;
                        return utilService.getResolveDefer();
                    }, function (err) {
                        $exceptionHandler(err);
                        return utilService.getRejectDefer(err);
                    });
                }

                $scope.toggleChat = function () {
                    if ($scope.chatContent.chatState === angularConstants.pomeloState.chatOpenState) {
                        return $scope.pauseChat();
                    } else if ($scope.chatContent.chatState === angularConstants.pomeloState.chatPauseState) {
                        return $scope.resumeChat();
                    }

                    $scope.hideProjectModal();

                    return utilService.getResolveDefer();
                }

                $scope.inviteChat = function (inviteeList) {
                    $scope.hideProjectModal();

                    if (inviteeList && inviteeList.length) {
                        var list = _.where(inviteeList, {selected: true});
                        if (list.length) {
                            return appService.inviteChat($rootScope.loginUser._id, $scope.chatContent.chatId, _.pluck(list, "_id")).then(function () {
                                return utilService.getResolveDefer();
                            }, function (err) {
                                $exceptionHandler(err);
                                return utilService.getRejectDefer(err);
                            });
                        }
                    }

                    return utilService.getResolveDefer();
                }

                $scope.closeChat = function () {
                    $scope.hideProjectModal();

                    return appService.closeChat($rootScope.loginUser._id, $scope.chatContent.chatId).then(function () {
                        delete $scope.chatContent.chatId;
                        delete window.pomeloContext.chatId;
                        $scope.chatContent = $scope.chatProject;

                        $scope.unregisterPomeloListeners();

                        return utilService.getResolveDefer();
                    }, function (err) {
                        $exceptionHandler(err);
                        return utilService.getRejectDefer(err);
                    });
                }

                $scope.createTopic = function () {
                    var arr = [];

                    $scope.hideProjectModal();

                    if ($scope.chatContent.topicId) {
                        arr.push(
                            appService.closeTopic($rootScope.loginUser._id, $scope.chatContent.chatId, $scope.chatContent.topicId).then(function () {
                                delete $scope.chatContent.topicId;
                                $scope.chatContent.topicState = angularConstants.pomeloState.topicDestroyState;
                                return utilService.getResolveDefer();
                            }, function (err) {
                                alert(err);
                                return utilService.getRejectDefer(err);
                            })
                        );
                    }

                    arr.push(
                        appService.createTopic($rootScope.loginUser._id, $scope.chatContent.chatId).then(function (result) {
                            $scope.chatContent.topicId = result.topicId;
                            $scope.chatContent.topicState = result.topicState;
                            return utilService.getResolveDefer();
                        }, function (err) {
                            $exceptionHandler(err);
                            return utilService.getRejectDefer(err);
                        })
                    );

                    if (inviteeList && inviteeList.length) {
                        var list = _.where(inviteeList, {selected: true});
                        if (list.length) {
                            return appService.inviteTopic($rootScope.loginUser._id, $scope.chatContent.chatId, $scope.chatContent.topicId, _.pluck(list, "_id")).then(function () {
                                return utilService.getResolveDefer();
                            }, function (err) {
                                $exceptionHandler(err);
                                return utilService.getRejectDefer(err);
                            });
                        }
                    }

                    return utilService.chain(
                        arr,
                        "ProjectController.createTopic"
                    );
                }

                $scope.inviteTopic = function (topicId) {
                    $scope.hideProjectModal();

                    if (inviteeList && inviteeList.length) {
                        var list = _.where(inviteeList, {selected: true});
                        if (list.length) {
                            return appService.inviteTopic($rootScope.loginUser._id, $scope.chatContent.chatId, topicId, _.pluck(list, "_id")).then(function () {
                                return utilService.getResolveDefer();
                            }, function (err) {
                                $exceptionHandler(err);
                                return utilService.getRejectDefer(err);
                            });
                        }
                    }

                    return utilService.getResolveDefer();
                }

                $scope.pauseTopic = function () {
                    $scope.hideProjectModal();

                    return appService.pauseTopic($rootScope.loginUser._id, $scope.chatContent.chatId, {chatId: $scope.chatContent.chatId}).then(function () {
                        $scope.chatContent.topicState = angularConstants.pomeloState.topicPauseState;
                        return utilService.getResolveDefer();
                    }, function (err) {
                        $exceptionHandler(err);
                        return utilService.getRejectDefer(err);
                    });
                }

                $scope.resumeTopic = function () {
                    $scope.hideProjectModal();

                    return appService.resumeTopic($rootScope.loginUser._id, $scope.chatContent.chatId, {chatId: $scope.chatContent.chatId}).then(function () {
                        $scope.chatContent.topicState = angularConstants.pomeloState.topicOpenState;
                        return utilService.getResolveDefer();
                    }, function (err) {
                        $exceptionHandler(err);
                        return utilService.getRejectDefer(err);
                    });
                }

                $scope.closeTopic = function () {
                    $scope.hideProjectModal();

                    return appService.closeTopic($rootScope.loginUser._id, $scope.chatContent.chatId, $scope.chatContent.topicId).then(function () {
                        delete $scope.chatContent.topicId;
                        $scope.chatContent.topicState = angularConstants.pomeloState.topicDestroyState;
                        return utilService.getResolveDefer();
                    }, function (err) {
                        $exceptionHandler(err);
                        return utilService.getRejectDefer(err);
                    });
                }

                $scope.toggleTopic = function () {
                    if ($scope.chatContent.topicState === angularConstants.pomeloState.topicOpenState) {
                        return $scope.pauseTopic();
                    } else if ($scope.chatContent.topicState === angularConstants.pomeloState.topicPauseState) {
                        return $scope.resumeTopic();
                    }

                    $scope.hideProjectModal();

                    return utilService.getResolveDefer();
                }

                $scope.sendChatMessage = function (message) {
                    return appService.sendChatMessage($rootScope.loginUser._id, $scope.chatContent.chatId, null, message).then(function () {
                        return utilService.getResolveDefer();
                    }, function (err) {
                        $exceptionHandler(err);
                        return utilService.getRejectDefer(err);
                    });
                }

                $scope.sendTopicMessage = function (message) {
                    return appService.sendTopicMessage($rootScope.loginUser._id, $scope.chatContent.chatId, $scope.chatContent.topicId, message).then(function () {
                        return utilService.getResolveDefer();
                    }, function (err) {
                        $exceptionHandler(err);
                        return utilService.getRejectDefer(err);
                    });
                }

                $scope.gotoTopicPage = function (location) {
                    return appService.gotoPage(location, true);
                }

                //Resend topic invitation if owner, open page if receiver
                $scope.handleTopic = function (chat) {
                    if (chat.userId === $rootScope.loginUser._id) {
                        return $scope.displayProjectModal("resendTopic");
                    } else {
                        $scope.chatContent.topicId = window.pomeloContext.topicId = chat.topicId;

                        return appService.gotoPage(chat.page, true);
                    }
                }

                $scope.registerPomeloListeners = function () {
                    pomelo.on(window.pomeloContext.route, function (data) {
                        var userId = data.userId, chatId = data.chatId, signal = data.signal, chatItem;
                        switch (signal) {
                            case angularConstants.pomeloSignal.inviteSignal:
                                chatItem = {order: $scope.chatList.length, content: "Invite"};
                                break;
                            case angularConstants.pomeloSignal.connectSignal:
                                chatItem = {order: $scope.chatList.length, content: "Chat Connect"};
                                break;
                            case angularConstants.pomeloSignal.disconnectSignal:
                                chatItem = {order: $scope.chatList.length, content: "Chat Disconnect"};
                                break;
                            case angularConstants.pomeloSignal.pauseSignal:
                                chatItem = {order: $scope.chatList.length, content: "Chat Pause"};
                                break;
                            case angularConstants.pomeloSignal.resumeSignal:
                                chatItem = {order: $scope.chatList.length, content: "Chat Resume"};
                                break;
                            case angularConstants.pomeloSignal.messageSignal:
                                chatItem = {
                                    order: $scope.chatList.length,
                                    content: "Chat Message" + data.payload
                                };
                                break;
                            case angularConstants.pomeloSignal.topicInviteSignal:
                                chatItem = {
                                    order: $scope.chatList.length,
                                    content: "Topic Invite",
                                    topicId: data.topicId
                                };
                                break;
                            case angularConstants.pomeloSignal.topicPauseSignal:
                                chatItem = {
                                    order: $scope.chatList.length, content: "Topic Pause",
                                    topicId: data.topicId
                                };
                                break;
                            case angularConstants.pomeloSignal.topicResumeSignal:
                                chatItem = {
                                    order: $scope.chatList.length, content: "Topic Resume",
                                    topicId: data.topicId
                                };
                                break;
                            case angularConstants.pomeloSignal.topicMessageSignal:
                                chatItem = {
                                    order: $scope.chatList.length, content: "Topic Message",
                                    topicId: data.topicId
                                };
                                break;
                            case angularConstants.pomeloSignal.topicCloseSignal:
                                chatItem = {
                                    order: $scope.chatList.length, content: "Topic Close",
                                    topicId: data.topicId
                                };
                                break;
                            case angularConstants.pomeloSignal.topicDisconnectSignal:
                                chatItem = {
                                    order: $scope.chatList.length, content: "Topic Disconnect",
                                    topicId: data.topicId
                                };
                                break;
                        }

                        if (chatItem) {
                            chatItem.type = userId === $rootScope.loginUser._id ? "myTalk" : "friendTalk";
                            chatItem.userId = userId;
                            chatItem.chatId = chatId;
                            $scope.chatList.push(chatItem);
                            $scope.$apply();
                        }
                    });
                    pomelo.on('disconnect', function (reason) {
                        angularConstants.VERBOSE && $log.debug('disconnect');
                        var chatItem = {order: $scope.chatList.length, message: "Disconnect"};
                        chatItem.type = "myTalk";
                        $scope.chatList.push(chatItem);
                        $scope.$apply();
                    });
                    pomelo.on('closed', function (reason) {
                        angularConstants.VERBOSE && $log.debug('closed');
                        var chatItem = {order: $scope.chatList.length, message: "Closed"};
                        chatItem.type = "myTalk";
                        $scope.chatList.push(chatItem);
                        $scope.$apply();
                    });
                }

                $scope.unregisterPomeloListeners = function () {
                    pomelo.removeAllListeners(window.pomeloContext.route);
                    pomelo.removeAllListeners('disconnect');
                    pomelo.removeAllListeners('closed');
                }

                //UI Control Logic
                $scope.displayProjectModal = function (usage) {
                    $scope.modalUsage = usage;
                    var scope = angular.element($("#projectContainer .md-modal")).scope();
                    return scope.toggleModalWindow(true);
                };

                $scope.hideProjectModal = function () {
                    var scope = angular.element($("#projectContainer .md-modal")).scope();
                    return scope.toggleModalWindow(false);
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

                $scope.startPauseTopic = function () {
                    if ($scope.canToggleTopic($scope.chatContent)) {
                        if ($scope.chatContent.joinType === "chat") {
                            return $scope.displayProjectModal("topicToggle");
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

                $scope.stopTopic = function () {
                    if ($scope.chatContent.joinType === "chat") {
                        return $scope.displayProjectModal("topicStop");
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

                $scope.canInvite = function () {
                    if ($scope.chatContent) {
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

                $scope.canToggle = function () {
                    if ($scope.chatContent) {
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

                $scope.canToggleTopic = function () {
                    if ($scope.chatContent) {
                        switch (content.joinType) {
                            case "chat":
                                return content.chatState !== 3;
                            default:
                                break;
                        }
                    }

                    return false;
                }

                $scope.canStart = function () {
                    if ($scope.chatContent) {
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

                $scope.canStop = function () {
                    if ($scope.chatContent) {
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
                            "type": "topicTalk",
                            "content": "凤凰楼的点心好正点哦",
                            "userId": "66591a12c763d5e45855637e",
                            "page": ""
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
                        }
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
                        projectName: "Basic Book Demo",
                        time: new Date(),
                        userId: "52591a12c763d5e4585563d0",
                        joinType: "project"
                    };
                    var demoChatItem = {
                        projectId: "56104bec2ac815961944b8bf",
                        projectName: "Basic Book Demo",
                        time: new Date(),
                        userId: "52591a12c763d5e4585563d0",
                        chatId: "1",
                        joinType: "chat",
                        route: "SIRIUS_CHAT_ROUTE",
                        chatState: 2
                    };
                    var demoInvitationItem = {
                        projectId: "56104bec2ac815961944b8bf",
                        projectName: "Basic Book Demo",
                        time: new Date(),
                        userId: "52591a12c763d5e4585563d0",
                        chatId: "1",
                        joinType: "invitation",
                        route: "SIRIUS_CHAT_ROUTE"
                    };
                    //$scope.chatContent = demoChatItem;
                    $scope.chatContent = joinItem;
                    if (joinItem.joinType === "project" || joinItem.joinType === "chat") {
                        $scope.chatProject = _.pick(joinItem, ["projectId", "projectName", "time", "userId", "joinType"]);
                    }

                    //The same operation cannot be called too frequently
                    $scope.onceWrapper($scope, "createChat", "connectChat", "pauseChat", "resumeChat", "inviteChat", "closeChat",
                        "createTopic", "pauseTopic", "resumeTopic", "closeTopic",
                        "sendChatMessage", "sendTopicMessage");

                    $scope.$on('$destroy', function () {
                        $scope.unregisterPomeloListeners();
                    });

                    var arr = [];
                    if ($scope.chatContent.joinType === "invitation" || $scope.chatContent.joinType === "chat") {
                        arr.push($scope.connectChat());
                    }
                    arr.push(
                        appService.getSameGroupUsers($rootScope.loginUser._id).then(
                                function (arr) {
                                    $scope.inviteeList = arr || $scope.inviteeList;
                                    return utilService.getResolveDefer();
                                }, function (err) {
                                    return utilService.getRejectDefer(err);
                                }
                            )
                    );

                    return $q.all(arr).then(function (result) {
                        return utilService.getResolveDefer();
                    });
                }

                utilService.whilst(
                    function () {
                        return !window.pomeloContext;
                    }, function (err) {
                        if (!err) {
                            initMaster();
                        }
                    },
                    angularConstants.loadCheckInterval,
                    "ProjectController.initMaster",
                    angularConstants.appTimeout
                );
            }

            appModule.
                controller('RootController', ["$scope", "$rootScope", "$q", "$timeout", "angularEventTypes", "angularConstants", "appService", "serviceRegistry", "urlService", "utilService", RootController]).
                controller('ProjectController', ["$scope", "$rootScope", "$q", "$timeout", "$compile", "$http", "$log", "$exceptionHandler", "angularEventTypes", "angularConstants", "appService", "serviceRegistry", "urlService", "utilService", ProjectController]);
        }
    }
)
;