const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url =
        'http://api.weatherstack.com/forecast?access_key=fdd2f84fabe723a59dbfc94723af71a7&query=' +
        encodeURIComponent(latitude) +
        ',' +
        encodeURIComponent(longitude);

    request.get({ url, json: true }, (error, { statusCode, body }) => {
        if (error) {
            callback('Unable to connect to weather services');
            return;
        }

        if (statusCode !== 200) {
            callback('Network request failed: \n' + JSON.stringify(body));
            return;
        }

        if (!body.success && body.error && body.error.info) {
            callback(body.error.info);
            return;
        }

        callback(undefined, ({ temperature, feelslike } = body.current));
    });
};

module.exports = forecast;
