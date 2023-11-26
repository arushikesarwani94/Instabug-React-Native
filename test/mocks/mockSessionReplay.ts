import type { SessionReplayNativeModule } from '../../src/native/NativeSessionReplay';

const mockSessionReplay: SessionReplayNativeModule = {
  addListener: jest.fn(),
  removeListeners: jest.fn(),
  setEnabled: jest.fn(),
  setNetworkLogsEnabled: jest.fn(),
  setInstabugLogsEnabled: jest.fn(),
  setUserStepsEnabled: jest.fn(),
};

export default mockSessionReplay;