window.onload = () => {
    getme();
};
let city = document.getElementById("searchcity");
city.addEventListener("input", async function (event) {
    await getme();
    
});
const apikey = '4705933231234071926120058251006';
async function getme() {
    try {
        const cityName = city.value.trim();
        const apiurl = `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${cityName}&days=1&aqi=yes`;
        const response = await fetch(apiurl);
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        filldata(data);
        console.log(data);
        return data;
    } catch (err) {
        console.error("Error:", err.message);
    }
}


function filldata(data) {
    //placedate
    let Place = document.getElementById("place");
    Place.textContent = "";
    Place.innerHTML += `${data.location.name} / ${data.location.country}`;
    document.getElementById("date").textContent = new Date().toLocaleDateString('en-US');
    let emoji = getEmoji(data.current.condition.text, true);
    console.log("getemoji");
//.tempC
    document.querySelector(".tempC").textContent = "";
    document.querySelector(".tempC").innerHTML += `
        <span >
            <p id="emoji">${emoji}</p>
            <p>${data.current.condition.text}</p>
        </span>
        <span >
            <p id="viewC">${data.current.temp_c}<sup>°</sup></p>
            <p>${data.current.feelslike_c}</p>
            </span>
        <span style="margin-top:30px">
            <p>Sunrise: ${data.forecast.forecastday[0].astro.sunrise} </p >
            <p>Sunset: ${data.forecast.forecastday[0].astro.sunset}</p>
            <p>Duration:${Duration(data)}</p>
        </span >
    `;
//.hourlytemp
    const hourly = data.forecast.forecastday[0].hour;
    let showtable = document.querySelector(".hourlyTemp");
    const hours = [19, 20, 21, 22, 23, 0];
    let rowTime = '<tr><th>Today</th>';
    let rowemoji = '<tr><th>Condition</th>';
    let rowforecast = '<tr><th>Forecast</ht>';
    let rowtemp = '<tr><th>Temp</th>';
    let rowfeelreal = '<tr><th>RealFeel</th>';
    let rowwind = '<tr><th>Wind (km/h)</th>';
    hours.forEach(hr => {
        const hourData = hr === 0 ? hourly[0] : hourly[hr];
        const condition = hourData.condition.text;
        const emoji = getEmoji(condition,  true);
        const fore=getEmoji(condition,  false);
        const temp = hourData.temp_c;
        const realFeel = hourData.feelslike_c;
        const wind = hourData.wind_kph;

        rowTime += `<th>${hr % 12 === 0 ? 12 : hr % 12}${hr < 12 ? 'am' : 'pm'}</th>`;
        rowemoji += `<td>${emoji}</td>`;
        rowforecast += `<td>${fore}`;
        rowtemp += `<td>${temp}°</td>`;
        rowfeelreal += `<td>${realFeel}°</td>`;
        rowwind += `<td>${wind}</td>`;
    });
    rowTime += '</tr>';
    rowemoji += '</tr>';
    rowforecast += '</tr>';
    rowtemp += '</tr>';
    rowfeelreal += '</tr>';
    rowwind += '</tr>';
    showtable.textContent = "";
    showtable.innerHTML += `
        <table>
            ${rowTime}
            ${rowemoji}
            ${rowforecast}
            ${rowtemp}
            ${rowfeelreal}
            ${rowwind}
        </table>
    `;

    //nearby
    let nearby= document.querySelector(".nearby");
    nearby.textContent="";
    nearby.innerHTML+=`
        <span>
            <p>place</p>
            <p>emoji</p>
            <p>tem_c</p>
        </span>
    `;

}

let forecastandemoji = [["sunny", "🌞"], ["cloud", "☁️"], ["rain", "🌧️"], ["clear", "🌙"],["drizzle","🌦️"]];
function getEmoji(condition,  returnEmoji = true) {
    const lower = condition.toLowerCase();
    let match = forecastandemoji.find(([word]) => lower.includes(word));
    if (!match) return returnEmoji ? "🌙" : "unknown";
   return returnEmoji ? match[1] : match[0];
}

function Duration(data) {
    const today = new Date().toLocaleDateString('en-US');
    const sunrise = new Date(`${today} ${data.forecast.forecastday[0].astro.sunrise}`);
    const sunset = new Date(`${today} ${data.forecast.forecastday[0].astro.sunset}`);
    // console.log(sunrise);
    // console.log(sunset);
    const durationMs = sunset - sunrise;
    const hours = Math.floor(durationMs / 1000 / 60 / 60);
    const minutes = Math.floor((durationMs / 1000 / 60) % 60);

    return `${hours}h ${minutes}m`;
}



