var RN = require('react-native');

require('babel-core/register')({
    ignore: function (filename) {
        if (filename.indexOf("node_modules") === -1) {
            return false;
        }
        return true;
    }
});