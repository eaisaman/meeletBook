define(
    ["angular", "jquery", "jquery-ui", "app-route", "app-service"],
    function () {
        return function (appModule, extension) {
            function RootController($scope, $rootScope, $q, angularConstants, angularEventTypes, appService, urlService, uiUtilService) {

                function initMaster() {
                    window.onProjectScan = function (projectId) {
                        $rootScope.$broadcast(angularEventTypes.projectScanEvent, {projectId: projectId});
                    }

                    window.onGetProjectError = function (projectId, err) {
                        $rootScope.$broadcast(angularEventTypes.getProjectErrorEvent, {
                            projectId: projectId,
                            err: err
                        });
                    }

                    window.onDeleteLocalProject = function (projectIdList) {
                        $rootScope.$broadcast(angularEventTypes.deleteLocalProjectEvent, {
                            projectIdList: projectIdList
                        });
                    }

                    window.onDownloadProjectStart = function (projectId, mode) {
                        $rootScope.$broadcast(angularEventTypes.downloadProjectStartEvent, {
                            projectId: projectId,
                            mode: mode
                        });
                    }

                    window.onDownloadProjectStop = function (projectId, mode) {
                        $rootScope.$broadcast(angularEventTypes.downloadProjectStopEvent, {
                            projectId: projectId,
                            mode: mode
                        });
                    }

                    window.onDownloadProjectDone = function (projectId, mode) {
                        $rootScope.$broadcast(angularEventTypes.downloadProjectDoneEvent, {
                            projectId: projectId,
                            mode: mode
                        });
                    }

                    window.onDownloadProjectError = function (projectId, mode, progress, err) {
                        $rootScope.$broadcast(angularEventTypes.downloadProjectErrorEvent, {
                            projectId: projectId,
                            mode: mode,
                            progress: progress,
                            err: err
                        });
                    }

                    window.onDownloadProjectProgress = function (projectId, progress) {
                        $rootScope.$broadcast(angularEventTypes.downloadProjectProgressEvent, {
                            projectId: projectId,
                            progress: progress
                        });
                    }

                    window.onGetProjectModulesError = function (err) {
                        $rootScope.$broadcast(angularEventTypes.getProjectModulesErrorEvent, {
                            err: err
                        });
                    }

                    window.onDownloadProjectModulesStart = function () {
                        $rootScope.$broadcast(angularEventTypes.downloadProjectModulesStartEvent, {});
                    }

                    window.onDownloadProjectModulesDone = function () {
                        $rootScope.$broadcast(angularEventTypes.downloadProjectModulesDoneEvent, {});
                    }

                    window.onDownloadProjectModulesError = function (err) {
                        $rootScope.$broadcast(angularEventTypes.downloadProjectModulesErrorEvent, {
                            err: err
                        });
                    }

                    window.onDownloadProjectModulesProgress = function (progress) {
                        $rootScope.$broadcast(angularEventTypes.downloadProjectModulesProgressEvent, {
                            progress: progress
                        });
                    }

                    $rootScope.userDetail = {projectList: []};

                    return appService.getServerUrl().then(function (serverUrl) {
                        angularConstants.serverUrl = serverUrl || "";

                        //For development convenience, we do fake login or restore user info if already authenticated.
                        return appService.restoreUserFromStorage().then(
                            function () {
                                var arr = [];
                                if (!$rootScope.loginUser._id) {
                                    arr.push(
                                        function () {
                                            return appService.doLogin("xujingkai27", "*").then(
                                                function (result) {
                                                    if (result && result.data.result == "OK") {
                                                        var userObj = result.data.resultValue[0];
                                                        userObj && _.extend($rootScope.loginUser, userObj);
                                                    }

                                                    return uiUtilService.getResolveDefer();
                                                },
                                                function (err) {
                                                    return uiUtilService.getRejectDefer(err);
                                                }
                                            )
                                        }
                                    );
                                }

                                arr.push(function () {
                                    return appService.getUserDetail({"loginName": "xujingkai27"}).then(
                                        function (result) {
                                            if (result && result.data.result == "OK") {
                                                Array.prototype.splice.apply($rootScope.userDetail.projectList, Array.prototype.concat.apply(Array.prototype, [$rootScope.userDetail.projectList.length, 0, result.data.resultValue[0].projectList]));
                                            }

                                            return uiUtilService.getResolveDefer();
                                        },
                                        function (err) {
                                            return uiUtilService.getRejectDefer(err);
                                        }
                                    );
                                });

                                arr.push(function () {
                                    return appService.getLocalProject().then(function (result) {
                                            if (result && result.data.result == "OK" && result.data.resultValue.length) {
                                                for (var i = 0; i < $rootScope.userDetail.projectList.length; i++) {
                                                    var _id = $rootScope.userDetail.projectList[i]._id;
                                                    if (result.data.resultValue.length) {
                                                        var index;
                                                        if (!result.data.resultValue.every(function (projectItem, i) {
                                                                if (projectItem._id === _id) {
                                                                    index = i;
                                                                    return false;
                                                                }

                                                                return true;
                                                            })) {
                                                            result.data.resultValue.splice(index, 1);
                                                        }
                                                    } else {
                                                        break;
                                                    }
                                                }

                                                Array.prototype.splice.apply($rootScope.userDetail.projectList, Array.prototype.concat.apply(Array.prototype, [$rootScope.userDetail.projectList.length, 0, result.data.resultValue]));
                                            }

                                            return uiUtilService.getResolveDefer();
                                        },
                                        function (err) {
                                            return uiUtilService.getRejectDefer(err);
                                        });
                                });

                                arr.push(function () {
                                    return appService.checkProjectMode(_.pluck($rootScope.userDetail.projectList, "_id")).then(
                                        function (result) {
                                            if (result && result.data.result == "OK") {
                                                result.data.resultValue.forEach(function (data, i) {
                                                    $rootScope.userDetail.projectList[i].mode = data.mode;
                                                    if (data.progress < 100)
                                                        $rootScope.userDetail.projectList[i].progress = data.progress;
                                                });
                                            }

                                            return uiUtilService.getResolveDefer();
                                        },
                                        function (err) {
                                            return uiUtilService.getRejectDefer(err);
                                        }
                                    );
                                });

                                return uiUtilService.chain(arr).then(
                                    function (err) {
                                        if (err) {
                                            return uiUtilService.getRejectDefer(err);
                                        } else {
                                            return uiUtilService.getResolveDefer();
                                        }
                                    }
                                );
                            }, function (err) {
                                return uiUtilService.getRejectDefer(err);
                            }
                        );
                    });
                }

                initMaster().then(function () {
                    urlService.firstPage();
                });
            }

            function PreloadController($scope, $rootScope, $timeout, $q, angularConstants, angularEventTypes, appService, urlService, uiUtilService) {
                function initMaster() {
                    var defer = $q.defer();

                    appService.downloadModules();

                    $scope.$on(angularEventTypes.downloadProjectModulesDoneEvent, function (event) {
                        $timeout(function () {
                            defer.resolve();
                        }, 2000);
                    });

                    $scope.$on(angularEventTypes.downloadProjectModulesErrorEvent, function (event) {
                        $timeout(function () {
                            defer.resolve();
                        }, 2000);
                    });

                    return defer.promise;
                }

                initMaster().then(function () {
                    urlService.project();
                });
            }

            function ProjectController($scope, $rootScope, $timeout, $q, angularConstants, angularEventTypes, appService, urlService, uiUtilService) {
                extension && extension.attach && extension.attach($scope, {
                    "$timeout": $timeout,
                    "$q": $q,
                    "angularConstants": angularConstants,
                    "uiUtilService": uiUtilService,
                    "element": $(".projectContainer"),
                    "scope": $scope
                });

                $scope.displayProjectModal = function (event) {
                    event && event.stopPropagation && event.stopPropagation();

                    var scope = angular.element($("#projectContainer > .modalWindowContainer > .md-modal")).scope();
                    scope.toggleModalWindow();

                    return true;
                }

                $scope.hideProjectModal = function (event) {
                    event && event.stopPropagation && event.stopPropagation();

                    var scope = angular.element($("#projectContainer > .modalWindowContainer .md-modal")).scope();
                    scope.toggleModalWindow();

                    return true;
                }

                $scope.scanProjectCode = function (event) {
                    event && event.stopPropagation && event.stopPropagation();

                    appService.scanProjectCode();
                }

                $scope.toggleProjectButton = function (event) {
                    event && event.stopPropagation && event.stopPropagation();

                    var $el = $(event.target);
                    !$el.hasClass("select") && $(".topbarToggleButton.select").removeClass("select");
                    $el.toggleClass("select");
                    $scope.toggleCheckMode = $el.hasClass("select");
                    if ($scope.toggleCheckMode) {
                        $scope.projectAction = {
                            name: $el.attr("action"), callback: function () {
                                $scope.toggleCheckMode = false;
                                $el.removeClass("select");
                            }
                        }
                    }

                    $rootScope.userDetail.projectList.forEach(function (projectItem) {
                        projectItem.checked = false;
                    });
                }

                $scope.toggleCheck = function (projectItem, event) {
                    event && event.stopPropagation && event.stopPropagation();

                    projectItem.checked = !projectItem.checked;
                    !projectItem.checked && delete projectItem.checked;
                }

                $scope.confirmProjectAction = function (event) {
                    event && event.stopPropagation && event.stopPropagation();

                    if ($scope.projectAction) {
                        if ($scope.projectAction.name === "delete") {
                            var projectIdList = [];

                            $rootScope.userDetail.projectList.forEach(function (projectItem) {
                                projectItem.checked && projectIdList.push(projectItem._id);
                            });

                            projectIdList.length && appService.deleteLocalProject(projectIdList);
                        }
                        $scope.projectAction.callback && $scope.projectAction.callback();
                        delete $scope.projectAction;
                    }
                }

                $scope.cancelProjectAction = function (event) {
                    event && event.stopPropagation && event.stopPropagation();

                    if ($scope.projectAction) {
                        $scope.projectAction.callback && $scope.projectAction.callback();
                        delete $scope.projectAction;
                    }
                }

                $scope.createProjectKnob = function (projectItem) {
                    uiUtilService.whilst(
                        function () {
                            return !document.getElementById(projectItem._id);
                        },
                        function (callback) {
                            callback();
                        },
                        function (err) {
                            if (!err) {
                                var $input = $("#{0} .projectItemProgress input.projectItemKnob".format(projectItem._id));
                                $input.knob({});
                                projectItem.progress && $input.data("knob").val(projectItem.progress);
                            }
                        },
                        angularConstants.checkInterval,
                        "ProjectController.createProjectKnob." + projectItem._id,
                        angularConstants.renderTimeout
                    );
                }

                //Project Item mode: 1.Wait Download; 2.Wait Refresh; 3. Download or Refresh in Progress
                $scope.downloadProject = function (projectItem, event) {
                    event && event.stopPropagation && event.stopPropagation();

                    if ($rootScope.userDetail.projectList.every(function (item) {
                            if (item._id === projectItem._id) {
                                return false;
                            }

                            return true;
                        })) {
                        $rootScope.userDetail.projectList.splice($rootScope.userDetail.projectList.length, 0, projectItem);
                    }

                    appService.downloadProject(projectItem._id);

                    return true;
                }

                $scope.pauseDownloadProject = function (projectItem, event) {
                    event && event.stopPropagation && event.stopPropagation();

                    appService.pauseDownloadProject(projectItem._id);
                }

                $scope.showProject = function (projectItem, event) {
                    event && event.stopPropagation && event.stopPropagation();

                    appService.showProject(projectItem._id);
                }

                function initMaster() {
                    $scope.$on(angularEventTypes.projectScanEvent, function (event, data) {
                        $timeout(function () {
                            $scope.displayProjectModal();

                            if ($rootScope.userDetail.projectList.every(function (projectItem) {
                                    if (projectItem._id === data.projectId) {
                                        $scope.pickedProject = projectItem;
                                        return false;
                                    }

                                    return true;
                                })) {
                                appService.getProject({_id: data.projectId}).then(
                                    function (result) {
                                        if (result && result.data.result == "OK" && result.data.resultValue.length) {
                                            $scope.pickedProject = result.data.resultValue[0];
                                        }
                                    },
                                    function (err) {
                                    }
                                );
                            }
                        });

                        $scope.$apply();
                    });

                    $scope.$on(angularEventTypes.deleteLocalProjectEvent, function (event, data) {
                        $timeout(function () {
                            var projectIdList = data.projectIdList,
                                iArray = [];

                            $rootScope.userDetail.projectList.forEach(function (projectItem, i) {
                                var dIndex = _.indexOf(projectIdList, projectItem._id);

                                if (dIndex >= 0) {
                                    if (projectItem.userId === $rootScope.loginUser._id) {
                                        projectItem.mode = "waitDownload";
                                    } else {
                                        iArray.splice(0, 0, i);
                                    }
                                }
                            });

                            iArray.forEach(function (index) {
                                $rootScope.userDetail.projectList.splice(index, 1);
                            });
                        });

                        $scope.$apply();
                    });

                    $scope.$on(angularEventTypes.downloadProjectStartEvent, function (event, data) {
                        $timeout(function () {
                            $rootScope.userDetail.projectList.every(function (projectItem) {
                                if (projectItem._id === data.projectId) {
                                    projectItem.mode = data.mode;
                                    return false;
                                }

                                return true;
                            });
                        });

                        $scope.$apply();
                    });

                    $scope.$on(angularEventTypes.downloadProjectStopEvent, function (event, data) {
                        $timeout(function () {
                            $rootScope.userDetail.projectList.every(function (projectItem) {
                                if (projectItem._id === data.projectId) {
                                    projectItem.mode = data.mode;
                                    return false;
                                }

                                return true;
                            });
                        });

                        $scope.$apply();
                    });

                    $scope.$on(angularEventTypes.downloadProjectDoneEvent, function (event, data) {
                        $rootScope.userDetail.projectList.every(function (projectItem) {
                            if (projectItem._id === data.projectId) {
                                projectItem.mode = data.mode;
                                projectItem.progress = 100;
                                return false;
                            }

                            return true;
                        });

                        $rootScope.$apply();
                    });

                    $scope.$on(angularEventTypes.downloadProjectErrorEvent, function (event, data) {
                        $timeout(function () {
                            $rootScope.userDetail.projectList.every(function (projectItem) {
                                if (projectItem._id === data.projectId) {
                                    projectItem.mode = data.mode;
                                    projectItem.progress = data.progress;
                                    return false;
                                }

                                return true;
                            });
                        });

                        $scope.$apply();
                    });

                    $scope.$on(angularEventTypes.downloadProjectProgressEvent, function (event, data) {
                        var $input = $("#{0} .projectItemProgress input.projectItemKnob".format(data.projectId));
                        if ($input.length) {
                            $input.knob({});
                            data.progress && $input.data("knob").val(data.progress);
                        }

                        $timeout(function () {
                            $rootScope.userDetail.projectList.every(function (projectItem) {
                                if (projectItem._id === data.projectId) {
                                    projectItem.progress = data.progress;
                                    return false;
                                }

                                return true;
                            });
                        });

                        $scope.$apply();
                    });
                }

                initMaster();
            }

            appModule.
                controller('RootController', ["$scope", "$rootScope", "$q", "angularConstants", "angularEventTypes", "appService", "urlService", "uiUtilService", RootController]).
                controller('PreloadController', ["$scope", "$rootScope", "$timeout", "$q", "angularConstants", "angularEventTypes", "appService", "urlService", "uiUtilService", PreloadController]).
                controller('ProjectController', ["$scope", "$rootScope", "$timeout", "$q", "angularConstants", "angularEventTypes", "appService", "urlService", "uiUtilService", ProjectController]);
        }
    }
);