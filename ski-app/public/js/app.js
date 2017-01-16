"use strict";function setMapOnAll(o){for(var e=0;e<markers.length;e++)markers[e].setMap(o)}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},googleMap=googleMap||{},google=google,markers=[];googleMap.mapSetup=function(){var o=document.getElementById("map-canvas"),e={zoom:2,center:new google.maps.LatLng(51.490744,(-.140362)),mapTypeId:google.maps.MapTypeId.ROADMAP};this.map=new google.maps.Map(o,e),this.getCountries(),this.getResorts()},googleMap.getCountries=function(){$.get("http://localhost:3000/api/resorts").done(function(o){var e=[],t=o.map(function(o){return o.country});t.some(function(o,n){t.indexOf(o)===n&&e.push(o)}),googleMap.createDropdown(e)})},googleMap.createDropdown=function(o){$.each(o,function(o,e){$(".dropdown-menu").append('<li><a href="#" class="filter" value="'+e+'">'+e+"</a></li>")}),$(".filter").on("click",googleMap.selectCountry)},googleMap.selectCountry=function(o){o&&o.preventDefault();var e=parseInt(this.innerHTML);console.log("country edit","undefined"==typeof e?"undefined":_typeof(e),e),console.log("clicked",this.innerHTML),googleMap.getResorts(e)},googleMap.getResorts=function(o){var e=this;$.get("http://localhost:3000/api/resorts").done(function(t){if(o){var n=t.filter(function(e){return e.country===o});e.loopThroughResorts(n)}else e.loopThroughResorts(t)})},googleMap.loopThroughResorts=function(o){googleMap.deleteMarkers(),$.each(o,function(o,e){googleMap.createMarkerForResort(e)})},googleMap.createMarkerForResort=function(o){var e=new google.maps.LatLng(o.lat,o.lng),t=new google.maps.Marker({position:e,region:o.region,map:this.map});markers.push(t),this.addInWindowForResort(o,t)},googleMap.clearMarkers=function(){setMapOnAll(null)},googleMap.deleteMarkers=function(){googleMap.clearMarkers(),markers=[],googleMap.map.setZoom(1)},googleMap.addInWindowForResort=function(o,e){google.maps.event.addListener(e,"click",function(){console.log("clicked","lat"+o.lat,"lng"+o.lng),$.get("http://api.openweathermap.org/data/2.5/weather?lat="+o.lat+"&lon="+o.lng+"&units=metric&APPID=17716dc84c929276085ec7322162e7f3").done(function(t){console.log(_typeof(googleMap.infoWindow),"infowindow"),"undefined"!=typeof googleMap.infoWindow&&googleMap.infoWindow.close(),this.infoWindow=new google.maps.InfoWindow({content:"<p>"+o.name+"</p><p>"+o.region+"</p><p>"+o.country+"</p><p>Temperature is "+t.main.temp+" ℃</p><p>Min temperature is "+t.main.temp_min+" ℃</p><p>Max temperature is "+t.main.temp+" ℃</p><p>Weather is "+t.weather[0].description+"</p><p>Wind Speed is "+t.wind.speed+'</p><img src="http://openweathermap.org/img/w/'+t.weather[0].icon+'.png" alt="icon"><input type="button" id="forecast"/><a href="#" id="flights">Find flights</a>'}),googleMap.addForecast(o),googleMap.openFlightModal(),this.infoWindow.open(this.map,e),googleMap.map.setCenter(e.getPosition()),googleMap.map.setZoom(5)})})},googleMap.addForecast=function(o){$("#map-canvas").on("click","#forecast",function(){$.get("http://api.openweathermap.org/data/2.5/forecast?lat="+o.lat+"&lon="+o.lng+"&units=metric&APPID=17716dc84c929276085ec7322162e7f3").done(function(o){$(".modal-content").html('\n        <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">Forecast</h4>\n        </div>\n        <div class="modal-body">\n        <p>'+o.list[7].dt_txt+"</p>\n        <p>Average Temperature: "+o.list[7].main.temp+" ℃</p>\n        <p>Min Temperature: "+o.list[7].main.temp_min+" ℃</p>\n        <p>Max Temperature: "+o.list[7].main.temp_max+" ℃</p>\n        <p>Weather Main: "+o.list[7].weather[0].main+"</p>\n        <p>Weather Description: "+o.list[7].weather[0].description+"</p>\n        <p>Wind Speed: "+o.list[7].wind.speed+' meters per second</p>\n        <img src="http://openweathermap.org/img/w/'+o.list[7].weather[0].icon+'.png" alt="icon">\n\n        </div>\n        <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n        </div>'),$(".modal").modal("show")})})},googleMap.openFlightModal=function(){$("#map-canvas").on("click","#flights",function(o){o&&o.preventDefault(),$(".modal-content").html('\n        <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">Choose Flights</h4>\n        </div>\n        <div class="modal-body">\n        <div class="form-group">\n        <label for="flight_origin">Origin</label>\n        <input class="form-control" type="text" id="flight_origin" placeholder="Origin">\n        </div>\n        <div class="form-group">\n        <label for="flight_destination">Destination</label>\n        <input class="form-control" type="text" id="flight_destination" placeholder="Destination">\n        </div>\n        <div class="form-group">\n        <label for="fligh_date">Travel Date</label>\n        <input class="form-control" type="date" id="flight_date" placeholder="Travel Date yyyy-mm-dd">\n        </div>\n        <div class="form-group">\n        <label for="flight_passengers">Number of Passengers</label>\n        <input class="form-control" type="number" id="flight_passengers" placeholder="Number of passengers">\n        </div>\n        </div>\n        <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n        <button type="submit" class="btn btn-primary" id="search">Search</button>\n        </div>\n        </form>'),$(".modal").modal("show")}),googleMap.findFlights()},googleMap.findFlights=function(){$(".modal").on("click","#search",function(o){console.log("clicked"),o&&o.preventDefault();var e=$("#flight_origin").val().toString(),t=$("#flight_destination").val().toString(),n=$("#flight_date").val().toString(),a=parseInt($("#flight_passengers").val()),i={request:{slice:[{origin:e,destination:t,date:n}],passengers:{adultCount:a},solutions:10,refundable:!1}};console.log(i),$.ajax({type:"POST",url:"https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyBeNMXTnV9y9muXtJCm-5BlC5sG1YRsVA0",contentType:"application/json",dataType:"json",data:JSON.stringify(i),success:function(o){console.log(JSON.stringify(o)),googleMap.displayFlights(o)},error:function(){alert("Access to Google QPX Failed.")}})})},googleMap.displayFlights=function(o){$(".modal-content").html('\n    <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n    <h4 class="modal-title">Flights</h4>\n    </div>\n    <div class="modal-body">\n    <p>'+o.trips.data.airport[0].name+'</p>\n    </div>\n    <div class="modal-footer">\n    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n    </div>'),$(".modal").modal("show")},$(googleMap.mapSetup.bind(googleMap));