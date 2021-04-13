const Express=require('express')

const app=Express()
const Datastore = require('nedb')
const fetch=require("node-fetch")
require('dotenv').config()
const port=process.env.PORT
app.listen(port)
app.use(Express.static('public'))
app.use(Express.json({limit:'50mb'}))//using express.json() func server can understand incoming json data

const db = new Datastore('new.db');
db.loadDatabase()
//console.log(process.env)

app.post('/post',(req,res)=>{
    const datas=req.body
    db.insert(datas)
    res.json(datas)
})

app.get('/db',(req,res)=>{
    const datas=db.find({},function (err, docs) {
        if(err){
            res.end()
            return
        }
    // docs is an array containing documents eg: Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
        //console.log(docs)
        res.json(docs)
    });

})

app.get('/weather/:latlong',async (req,res)=>{
    const latilongi=req.params.latlong.split(",")
    console.log(latilongi)
    const lat=latilongi[0]
    const long=latilongi[1]
    const api_for_weather=process.env.API_For_WEATHER//your api key
    const weath_data=await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_for_weather}`)
    const data_a=await weath_data.json()
    const api_for_air=process.env.API_For_AIR
    const air_data=await fetch(`http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${long}&key=${api_for_air}`)
    const data_b=await air_data.json()
    const data={
        weather_report:data_a,
        air_report:data_b
    }
    res.json(data)
})

