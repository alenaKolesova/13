const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3000

require('dotenv').config()
console.log(process.env.DB);

mongoose.connect(process.env.DB);

const Weather = mongoose.model('Weather', { 
  city: String,
  temp: String,
  feels_like: String,
  description: String,
  wind: String,
  icon: String,
  date: String
});

app.use('/', express.static('public'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/weather', async(req, res) => {
    let lat = req.query.lat 
    let lon = req.query.lon
    let resWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=88c8615836512d39e3e7687d2ede5e1f&lang=ru`)
    let resWeatherJson = await resWeather.json()
    let date = new Date()
     
    const newWeather = new Weather({
        'city' : resWeatherJson.name,
        'temp' : Math.round(resWeatherJson.main.temp - 273),
        'feels_like' : Math.round(resWeatherJson.main.feels_like - 273),
        'description' : resWeatherJson.weather[0].description,
        'wind' : resWeatherJson.wind.speed,
        'icon' : resWeatherJson.weather[0].icon,
        'date' : date
    });
    
    await newWeather.save()

    res.json(newWeather)
})

app.get('/api/log', async(req, res) => {

  let log = await Weather.find()  
  res.json(log)
})

  

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})