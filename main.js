const config = require('./config.js');

async function getWeatherData(userInput, date, request) {
    const url = `${config.apiUrl}${request}.json?key=${config.apiKey}&q=${userInput}&dt=${request === 'history' ? date : ''}`;
  
    for (let attempt = 1; attempt <= config.retries; attempt++) {
      try {
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
  
        const json = await response.json();
        return json; // Retorna os dados em caso de sucesso
  
      } catch (error) {
        console.warn(`Attempt ${attempt} error: ${error.message}`);
  
        if (attempt === config.retries) {
          console.error(`Request failed for ${url}`);
          return error.message; // Retorna null após todas as tentativas falharem
        }
  
        // Aguarda antes da próxima tentativa
        await new Promise(resolve => setTimeout(resolve, config.delay));
      }
    }
  }

function getYesterdayDate (){
    const date = new Date();
    date.setDate(date.getDate() - 1); // Subtract one day

    let year = date.getFullYear();
    let month = date.getMonth() + 1; // getMonth() is zero-based
    let day = date.getDate();

    // padStart will add leading zeros if needed
    month = month.toString().padStart(2, '0');
    day = day.toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function parseData(data, yData){
    const parsedData = {
        location: data.location.name,
        current: {
            temp_c: data.current.temp_c,
            temp_f: data.current.temp_f,
            humidity: data.current.humidity,
            wind_kph: data.current.wind_kph
        },
        diff: {
            temp_c: (data.current.temp_c - yData.forecast.forecastday[0].day.avgtemp_c).toFixed(2),
            temp_f: (data.current.temp_f - yData.forecast.forecastday[0].day.avgtemp_f).toFixed(2),
            humidity: (data.current.humidity - yData.forecast.forecastday[0].day.avghumidity).toFixed(2),
            wind_kph: (data.current.wind_kph - yData.forecast.forecastday[0].day.maxwind_kph).toFixed(2)
        },
    }
    return parsedData;
};

function checkErrorCodes(response){
    switch(response.slice(-3)){
        case "400":
            console.error("Bad request, city name undefined or not found");
            break;
        case "401":
            console.error("Unauthorized, invalid API key");
            break;
    };
}

async function main(userInput, yesterdayDate){

  let yData = await getWeatherData(userInput,yesterdayDate, 'history');
  let currentData = await getWeatherData(userInput, null, 'current');

  if (typeof(yData) !== "object" || typeof(currentData) !== "object"){ 
    checkErrorCodes(yData);
    checkErrorCodes(currentData);
    return;
    }

    let data = parseData(currentData, yData);
    
    console.log(`
    Current Weather today for ${data.location}, (diference from yesterday)

    Temperature: ${data.current.temp_c}°C (${data.diff.temp_c > 0 ? '+' : ''}${data.diff.temp_c}) | ${data.current.temp_f}°F (${data.diff.temp_f > 0 ? '+' : ''}${data.diff.temp_f})
    umidity: ${data.current.humidity} (${data.diff.humidity > 0 ? '+' : ''}${data.diff.humidity})
    Wind Speed: ${data.current.wind_kph} km/h (${data.diff.wind_kph > 0 ? '+' : ''}${data.diff.wind_kph})
   `);

    console.log("JSON file:\n",JSON.stringify(data));
}

const yesterdayDate = getYesterdayDate(); 
const prompt = require('prompt-sync')();
const userInput = prompt('Get weather data for: '); 
main(userInput,yesterdayDate); 


