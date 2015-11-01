define(
    ["angular", "underscore"],
    function () {
        return function (appModule) {
            function whereFilter() {
                return function (list, condition) {
                    return _.where(list, condition);
                };
            }

            appModule.config(["$provide", function ($provide) {
                $provide.factory('whereFilter', whereFilter);
            }]);

            appModule.filter("timeFilter", function () {
                return function (timestamp) {
                    return timestamp == null ? "" : timestamp.toString("HH:mm");
                };
            }).filter("dateFilter", function () {
                return function (timestamp) {
                    return timestamp == null ? "" : timestamp.toString("yyyy-MM-dd");
                };
            }).filter("timeFilter", function () {
                return function (timestamp) {
                    return timestamp == null ? "" : timestamp.toString("HH:mm");
                };
            }).filter("shortTimeFilter", function () {
                return function (seconds) {
                    if (seconds == null) {
                        return "";
                    } else {
                        var minutes = Math.trunc(seconds / 60),
                            remainSeconds = seconds - minutes * 60,
                            milliSeconds = remainSeconds - Math.trunc(remainSeconds);

                        return "%02d:%02d.%03d".sprintf(minutes, Math.trunc(remainSeconds), Math.trunc(milliSeconds * 1000));
                    }
                };
            }).filter("percentFilter", function () {
                return function (num) {
                    return num == null ? "" : "{0}%".format(num * 100);
                };
            }).filter("in", function () {
                return function (item, arr) {
                    if (arr && toString.call(arr) === '[object Array]') {
                        return !arr.every(function (a) {
                            return a !== item;
                        });
                    }

                    return false;
                };
            }).filter("without", function () {
                return function (array, others, props) {
                    var result = [];

                    if (toString.call(array) === '[object Array]' && array.length) {
                        if (others && others.length) {
                            if (props) {
                                if (typeof props === "string") {
                                    props = [props];
                                }

                                if (toString.call(props) === '[object Array]') {
                                    array.forEach(function (item) {
                                        if (others.every(function (o) {
                                                return !props.every(function (prop) {
                                                    return o[prop] === item[prop];
                                                });
                                            })) {
                                            result.push(item);
                                        }
                                    });
                                }
                            } else {
                                array.forEach(function (item) {
                                    if (others.every(function (o) {
                                            return o !== item;
                                        })) {
                                        result.push(item);
                                    }
                                });
                            }
                        } else {
                            result = _.clone(array);
                        }
                    }

                    return result;
                };
            }).filter("with", function () {
                return function (array, others, props) {
                    var result = [];

                    if (toString.call(array) === '[object Array]' && array.length) {
                        if (others && others.length) {
                            if (props) {
                                if (typeof props === "string") {
                                    props = [props];
                                }

                                if (toString.call(props) === '[object Array]') {
                                    array.forEach(function (item) {
                                        if (!others.every(function (o) {
                                                return !props.every(function (prop) {
                                                    return o[prop] === item[prop];
                                                });
                                            })) {
                                            result.push(item);
                                        }
                                    });
                                }
                            } else {
                                array.forEach(function (item) {
                                    if (!others.every(function (o) {
                                            return o !== item;
                                        })) {
                                        result.push(item);
                                    }
                                });
                            }
                        }
                    }

                    return result;
                };
            }).filter('makeRange', function () {
                return function (input) {
                    var lowBound, highBound;
                    switch (input.length) {
                        case 1:
                            lowBound = 0;
                            highBound = parseInt(input[0]);
                            break;
                        case 2:
                            lowBound = parseInt(input[0]);
                            highBound = parseInt(input[1]);
                            break;
                        default:
                            return input;
                    }
                    var result = [];
                    for (var i = lowBound; i < highBound; i++)
                        result.push(i);
                    return result;
                };
            }).filter('to_trusted', ['$sce', function ($sce) {
                return function (text) {
                    return $sce.trustAsHtml(text);
                }
            }]);
        }
    });