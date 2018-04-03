var axios = require('axios');

const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
const GOOGLE_AUTOCOMPLETE = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
const GOOGLE_PLACEID = 'https://maps.googleapis.com/maps/api/place/details/json'
const MAPBOX_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
const GEOCODIO_URL = 'https://api.geocod.io/v1.2/geocode'

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
};

function callget(path, payload) {
    console.log(`${path}${payload}`)
    return axios.get(`${path}${payload}`, axiosConfig);
}

function googleAutoComplete(address) {
    return callget(GOOGLE_AUTOCOMPLETE, `?input=${address}&types=geocode&language=en&key=AIzaSyCnwNNjhla4bLrLmuF7KryB2HBhhj8t_Cc`)
}

function googlePlaceId(placeId) {
    return callget(GOOGLE_PLACEID, `?placeid=${placeId}&types=geocode&language=fr&key=AIzaSyCnwNNjhla4bLrLmuF7KryB2HBhhj8t_Cc`)
}

function mapboxGeocoding(address) {
    return callget(MAPBOX_URL, `${address}+nw.json?access_token=pk.eyJ1Ijoib2JqZWN0YmIiLCJhIjoiY2pkd3FiYzVtMXhwdzJ2bXVmZDlqejFpMiJ9.rAxR9-G_wpdDBE3ZELQn2w`)
}

function geocodioGeocoding(address) {
    return callget(GEOCODIO_URL, `?q=${address}&api_key=87bbb9b55565f538b9b5b859b2525b52f5f00c5`)
}


exports.fullOnGeocode = function* (fulladdress) {
    let loc
    let geocoderesults

    try {

        console.log("location --> googleGeocode fulladdress ", fulladdress)

        geocoderesults = yield callget(GEOCODE_URL, `?address=${fulladdress}`)

        console.log("location --> googleGeocode fulladdress ", geocoderesults.data)

        if (!geocoderesults.data.error_message && geocoderesults.data.results > 0 &&
            geocoderesults.data.results[0].geometry)
            return geocoderesults.data.results[0].geometry.location



        geocoderesults = yield googleAutoComplete(fulladdress)

        console.log("location --> googleGeocode predictions ", geocoderesults.data)

        const predictions = geocoderesults.data.predictions ? geocoderesults.data.predictions : []

        console.log("location --> googleGeocode predictions ", predictions)

        if (predictions.length > 0) {

            const placeId = predictions[0].place_id

            console.log("location --> googleGeocode placeId ", placeId)

            geocoderesults = yield googlePlaceId(placeId)

            console.log("location --> googleGeocode geocoderesults ", geocoderesults)
            return geocoderesults.data.result.geometry.location

        }

        geocoderesults = yield mapboxGeocoding(fulladdress)
        console.log("location --> mapboxGeocoding ", geocoderesults.data)

        if (geocoderesults.data.features && geocoderesults.data.features.length > 0) {
            const coords = geocoderesults.data.features[0].geometry.coordinates
            return { lat: coords[1], lng: coords[0] }
        }

        geocoderesults = yield geocodioGeocoding(fulladdress)
        console.log("location --> geocodioGeocoding ", geocoderesults.data)

        if (geocoderesults.data.results && geocoderesults.data.results.length > 0)
            return geocoderesults.data.results[0].location

        return {}

    } catch (err) {
        const errMsg = `Exception - ${String(err)} ${JSON.stringify(geocoderesults.data)}`
        return errMsg
    }
}