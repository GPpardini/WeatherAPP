async function getYesterdayWeatherData(userInput, date, APIkey) {
    const url = `http://api.weatherapi.com/v1/history.json?key=${APIkey}&q=${userInput}&dt=${date}`; 

    try{
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
      
        const json = await response.json();
        return json;

    } catch (error) {
        console.error(error.message);
        return null; 
    }
}




async function getTodaysWeatherData(userInput, APIkey) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${userInput}&aqi=no`; 

    try{
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
      
        const json = await response.json();
        return json;

    } catch (error) {
        console.error(error.message);
        return null; 
    }
}

const key = 'a066f5cfd2b44572965163022241410'; 
const yesterdayDate = getYesterdayDate(); 
const prompt = require('prompt-sync')();
const userInput = prompt('   Get weather data for: '); 

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
    let parsedData = {
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

async function main(userInput, yesterdayDate, key){

  let yData = await getYesterdayWeatherData(userInput,yesterdayDate, key);
  let currentData = await getTodaysWeatherData (userInput, key);
  if (yData === null || currentData === null){ 
    console.error("Bad request, city name undefined or not found");
    return;
    }
    let data = parseData(currentData, yData);

    console.log(`
    Current Weather data for ${data.location}, (diference from yesterday)

    Temperature: ${data.current.temp_c}°C (${data.diff.temp_c > 0 ? '+' : ''}${data.diff.temp_c}), ${data.current.temp_f}°F (${data.diff.temp_f > 0 ? '+' : ''}${data.diff.temp_f})
    umidity: ${data.current.humidity} (${data.diff.humidity > 0 ? '+' : ''}${data.diff.humidity})
    Wind Speed: ${data.current.wind_kph} km/h (${data.diff.wind_kph > 0 ? '+' : ''}${data.diff.wind_kph})
   `);
    console.log(JSON.stringify(data));
}


main(userInput,yesterdayDate, key); 
