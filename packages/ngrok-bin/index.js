try {
  module.exports = require.resolve(
    "@expo/ngrok-bin-" + process.platform + "-" + process.arch + "/ngrok"
  );
} catch (e) {
  module.exports = null;
}
