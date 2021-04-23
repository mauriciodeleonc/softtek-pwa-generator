module.exports = function ({ env }) {
    return {
        webpack: {
            configure: {
                target: 'electron-renderer'
            }
        }
    };
}