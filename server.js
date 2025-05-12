require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.post('/weather', async (req, res) => {
    const city = req.body.city;
    const country = req.body.country;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const query = `${city},${country}`;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${apiKey}&units=metric&lang=pl`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Nie znaleziono lokalizacji lub błąd API.');
        }
        const data = await response.json();
        res.send(`
            <h2>Pogoda dla ${data.name}, ${data.sys.country}</h2>
            <p>Temperatura: ${data.main.temp} °C</p>
            <p>Warunki: ${data.weather[0].description}</p>
            <a href="/">Powrót</a>
        `);
    } catch (error) {
        res.send(`<p>Błąd: ${error.message}</p><a href="/">Spróbuj ponownie</a>`);
    }
});

app.listen(PORT, () => {
    console.log(`Serwer działa.`);
});

