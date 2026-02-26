const os = require('os');
const fs = require('fs');
const path = require('path');

const originalNetworkInterfaces = os.networkInterfaces.bind(os);

// #region agent log
function writeDebugLog(payload) {
  try {
    const logPath = path.join(
      __dirname,
      '.cursor',
      'debug-382733.log',
    );
    const entry = JSON.stringify(
      {
        id: `log_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        sessionId: '382733',
        runId: payload.runId,
        hypothesisId: payload.hypothesisId,
        location: payload.location,
        message: payload.message,
        data: payload.data,
        timestamp: Date.now(),
      },
    );
    fs.appendFileSync(logPath, entry + '\n', { encoding: 'utf8' });
  } catch {
    // ignore logging failures
  }
}
// #endregion

os.networkInterfaces = function patchedNetworkInterfaces() {
  try {
    const result = originalNetworkInterfaces();
    // #region agent log
    writeDebugLog({
      runId: 'initial',
      hypothesisId: 'H1',
      location: 'patch-network.js:33',
      message: 'os.networkInterfaces succeeded',
      data: {},
    });
    // #endregion
    return result;
  } catch (error) {
    // #region agent log
    writeDebugLog({
      runId: 'initial',
      hypothesisId: 'H1',
      location: 'patch-network.js:44',
      message: 'os.networkInterfaces failed, returning empty map',
      data: {
        name: error.name,
        code: error.code,
        message: error.message,
      },
    });
    // #endregion
    return {};
  }
};

