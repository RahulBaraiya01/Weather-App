const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("index.html", "utf8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace(
    "{%tempval%}",
    (orgVal.main.temp - 273.15).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempmin%}",
    (orgVal.main.temp_min - 273.15).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempmax%}",
    (orgVal.main.temp_max - 273.15).toFixed(2)
  );
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  return temperature;
};

const server = http.createServer((request, response) => {
  requests(
    "https://api.openweathermap.org/data/2.5/weather?q=ahmedabad&appid=5e2b2bdacf952d0913f1f61a53e5b22e"
  )
    .on("data", (chunk) => {
      const objData = JSON.parse(chunk);
      const arrData = [objData];
      //   console.log(arrData[0].main.temp);
      const realTimeData = arrData
        .map((val) => replaceVal(homeFile, val))
        .join("");
      response.write(realTimeData);
    })
    .on("end", (err) => {
      if (err) return console.log("connection closed due to errors", err);
      response.end();
    });
});
server.listen(3000, "127.0.0.1");
