/*
 * All background images from Unsplash.com
 * Weather info from https://fcc-weather-api.glitch.me, which appears
 * to source from https://openweathermap.org/ but prevent an overload
 * in case many FCC users pull the data repeatedly
 */

import 'normalize.css/normalize.css'; // reset all browser conventions
import './../public/styles.scss';

import $ from 'jquery';

function getLocation() {
    $.getJSON('https://ipinfo.io/json', (json) => {
        getWeather(json.city, json.country, json.loc);
    });
}

// Given a degree (0-360) we return one of N, E, S, W or NE, SE, SW, NW.
function getDirection(degrees) {
    if (degrees < 22.5 || degrees >= 337.5 ) {
        return 'N';
    } else if (degrees < 67.5) {
        return 'NE';
    } else if (degrees < 112.5) {
        return 'E';
    } else if (degrees < 157.5) {
        return 'SE';
    } else if (degrees < 202.5) {
        return 'S';
    } else if (degrees < 247.5) {
        return 'SW';
    } else if (degrees < 292.5) {
        return 'W';
    } else {
        return 'NW';
    }
}

// load weather for the location given by the IP API fetch. The weather API
// sometimes gives the wrong output when the correct coordinates are given
// so we can check if the API call was correct or not and display results
// accordingly? We ignore this for now as there is no guarantee how to ensure
// the API call comes back correctly
//
// Details on what the API returns (in particular in what units) can be found at
// https://openweathermap.org/current
function getWeather(city, country, location) {
    const splitLocation = location.split(',');
    const lat = splitLocation[0];
    const lon = splitLocation[1];
    $.getJSON('https://fcc-weather-api.glitch.me/api/current?lat=' + lat + '&lon=' + lon, (json) => {
        $('#location').html(json.name + ', ' + json.sys.country);
        $('#temperature').html(json.main.temp);
        $('#main-weather').html(json.weather[0].main);
        $('#weather-icon').attr('src', json.weather[0].icon);
        if (!json.weather[0].icon) {
            $('#image-container').css({
                display: 'none'
            });
        } else {
            $('#image-container').css({
                display: 'block'
            });
        }
        $('#weather-description').html(json.weather[0].description);
        $('#humidity').html(json.main.humidity);
        $('#pressure').html(json.main.pressure/10);
        $('#wind-speed').html(Math.floor(100*json.wind.speed*36/10)/100);
        if (!!json.wind.gust) {
            $('#wind-gusts').html(Math.floor(100*json.wind.gust*36/10)/100);
            $('#wind-gust-units').html('km/h');
        } else {
            $('#wind-gusts').html('none');
            $('#wind-gust-units').html('');
        }
        $('#wind-direction').html(getDirection(json.wind.deg));
        // The API uses unix UTC time for both sunrise and sunset, i.e., number of
        // seconds since 'the epoch', while the toLocaleTimeString() requires milliseconds
        $('#sunrise').html(new Date(json.sys.sunrise*1000).toLocaleTimeString());
        $('#sunset').html(new Date(json.sys.sunset*1000).toLocaleTimeString());

        if (json.weather[0].main === 'Rain' || json.weather[0].main === 'Drizzle') {
            setRain();
        } else if (json.weather[0].main === 'Snow') {
            setSnow();
        } else if (json.weather[0].main === 'Clear') {
            setSunny();
        } else if (json.weather[0].main === 'Thunderstorm') {
            setStorm();
        }
    });
}

function setRain() {
    $('body').css('background-image', 'url(/Images/rain-mobile.png)');
    $('h1').css('color', 'white');
    $('#location').css('color', 'white');
    $('#temperature-container').css('color', 'white');
    $('#main-weather').css('color', 'white');
    $('#comma').css('color', 'white');
    $('#weather-description').css('color', 'white');
    $('#more-weather-details').css('background', 'rgba(0, 0, 0, 0.7)');
}

function setSnow() {
    $('body').css('background-image', 'url(/Images/snow-mobile.png)');
    $('#more-weather-details').css('background', 'rgba(0, 0, 0, 0.5)');
}

function setSunny() {
    $('body').css('background-image', 'url(/Images/sunny-mobile.png)');
    $('#more-weather-details').css('background', 'rgba(0, 0, 0, 0.7)');
}

function setStorm() {
    $('body').css('background-image', 'url(/Images/storm-mobile.png)');
    $('#more-weather-details').css('background', 'rgba(0, 0, 0, 0.7)');
}

$('#more-weather-toggle').click(() => {
    if ($('#more-weather-contents-container').hasClass('hide')) {
        $('#details-toggle').html('Less Details');
        $('#more-weather-toggle-image').animate({
            'margin-left': '90%'
        }, 1000, () => {
            $('#more-weather-toggle-image').attr('src', '/Images/wind-close.png');
        });
        $('#more-weather-contents-container').animate({
            height: 'toggle'
        }, 1000, () => {
            $('#more-weather-contents-container').css({
                display: 'block'
            });
        }).removeClass('hide');
    } else {
        $('#details-toggle').html('More Details');
        $('#more-weather-toggle-image').animate({
            'margin-left': '0'
        }, 1000, () => {
            $('#more-weather-toggle-image').attr('src', '/Images/wind-open.png');
        });
        $('#more-weather-contents-container').animate({
            height: 'toggle'
        }, 1000).addClass('hide');
    }
});

// We allow the user to convert between weather in degrees Celsius, and
// degrees Farenheight. Because dividing by 9 can leave an incorrect rounding
// we force the return to only have 2 digits after the decimal. We only 
// do it here because the conversion to Farenheit can only add a single
// decimal and we do not want to allow rounding error to grow if the user
// keeps converting between the two options
$('#convert-degrees').click(() => {
    if ($('#convert-degrees').text() === 'C') {
        $('#convert-degrees').text('F');
        $('#temperature').html($('#temperature').html()*9/5+32);
    } else {
        $('#convert-degrees').text('C');
        $('#temperature').html( Math.floor(100*($('#temperature').html()-32)*5/9)/100 );
    }
});

$(document).ready(getLocation());