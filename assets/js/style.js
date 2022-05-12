// Get form element value
let leftColumnEL = document.querySelector("#left-column")

// Get all the elements of cities list for event handler
let citiesListContainerBtnEl = document.querySelector(".list-group-item");

// Daily forcast Containter
let dailyWeatherContainerEl = document.querySelector("#forecast-output-container"); 

// Create a form container and containing elements
let dynFormContainer = document.createElement("form");
dynFormContainer.setAttribute("id", "dymCityForm");
dynFormContainer.classList = "city-search-forecast-container";
leftColumnEL.appendChild(dynFormContainer)

// Create H3 element
let formH3 = document.createElement("h3");
formH3.textContent = " Search for a City ";
dynFormContainer.appendChild(formH3);

// Create input element
let formInput = document.createElement("input");
formInput.setAttribute("id", "city-name")
formInput.setAttribute("type", "text");
formInput.setAttribute("autofocus", "true");
formInput.classList = "form-input";
dynFormContainer.appendChild(formInput);

// Create button element
let formButton = document.createElement("button");
formButton.setAttribute("type", "submit");
formButton.classList= ("btn fas fa-search");
dynFormContainer.appendChild(formButton);

// Find the city form
let seachEventHanglerEl = document.querySelector("#dymCityForm");
let searchByCityEl = document.querySelector("#city-name");

// Left column cities container
let citiesContainerEl = document.createElement("div");
citiesContainerEl.setAttribute("id", "dym-cities-list");
citiesContainerEl.classList = "list-group";

// Append to the left column
leftColumnEL.appendChild(citiesContainerEl);

// Find the list div container
let citiesListContainerEl = document.querySelector("#dym-cities-list");

var populateSavedCities = function() {
       // Get array from local storage
       let citiesLocalStorage = JSON.parse(localStorage.getItem("savedCities"));

       // City exist or not. 0 = not, 1 = yes
       let cityExist = 0;
         
       if (citiesLocalStorage === null) {
           // It does note exist, therefore, no items to add to saved cities
           //console.log("No items to add");  
       } else { // we will popualte the saved cities

       $(".list-group-item").remove(); // Remove all list items from the document with jquery
           
        for (i=0; i< citiesLocalStorage.length;i++) {

            // Populate the cities as anchors and add necessary attribures and classes.
            let cityNameEl = document.createElement("a")
            let splitCityText = "";
            cityNameEl.setAttribute("href", "#")
            cityNameEl.setAttribute("data-city", citiesLocalStorage[i]);
            cityNameEl.setAttribute("id", citiesLocalStorage[i]);
            cityNameEl.setAttribute("role", "button");
            cityNameEl.classList = "list-group-item list-group-item-action list-group-item-primary";
            cityNameEl.textContent = citiesLocalStorage[i];
            //citiesListContainerEl.appendChild(cityNameEl);
            // dynContainer
            citiesContainerEl.appendChild(cityNameEl);
        };
          // alert("All saved cities have been populated");
       };
};

function fetchSecondCall(searchByCity, latNum, lonNum, unixTimeCurrentDay, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed) {

    // Assign API URL
    let openWeatherApiFiveDayUrl =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + latNum + "&lon=" + lonNum + "&appid=32a27c42260b02de3ba5e1466def4861&units=imperial"
    
    fetch( 
        openWeatherApiFiveDayUrl
    )
    .then(function (response) {
      return response.json();
    })
    .then(function (secondCallData) {
        // Current Day UV
        let uvIndex = secondCallData.current.uvi

        let unix_timestamp = unixTimeCurrentDay;
        // Create a new JavaScript Date object based on the timestamp
        var date = new Date(unix_timestamp * 1000);
        // Hours part from the timestamp
        var year = date.getFullYear(); 
        var monthOfYear = date.getMonth() + 1; 
        var dayOfMonth = date.getDate();
        var fullDayDaily = "(" + (date.getMonth() + 1) + "/" + date.getDate() + "/"  + date.getFullYear() + ")";      
                
        // Populate current day data
        populateCurrentDayHtml(searchByCity, fullDayDaily, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed, uvIndex);

        // Populate 5 day forcast
        populate5DayForecast(secondCallData)
    });
};

// Function to populate current day forecast
function populateCurrentDayHtml(searchByCity, fullDayDaily, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed, uvIndex) {

    // Populate current Day html elements
    let dailyForecastContainerEl = document.createElement("div");
    dailyForecastContainerEl.setAttribute("id", "daily-forecast-container");
    dailyForecastContainerEl.classList = "borderDiv";

    let currentDayTitle = document.createElement("h3");
    currentDayTitle.textContent = ( searchByCity.charAt(0).toUpperCase() + searchByCity.slice(1) + " " + fullDayDaily);
    let currentIconEl = document.createElement("span")
    let currentIconSymbol = "http://openweathermap.org/img/wn/" + currentDayIcon + "@2x.png";
   currentIconEl.innerHTML = "<img src=" + currentIconSymbol + "></img>";
   currentDayTitle.append(currentIconEl)

    // Create p elements to hold the rest of current day informatino
    let currentTempEl = document.createElement("p");
    let currentHumidityEl = document.createElement("p");
    let currentWinSpEl = document.createElement("p");
    let currentUvIEl = document.createElement("p");

    // Round temperature to no decimal places
    currentTempEl.textContent = "Temperature: " + (currentTempImperial.toFixed(1)) + " °F";
    currentHumidityEl.textContent = "Humidity: " + currentHumidity + "%";
    currentWinSpEl.textContent = "Wind Speed: " + currentMPS + " MPH";
    currentUvIEl.textContent = "UV Index: " + uvIndex;

    $("#daily-forecast-container").remove(); 

    // *** Append to forecast output container
    // Append daily forecast
    dailyWeatherContainerEl.appendChild(dailyForecastContainerEl);
    dailyForecastContainerEl.appendChild(currentDayTitle);
    dailyForecastContainerEl.appendChild(currentTempEl);
    dailyForecastContainerEl.appendChild(currentHumidityEl);
    dailyForecastContainerEl.appendChild(currentWinSpEl);
    dailyForecastContainerEl.appendChild(currentUvIEl);
};

  
function populate5DayForecast(secondCallData) {
    
    $("#weekly-forecast-container").remove(); 

    // Populate current Day html elements
    let weeklyForecastContainerEl = document.createElement("div");
    weeklyForecastContainerEl.setAttribute("id", "weekly-forecast-container");
    weeklyForecastContainerEl.classList = "border-Div-right-column"; 

    let fiveDayForecast = document.createElement("h3");
    fiveDayForecast.textContent = "5-Day Forecast:"

    dailyWeatherContainerEl.appendChild(weeklyForecastContainerEl);
    weeklyForecastContainerEl.appendChild(fiveDayForecast);

    let weeklyFlexContainerEL = document.createElement("div");
    weeklyFlexContainerEL.classList = "weekly-flex-conatiner"

    weeklyForecastContainerEl.appendChild(weeklyFlexContainerEL);

    for (i=1; i <= 5; i++) { 
        let unixTime = secondCallData.daily[i].dt;
    
        let unix_timestamp = unixTime;
        var date = new Date(unix_timestamp * 1000);
        var year = date.getFullYear();
        var monthOfYear = date.getMonth() + 1;
        var dayOfMonth = date.getDate();
    
        // Values to be displayed
        var fullDay = (date.getMonth() + 1) + "/" + date.getDate() + "/"  + date.getFullYear(); 
        var iconWeather = secondCallData.daily[i].weather[0].icon 
        let fahrenheitTemp = secondCallData.daily[i].temp.day 
        let humidity = secondCallData.daily[i].humidity;
    
        // Create a div to hold each day of the 5 day weekly forecast.
        let eachDayContainer = document.createElement("div");
        eachDayContainer.setAttribute("id", ("day=" + [i]));
        eachDayContainer.classList = "border-div-five-day-forecast";
       
        let currentDayTitle = document.createElement("p");
        currentDayTitle.textContent = (fullDay);

        // Span to hold the icon
        let iconSpan = document.createElement("p");
        iconSpan.textContent = "";

        let currentIconEl = document.createElement("span")
        let currentIconSymbol = "http://openweathermap.org/img/wn/" + iconWeather + "@2x.png";
        currentIconEl.innerHTML = "<img src=" + currentIconSymbol + "></img>";
        iconSpan.append(currentIconEl)

        // Create p elements to hold the rest of current day informatino
        let currentTempEl = document.createElement("p");
        let currentHumidityEl = document.createElement("p");
        
        currentTempEl.textContent = "Temperature: " +  (fahrenheitTemp.toFixed(2)) + " °F";
        currentHumidityEl.textContent = "Humidity: " + humidity + "%";
          
        // Append daily forecast
        eachDayContainer.appendChild(currentDayTitle);
        eachDayContainer.appendChild(currentIconEl);
        eachDayContainer.appendChild(currentTempEl);
        eachDayContainer.appendChild(currentHumidityEl);
        weeklyFlexContainerEL.appendChild(eachDayContainer);
    };
};

var getWeatherData = function (event , cityClicked) {
    // Prevent multiple clickes when city entered at search bar or list of cities.
    event.preventDefault() 

    if (cityClicked) {
         // get value from input elementgit 
        var searchByCity = cityClicked.trim();
    } else { 
        // get value from input elementgit 
        var searchByCity = searchByCityEl.value.trim();
    };

    // If field emtpy to not fetch any data
    if (searchByCity == "") {
        alert("Please do not leave city name blank");
        searchByCityEl.value = "";
        return 
    } else {  
        searchByCityEl.value = "";
    };
     
    // Get array from local storage
    let citiesLocalStorage = JSON.parse(localStorage.getItem("savedCities"));

    let cityExist = 0;

    // Check if array is null and create new one again.
    if (citiesLocalStorage === null) {
        citiesSearched =  new Array();
    } else { 
        citiesSearched = citiesLocalStorage;
       
    };

    // First API call to get latitude and longitude for the oncall api
    let openWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchByCity + "&appid=32a27c42260b02de3ba5e1466def4861&units=imperial";

    fetch( 
      openWeatherApiUrl
    ).then(function (weatherResponse) {
        
        if(weatherResponse.ok) { 
        return weatherResponse.json();
        } else {
            window.alert("Error: " + weatherResponse.statusText + "\nPlease re-enter a valid city");
            searchByCityEl.value = "";
            return;
        }
    }).then(function (weatherLatLon) {
        let latNum = weatherLatLon.coord.lat;
        let lonNum = weatherLatLon.coord.lon;
        let unixTimeCurrentDay = weatherLatLon.dt
        let currentDayIcon = weatherLatLon.weather[0].icon 
        let currentTempImperial = weatherLatLon.main.temp 
        let currentHumidity = weatherLatLon.main.humidity 
        let currentMPS = weatherLatLon.wind.speed
        let mphWindSpeed = Math.round(currentMPS * 2.237) 

        
        // Add the sucessful api call city to the local storage.
        for (i=0; i < citiesSearched.length; i++) {
            if (searchByCity.toLowerCase() === citiesSearched[i].toLowerCase()) {
                cityExist =1
                break;
            };
        };
        
        if (cityExist === 0) {
          
            citiesSearched.push(searchByCity.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '));
            
            localStorage.setItem("savedCities", JSON.stringify(citiesSearched));
        }

        fetchSecondCall(searchByCity.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '), latNum, lonNum, unixTimeCurrentDay, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed);
      
        populateSavedCities(); 
      }).catch(function(error) { 
        return;
      });

};

seachEventHanglerEl.addEventListener("submit",getWeatherData);

// Funciton to handle the event from the list of cities when clicked.
var cityClicked = function (event) {
    let cityClicked = event.target.getAttribute("data-city")
    if (cityClicked){
        getWeatherData(event, cityClicked);
    } else { 
        alert("Internal erro found, please email esroleo@gmail.com.\nPlease provide story of issue in order for it to be fixed");
    };
};

// Event listener for the cities incase they are clicked.
citiesContainerEl.addEventListener("click", cityClicked)

// Load saved cities to the saved cities section.
populateSavedCities();