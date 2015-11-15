/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
    TimerMixin,
    } = React;

var AppServiceClass = function() {};

AppServiceClass.prototype.getJoinItems = function (userId) {
	return new Promise((resolve, reject) => {
	  LocalAppAPI.getJoinItems(userId, function(result) {
	    if (result && result.length) {
	        result.splice(0, 0, 0, 0);
	        Array.prototype.splice.apply(AppContext.joinItems, result);
	    }
	    resolve(result);
	  });
	}, function(err) {
	    reject(err);
	});
}

AppServiceClass.prototype.restoreUserFromStorage = function () {
	return new Promise((resolve, reject) => {
	  LocalAppAPI.restoreUserFromStorage(function(result) {
	    if (result && result.length) {
	    	AppContext.loginUser = result;
	    }
	    resolve(result);
	  });
	});
}

AppServiceClass.prototype.doLogin = function (loginName, plainPassword) {
	return new Promise((resolve, reject) => {
	  LocalAppAPI.doLogin(loginName, plainPassword, function(result) {
	    if (result && result.length) {
	    	AppContext.loginUser = result;
	    }
	    resolve(result);
	  });
	}, function(err) {
	    reject(err);
	});
}

AppServiceClass.prototype.doLogout = function () {
	return new Promise((resolve, reject) => {
	  LocalAppAPI.restoreUserFromStorage(function(result) {
        AppContext.loginUser = null;
	    resolve();
	  });
	});
}
module.exports = new AppServiceClass();
