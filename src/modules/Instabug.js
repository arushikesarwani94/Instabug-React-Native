import { findNodeHandle, NativeModules, Platform, processColor } from 'react-native';
import Report from '../models/Report';
import NetworkLogger from './NetworkLogger';
import IBGEventEmitter from '../utils/IBGEventEmitter';
import InstabugConstants from '../utils/InstabugConstants';
import InstabugUtils, { stringifyIfNotString } from '../utils/InstabugUtils';
import ArgsRegistry from '../utils/ArgsRegistry';
let { Instabug } = NativeModules;

var _currentScreen = null;
var _lastScreen = null;
var _isFirstScreen = false;
const firstScreen = 'Initial Screen';

/**
 * Instabug
 * @exports Instabug
 */
export default {
  /**
   * Starts the SDK.
   * This is the main SDK method that does all the magic. This is the only
   * method that SHOULD be called.
   * Should be called in constructor of the AppRegistry component
   * @param {string} token The token that identifies the app, you can find
   * it on your dashboard.
   * @param {invocationEvent} invocationEvent The event that invokes
   * the SDK's UI.
   */
  start: function (token, invocationEvent) {
    InstabugUtils.captureJsErrors();
    NetworkLogger.setEnabled(true);

    Instabug.start(token, invocationEvent);

    _isFirstScreen = true;
    _currentScreen = firstScreen;
    setTimeout(function () {
      if (_currentScreen == firstScreen) {
        Instabug.reportScreenChange(firstScreen);
        _currentScreen = null;
      }
    }, 1000);
  },

  /**
   * Attaches user data to each report being sent.
   * Each call to this method overrides the user data to be attached.
   * Maximum size of the string is 1,000 characters.
   * @param {string} userData A string to be attached to each report, with a
   * maximum size of 1,000 characters.
   */
  setUserData(userData) {
    Instabug.setUserData(userData);
  },

  /**
   * Sets whether the SDK is tracking user steps or not.
   * Enabling user steps would give you an insight on the scenario a user has
   * performed before encountering a bug or a crash. User steps are attached
   * with each report being sent.
   * @param {boolean} isUserStepsEnabled A boolean to set user steps tracking
   * to being enabled or disabled.
   */
  setTrackUserSteps(isEnabled) {
    if (Platform.OS === 'ios') Instabug.setTrackUserSteps(isEnabled);
  },

  /**
   * Sets whether IBGLog should also print to Xcode's console log or not.
   * @param {boolean} printsToConsole A boolean to set whether printing to
   *                  Xcode's console is enabled or not.
   */
  setIBGLogPrintsToConsole(printsToConsole) {
    if (Platform.OS === 'ios') Instabug.setIBGLogPrintsToConsole(printsToConsole);
  },

  /**
   * The session profiler is enabled by default and it attaches to the bug and
   * crash reports the following information during the last 60 seconds before the report is sent.
   * @param {boolean} sessionProfilerEnabled - A boolean parameter to enable or disable the feature.
   *
   */
  setSessionProfilerEnabled(sessionProfilerEnabled) {
    Instabug.setSessionProfilerEnabled(sessionProfilerEnabled);
  },

  /**
   * This API sets the verbosity level of logs used to debug The SDK. The defualt value in debug
   * mode is sdkDebugLogsLevelVerbose and in production is sdkDebugLogsLevelError.
   * @param {sdkDebugLogsLevel} sdkDebugLogsLevel - The verbosity level of logs.
   *
   */
  setSdkDebugLogsLevel(sdkDebugLogsLevel) {
    if (Platform.OS === 'ios') {
      Instabug.setSdkDebugLogsLevel(sdkDebugLogsLevel);
    }
  },

  /**
   * Sets the SDK's locale.
   * Use to change the SDK's UI to different language.
   * Defaults to the device's current locale.
   * @param {locale} locale A locale to set the SDK to.
   */
  setLocale(locale) {
    Instabug.setLocale(locale);
  },

  /**
   * Sets the color theme of the SDK's whole UI.
   * the SDK's UI to.
   * @param colorTheme
   */
  setColorTheme(colorTheme) {
    Instabug.setColorTheme(colorTheme);
  },

  /**
   * Sets the primary color of the SDK's UI.
   * Sets the color of UI elements indicating interactivity or call to action.
   * To use, import processColor and pass to it with argument the color hex
   * as argument.
   * @param {color} color A color to set the UI elements of the SDK to.
   */
  setPrimaryColor(color) {
    Instabug.setPrimaryColor(processColor(color));
  },

  /**
   * Appends a set of tags to previously added tags of reported feedback,
   * bug or crash.
   * @param {string[]} tags An array of tags to append to current tags.
   */
  appendTags(tags) {
    Instabug.appendTags(tags);
  },

  /**
   * Manually removes all tags of reported feedback, bug or crash.
   */
  resetTags() {
    Instabug.resetTags();
  },

  /**
   * Gets all tags of reported feedback, bug or crash.
   * @param {tagsCallback} tagsCallback callback with argument tags of reported feedback, bug or crash.
   */
  getTags(tagsCallback) {
    Instabug.getTags(tagsCallback);
  },

  /**
   * Overrides any of the strings shown in the SDK with custom ones.
   * Allows you to customize any of the strings shown to users in the SDK.
   * @param {string} string String value to override the default one.
   * @param {strings} key Key of string to override.
   */
  setString(key, string) {
    Instabug.setString(string, key);
  },

  /**
   * Sets the default value of the user's email and hides the email field from the reporting UI
   * and set the user's name to be included with all reports.
   * It also reset the chats on device to that email and removes user attributes,
   * user data and completed surveys.
   * @param {string} email Email address to be set as the user's email.
   * @param {string} name Name of the user to be set.
   */
  identifyUser(email, name) {
    Instabug.identifyUser(email, name);
  },

  /**
   * Sets the default value of the user's email to nil and show email field and remove user name
   * from all reports
   * It also reset the chats on device and removes user attributes, user data and completed surveys.
   */
  logOut() {
    Instabug.logOut();
  },

  /**
   * Logs a user event that happens through the lifecycle of the application.
   * Logged user events are going to be sent with each report, as well as at the end of a session.
   * @param {string} name Event name.
   */
  logUserEvent(name) {
    Instabug.logUserEvent(name);
  },

  /**
   * Appends a log message to Instabug internal log
   * <p>
   * These logs are then sent along the next uploaded report.
   * All log messages are timestamped <br/>
   * Logs aren't cleared per single application run.
   * If you wish to reset the logs,
   * use {@link #clearLogs()} ()}
   * </p>
   * Note: logs passed to this method are <b>NOT</b> printed to Logcat
   *
   * @param message    the message
   */
  logVerbose(message) {
    if (!message) return;
    message = stringifyIfNotString(message);
    Instabug.logVerbose(message);
  },

  /**
   * Appends a log message to Instabug internal log
   * <p>
   * These logs are then sent along the next uploaded report.
   * All log messages are timestamped <br/>
   * Logs aren't cleared per single application run.
   * If you wish to reset the logs,
   * use {@link #clearLogs()} ()}
   * </p>
   * Note: logs passed to this method are <b>NOT</b> printed to Logcat
   *
   * @param message    the message
   */
  logInfo(message) {
    if (!message) return;
    message = stringifyIfNotString(message);
    Instabug.logInfo(message);
  },

  /**
   * Appends a log message to Instabug internal log
   * <p>
   * These logs are then sent along the next uploaded report.
   * All log messages are timestamped <br/>
   * Logs aren't cleared per single application run.
   * If you wish to reset the logs,
   * use {@link #clearLogs()} ()}
   * </p>
   * Note: logs passed to this method are <b>NOT</b> printed to Logcat
   *
   * @param message    the message
   */
  logDebug(message) {
    if (!message) return;
    message = stringifyIfNotString(message);
    Instabug.logDebug(message);
  },

  /**
   * Appends a log message to Instabug internal log
   * <p>
   * These logs are then sent along the next uploaded report.
   * All log messages are timestamped <br/>
   * Logs aren't cleared per single application run.
   * If you wish to reset the logs,
   * use {@link #clearLogs()} ()}
   * </p>
   * Note: logs passed to this method are <b>NOT</b> printed to Logcat
   *
   * @param message    the message
   */
  logError(message) {
    if (!message) return;
    message = stringifyIfNotString(message);
    Instabug.logError(message);
  },

  /**
   * Appends a log message to Instabug internal log
   * <p>
   * These logs are then sent along the next uploaded report.
   * All log messages are timestamped <br/>
   * Logs aren't cleared per single application run.
   * If you wish to reset the logs,
   * use {@link #clearLogs()} ()}
   * </p>
   * Note: logs passed to this method are <b>NOT</b> printed to Logcat
   *
   * @param message    the message
   */
  logWarn(message) {
    if (!message) return;
    message = stringifyIfNotString(message);
    Instabug.logWarn(message);
  },

  /**
   * Clear all Instabug logs, console logs, network logs and user steps.
   */
  clearLogs() {
    Instabug.clearLogs();
  },

  /**
   * Sets whether user steps tracking is visual, non visual or disabled.
   * User Steps tracking is enabled by default if it's available
   * in your current plan.
   *
   * @param {reproStepsMode} reproStepsMode An enum to set user steps tracking
   * to be enabled, non visual or disabled.
   */
  setReproStepsMode(reproStepsMode) {
    Instabug.setReproStepsMode(reproStepsMode);
  },

  /**
   * Sets user attribute to overwrite it's value or create a new one if it doesn't exist.
   *
   * @param key   the attribute
   * @param value the value
   */
  setUserAttribute(key, value) {
    if (!key || typeof key !== 'string' || typeof value !== 'string')
      throw new TypeError('Invalid param, Expected String');
    Instabug.setUserAttribute(key, value);
  },

  /**
       * Returns the user attribute associated with a given key.
       aKey
       * @param {string} key The attribute key as string
       * @param {function} userAttributeCallback callback with argument as the desired user attribute value
       */
  getUserAttribute(key, userAttributeCallback) {
    Instabug.getUserAttribute(key, userAttributeCallback);
  },

  /**
   * Removes user attribute if exists.
   *
   * @param key the attribute key as string
   * @see #setUserAttribute(String, String)
   */
  removeUserAttribute(key) {
    if (!key || typeof key !== 'string') throw new TypeError('Invalid param, Expected String');
    Instabug.removeUserAttribute(key);
  },

  /**
   * @summary Returns all user attributes.
   * @param {function} userAttributesCallback callback with argument A new dictionary containing
   * all the currently set user attributes, or an empty dictionary if no user attributes have been set.
   */
  getAllUserAttributes(userAttributesCallback) {
    Instabug.getAllUserAttributes(userAttributesCallback);
  },

  /**
   * Clears all user attributes if exists.
   */
  clearAllUserAttributes() {
    Instabug.clearAllUserAttributes();
  },

  /**
   * Enable/Disable debug logs from Instabug SDK
   * Default state: disabled
   *
   * @param isDebugEnabled whether debug logs should be printed or not into LogCat
   */
  setDebugEnabled(isDebugEnabled) {
    if (Platform.OS === 'android') {
      Instabug.setDebugEnabled(isDebugEnabled);
    }
  },

  /**
   * Enables all Instabug functionality
   * It works on android only
   */
  enable() {
    if (Platform.OS === 'android') {
      Instabug.enable();
    }
  },

  /**
   * Disables all Instabug functionality
   * It works on android only
   */
  disable() {
    if (Platform.OS === 'android') {
      Instabug.disable();
    }
  },

  /**
   * @summary Checks whether app is development/Beta testing OR live
   * Note: This API is iOS only
   * It returns in the callback false if in development or beta testing on Test Flight, and
   * true if app is live on the app store.
   * @param {function} runningLiveCallBack callback with argument as return value 'isLive'
   */
  isRunningLive(runningLiveCallBack) {
    if (Platform.OS === 'ios') {
      Instabug.isRunningLive(runningLiveCallBack);
    }
  },

  /**
   * Shows the welcome message in a specific mode.
   * @param welcomeMessageMode An enum to set the welcome message mode to
   *                           live, or beta.
   *
   */
  showWelcomeMessage(welcomeMessageMode) {
    Instabug.showWelcomeMessageWithMode(welcomeMessageMode);
  },

  /**
   * Sets the welcome message mode to live, beta or disabled.
   * @param welcomeMessageMode An enum to set the welcome message mode to
   *                           live, beta or disabled.
   *
   */
  setWelcomeMessageMode(welcomeMessageMode) {
    Instabug.setWelcomeMessageMode(welcomeMessageMode);
  },

  /**
   * Add file to be attached to the bug report.
   * @param {string} filePath
   * @param {string} fileName
   */
  addFileAttachment(filePath, fileName) {
    if (Platform.OS === 'android') {
      Instabug.setFileAttachment(filePath, fileName);
    } else {
      Instabug.setFileAttachment(filePath);
    }
  },

  /**
   * @deprecated Use {@link Instabug.addPrivateView} instead.
   *
   * Hides component from screenshots, screen recordings and view hierarchy.
   * @param {Object} viewRef the ref of the component to hide
   */
  setPrivateView(viewRef) {
    this.addPrivateView(viewRef);
  },

  /**
   * Hides component from screenshots, screen recordings and view hierarchy.
   * @param {Object} viewRef the ref of the component to hide
   */
  addPrivateView(viewRef) {
    const nativeTag = findNodeHandle(viewRef);
    Instabug.addPrivateView(nativeTag);
  },

  /**
   * Removes component from the set of hidden views. The component will show again in
   * screenshots, screen recordings and view hierarchy.
   * @param {Object} viewRef the ref of the component to remove from hidden views
   */
  removePrivateView(viewRef) {
    const nativeTag = findNodeHandle(viewRef);
    Instabug.removePrivateView(nativeTag);
  },

  /**
   * Shows default Instabug prompt.
   */
  show() {
    Instabug.show();
  },

  onReportSubmitHandler(preSendingHandler) {
    if (preSendingHandler) {
      InstabugUtils.setOnReportHandler(true);
    } else {
      InstabugUtils.setOnReportHandler(false);
    }
    // send bug report
    IBGEventEmitter.addListener(Instabug, InstabugConstants.PRESENDING_HANDLER, report => {
      const { tags, consoleLogs, instabugLogs, userAttributes, fileAttachments } = report;
      const reportObj = new Report(
        tags,
        consoleLogs,
        instabugLogs,
        userAttributes,
        fileAttachments,
      );
      preSendingHandler(reportObj);
    });

    // handled js crash
    if (Platform.OS === 'android') {
      IBGEventEmitter.addListener(
        Instabug,
        InstabugConstants.SEND_HANDLED_CRASH,
        async jsonObject => {
          try {
            let report = await Instabug.getReport();
            const { tags, consoleLogs, instabugLogs, userAttributes, fileAttachments } = report;
            const reportObj = new Report(
              tags,
              consoleLogs,
              instabugLogs,
              userAttributes,
              fileAttachments,
            );
            preSendingHandler(reportObj);
            Instabug.sendHandledJSCrash(JSON.stringify(jsonObject));
          } catch (e) {
            console.error(e);
          }
        },
      );
    }

    if (Platform.OS === 'android') {
      IBGEventEmitter.addListener(
        Instabug,
        InstabugConstants.SEND_UNHANDLED_CRASH,
        async jsonObject => {
          let report = await Instabug.getReport();
          const { tags, consoleLogs, instabugLogs, userAttributes, fileAttachments } = report;
          const reportObj = new Report(
            tags,
            consoleLogs,
            instabugLogs,
            userAttributes,
            fileAttachments,
          );
          preSendingHandler(reportObj);
          Instabug.sendJSCrash(JSON.stringify(jsonObject));
        },
      );
    }

    Instabug.setPreSendingHandler(preSendingHandler);
  },

  callPrivateApi(apiName, param) {
    Instabug.callPrivateApi(apiName, param);
  },

  onNavigationStateChange(prevState, currentState, action) {
    const currentScreen = InstabugUtils.getActiveRouteName(currentState);
    const prevScreen = InstabugUtils.getActiveRouteName(prevState);

    if (prevScreen !== currentScreen) {
      if (_currentScreen != null && _currentScreen != firstScreen) {
        Instabug.reportScreenChange(_currentScreen);
        _currentScreen = null;
      }
      _currentScreen = currentScreen;
      setTimeout(function () {
        if (_currentScreen == currentScreen) {
          Instabug.reportScreenChange(currentScreen);
          _currentScreen = null;
        }
      }, 1000);
    }
  },

  onStateChange(state) {
    const currentScreen = InstabugUtils.getFullRoute(state);
    if (_currentScreen != null && _currentScreen != firstScreen) {
      Instabug.reportScreenChange(_currentScreen);
      _currentScreen = null;
    }
    _currentScreen = currentScreen;
    setTimeout(function () {
      if (_currentScreen == currentScreen) {
        Instabug.reportScreenChange(currentScreen);
        _currentScreen = null;
      }
    }, 1000);
  },

  reportScreenChange(screenName) {
    Instabug.reportScreenChange(screenName);
  },

  /**
   * Add experiments to next report.
   * @param {string[]} experiments An array of experiments to add to the next report.
   */
  addExperiments(experiments) {
    Instabug.addExperiments(experiments);
  },

  /**
   * Remove experiments from next report.
   * @param {string[]} experiments An array of experiments to remove from the next report.
   */
  removeExperiments(experiments) {
    Instabug.removeExperiments(experiments);
  },

  /**
   * Clear all experiments
   */
  clearAllExperiments() {
    Instabug.clearAllExperiments();
  },

  componentDidAppearListener({ componentId, componentName, passProps }) {
    if (_isFirstScreen) {
      _lastScreen = componentName;
      _isFirstScreen = false;
      return;
    }
    if (_lastScreen != componentName) {
      Instabug.reportScreenChange(componentName);
      _lastScreen = componentName;
    }
  },

  /**
   * The event used to invoke the feedback form
   * @readonly
   * @enum {number}
   */
  invocationEvent: ArgsRegistry.invocationEvent,

  /**
   * The user steps option.
   * @readonly
   * @enum {number}
   */
  reproStepsMode: ArgsRegistry.reproStepsMode,

  /**
   * Type of SDK dismiss
   * @readonly
   * @enum {number}
   */
  dismissType: ArgsRegistry.dismissType,

  /**
   * Verbosity level of the SDK debug logs. This has nothing to do with IBGLog,
   * and only affect the logs used to debug the SDK itself.
   * @readonly
   * @enum {number}
   */
  sdkDebugLogsLevel: ArgsRegistry.sdkDebugLogsLevel,

  /**
   *  The extended bug report mode
   * @readonly
   * @enum {number}
   */
  extendedBugReportMode: ArgsRegistry.extendedBugReportMode,

  /**
   * The supported locales
   * @readonly
   * @enum {number}
   */
  locale: ArgsRegistry.locale,

  /**
   * The color theme of the different UI elements
   * @readonly
   * @enum {number}
   */
  colorTheme: ArgsRegistry.colorTheme,

  /**
   * Rectangle edges
   * @readonly
   * @enum {number}
   */
  floatingButtonEdge: ArgsRegistry.floatingButtonEdge,

  /**
   * Instabug floating buttons positions.
   * @readonly
   * @enum {number}
   */
  IBGPosition: ArgsRegistry.position,

  /**
   * The welcome message mode.
   * @readonly
   * @enum {number}
   */
  welcomeMessageMode: ArgsRegistry.welcomeMessageMode,

  /**
   * Instabug action types.
   * @readonly
   * @enum {number}
   */
  actionTypes: ArgsRegistry.actionTypes,

  /**
   * Instabug strings
   * @readonly
   * @enum {number}
   */
  strings: ArgsRegistry.strings,
};