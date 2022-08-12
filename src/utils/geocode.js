const request = require('request');

const geoCode = (address, callback) => {
    const url =
        'http://api.positionstack.com/v1/forward?access_key=586437d32341bb6decf33432d2c8683e&query=' +
        encodeURIComponent(address);

    request.get({ url, json: true }, (error, { statusCode, body }) => {
        if (error) {
            callback('Unable to connect to location services');
            return;
        }

        if (statusCode !== 200) {
            if (body.error.context.query.message) {
                callback(body.error.context.query.message);
                return;
            }

            callback(`Network request failed`);
            return;
        }

        if (body.data.length === 0) {
            callback('Location not found for ' + address);
            return;
        }

        const { latitude, longitude, label } = body.data[0];

        callback(undefined, { latitude, longitude, place_name: label });
    });
};

module.exports = geoCode;
