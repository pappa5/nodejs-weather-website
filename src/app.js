const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

const app = express();
const port = process.env.PORT || 3000;

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Me'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Who am I',
        name: 'Me'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        name: 'Me'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        res.send({
            error: 'You must provide an address'
        });
        return;
    }

    geoCode(
        req.query.address,
        (error, { latitude, longitude, place_name } = {}) => {
            if (error) {
                res.send({
                    error: error
                });
                return;
            }

            forecast(
                latitude,
                longitude,
                (error, { temperature, feelslike } = {}) => {
                    if (error) {
                        res.send({
                            error: error
                        });
                        return;
                    }

                    res.send({
                        forecast: temperature + ' degrees',
                        location: place_name,
                        address: req.query.address
                    });
                }
            );
        }
    );
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        res.send({
            error: 'You must provide a search term'
        });
        return;
    }

    res.send({ products: [] });
});

app.get('/help/*', (req, res) => {
    res.render('error', {
        message: 'Help article not found',
        title: 'Error',
        name: 'Me'
    });
});

app.get('*', (req, res) => {
    res.render('error', {
        message: 'Page not found',
        title: 'Error',
        name: 'Me'
    });
});

app.listen(port, () => {
    console.log('Server is up on port', port);
});
