require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");

console.log("hello bro");

const homeFile = fs.readFileSync(__dirname + "/home.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", (orgVal.main.temp - 273.15).toFixed(2));
  temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min - 273.15).toFixed(2));
  temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max - 273.15).toFixed(2));
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};



const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=Chandigarh&appid=10c60077d1767458d8b9765efe05a5ae`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        //console.log(arrData);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
   
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1");
