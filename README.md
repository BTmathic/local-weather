# local-weather

Displays the current weather in the city of the user's IP address (as determined by the ipinfo.io API). The weather API (from fcc-weather-api.glitch.me) is not always reliable and returns cached data for a city in Japan from time to time (possibly in an attempt to prevent an overload of real API calls since this is a free service).

However, when the correct data is pulled for the given IP address, temperature, weather, and extra details like winds and gusts are display with a background to adapt around the pulled data as well as an icon matching the description if one is provided by the API.

Built with<ul>
  <li>jQuery</li>
  <li>Webpack</li>
  <li>Yarn</li>
</ul>
