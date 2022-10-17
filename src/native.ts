import {
  NativeModule as ReactNativeModule,
  NativeModules as ReactNativeModules,
} from 'react-native';

export interface NativeModule extends ReactNativeModule, Record<string, any> {}

interface InstabugNativeModules {
  IBGAPM: NativeModule;
  IBGBugReporting: NativeModule;
  IBGCrashReporting: NativeModule;
  IBGFeatureRequests: NativeModule;
  Instabug: NativeModule;
  IBGReplies: NativeModule;
  IBGSurveys: NativeModule;
}

export const NativeModules = ReactNativeModules as InstabugNativeModules;

export const NativeAPM = NativeModules.IBGAPM;
export const NativeBugReporting = NativeModules.IBGBugReporting;
export const NativeCrashReporting = NativeModules.IBGCrashReporting;
export const NativeFeatureRequests = NativeModules.IBGFeatureRequests;
export const NativeInstabug = NativeModules.Instabug;
export const NativeReplies = NativeModules.IBGReplies;
export const NativeSurveys = NativeModules.IBGSurveys;