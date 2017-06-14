import 'fetch'
import { HttpClient } from 'aurelia-fetch-client';

export class WeatherApi {
	constructor() {
    this.http = new HttpClient().configure(config => {
      config
        .withBaseUrl('http://api.openweathermap.org/')
        .withDefaults({
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withInterceptor({
          request(request) {
            console.log(`Requesting ${request.method} ${request.url}`);
            return request
          },

          response(response) {
            console.log(`Received ${response.status} ${response.url}`);
            return response;
          }

        })
    })
  }

	getCurrentWeather(latitude, longitude) {
	  console.log("Fetching weather");
	  let key = "d1c70a6726e70b55ac3c105ee5a29d4c";
    return this.http.fetch('data/2.5/weather?APPID=' + key + '&lat=35&lon=139', {method: 'get'})
      .then(response => response.json())
  }
}
