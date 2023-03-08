import { NativeEventEmitter, NativeModule } from 'react-native';

import type {
  dismissType,
  extendedBugReportMode,
  floatingButtonEdge,
  invocationEvent,
  option,
  position,
  reportType,
} from '../utils/ArgsRegistry';
import type {
  DismissType,
  ExtendedBugReportMode,
  FloatingButtonPosition,
  InvocationEvent,
  InvocationOption,
  RecordingButtonPosition,
  ReportType,
} from '../utils/Enums';
import { NativeModules } from './NativePackage';

export interface BugReportingNativeModule extends NativeModule {
  // Essential APIs //
  setEnabled(isEnabled: boolean): void;
  show(type: reportType | ReportType, options: option[] | InvocationOption[]): void;

  // Customization APIs //
  setInvocationEvents(events: invocationEvent[] | InvocationEvent[]): void;
  setOptions(options: option[] | InvocationOption[]): void;
  setExtendedBugReportMode(mode: extendedBugReportMode | ExtendedBugReportMode): void;
  setReportTypes(types: reportType[] | ReportType[]): void;
  setDisclaimerText(text: string): void;
  setCommentMinimumCharacterCount(limit: number, reportTypes: reportType[] | ReportType[]): void;
  setFloatingButtonEdge(edge: floatingButtonEdge | FloatingButtonPosition, offset: number): void;
  setVideoRecordingFloatingButtonPosition(buttonPosition: position | RecordingButtonPosition): void;
  setEnabledAttachmentTypes(
    screenshot: boolean,
    extraScreenshot: boolean,
    galleryImage: boolean,
    screenRecording: boolean,
  ): void;

  // Screen Recording APIs //
  setAutoScreenRecordingEnabled(isEnabled: boolean): void;
  setAutoScreenRecordingDuration(maxDuration: number): void;
  setViewHierarchyEnabled(isEnabled: boolean): void;

  // Shaking Threshold APIs //
  setShakingThresholdForiPhone(threshold: number): void;
  setShakingThresholdForiPad(threshold: number): void;
  setShakingThresholdForAndroid(threshold: number): void;

  // Callbacks //
  setOnInvokeHandler(handler: () => void): void;
  setDidSelectPromptOptionHandler(handler: (promptOption: string) => void): void;
  setOnSDKDismissedHandler(
    handler: (dismissType: dismissType | DismissType, reportType: reportType | ReportType) => void,
  ): void;
}

export const NativeBugReporting = NativeModules.IBGBugReporting;

export enum NativeEvents {
  ON_INVOKE_HANDLER = 'IBGpreInvocationHandler',
  ON_DISMISS_HANDLER = 'IBGpostInvocationHandler',
  DID_SELECT_PROMPT_OPTION_HANDLER = 'IBGDidSelectPromptOptionHandler',
}

export const emitter = new NativeEventEmitter(NativeBugReporting);