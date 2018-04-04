var winston = require("winston");
var config = require('config'); // 使用"config"模組來控制組態與設定

var default_log_level = config.get('app.log_level'); //取得設定的log level

// 預設的Log level是'debug'
var level = process.env.LOG_LEVEL || default_log_level || 'debug';

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: level,
            colorize: true,
            timestamp: function () {
                return (new Date()).toISOString();
            }
        })
    ]
});

module.exports = logger
