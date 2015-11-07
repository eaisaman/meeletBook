/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var AppEvents = {
  normalScanEvent: "normalScan",
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
  downloadProjectModulesProgressEvent: "downloadProjectModulesProgress",
}

module.exports = AppEvents;
