import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
var cityName = "";

function getRandomBrewery(breweries) {
    var brewery = breweries[Math.floor(Math.random() * breweries.length) - 1];
    return brewery;
}

function filterSearchInfo(req, res, next) {
    try {
        if (req.body.searchInput) {
            cityName = req.body['searchInput'];
        } else {
            cityName = req.body['city'];
        }
    } catch (error) {
        console.log("No request body found");
    }
    cityName = cityName.replace(/ /g, "_").toLowerCase();
    next();
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(filterSearchInfo);

app.get("/", async (req, res) => {
    if (req.body) {
        res.render("index.ejs", {states: usStates, breweries: req.body.breweries});
    } else {
        res.render("index.ejs", { states: usStates });
    }
});

app.post("/get-brewery-by-city", async (req, res) => {
    try {
        const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries?by_city=${cityName}`);
        res.render("index.ejs", {
            states: usStates,
            brewery: getRandomBrewery(response.data),
            searchMethod: "city",
            searchInput: cityName});
    } catch (error) {
        console.log("Server encountered an error.");
        console.log(error.response.data);
        res.status(500);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});