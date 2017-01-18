"use strict";function setMapOnAll(e){for(var n=0;n<markers.length;n++)markers[n].setMap(e)}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},googleMap=googleMap||{},google=google,markers=[];googleMap.mapSetup=function(){var e=document.getElementById("map-canvas"),n={zoom:2,styles:[{featureType:"administrative",elementType:"labels.text.fill",stylers:[{color:"#444444"}]},{featureType:"landscape.man_made",elementType:"labels",stylers:[{visibility:"on"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"all",stylers:[{saturation:-100},{lightness:45}]},{featureType:"road.highway",elementType:"all",stylers:[{visibility:"simplified"}]},{featureType:"road.arterial",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"all",stylers:[{color:"#90a8b3"}]},{featureType:"water",elementType:"labels",stylers:[{color:"#fefefe"}]},{featureType:"water",elementType:"labels.text",stylers:[{weight:"0.01"},{lightness:"24"},{color:"#ffffff"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#50707f"}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{weight:"1"}]}],center:new google.maps.LatLng(41.327819,(-3.69485)),mapTypeId:google.maps.MapTypeId.ROADMAP};this.map=new google.maps.Map(e,n),googleMap.openFlightForm(),this.getCountries(),this.getResorts()},googleMap.getCountries=function(){$.get("http://localhost:3000/api/resorts").done(function(e){var n=[],t=e.map(function(e){return e.country});t.some(function(e,a){t.indexOf(e)===a&&n.push(e)}),googleMap.createDropdown(n),console.log(n)})};var countryCodes={31:"Canada",184:"USA",10:"Austria",60:"France",183:"UK",167:"Switzerland",152:"Serbia",35:"Chile",125:"New Zealand",76:"India",78:"Iran",160:"South Africa",9:"Australia",7:"Argentina",36:"China",8:"Armenia",63:"Georgia",81:"Lebanon",86:"Kazakhstan",90:"South Korea",131:"Pakistan",84:"Japan",17:"Belgium",4:"Andorra",16:"Belarus",22:"Bosnia & Herzegovina",26:"Bulgaria",43:"Croatia",45:"Cyprus",46:"Czech Republic",56:"Estonia",102:"Macedonia",129:"Norway",138:"Poland",141:"Romania",142:"Russia",156:"Slovakia",157:"Slovenia",161:"Spain",59:"Finland",166:"Sweden",177:"Turkey",181:"Ukraine",82:"Italy",66:"Greece",75:"Iceland"};googleMap.createDropdown=function(e){$.each(e,function(e,n){console.log("countryCodesVal",countryCodes[n]),$(".dropdown-menu").append('<li><a href="#" class="filter" value="'+n+'" id='+n+">"+countryCodes[n]+"</a></li>")}),$(".filter").on("click",googleMap.selectCountry)},googleMap.selectCountry=function(e){e&&e.preventDefault();var n=parseInt($(this).attr("value"));console.log("country edit","undefined"==typeof n?"undefined":_typeof(n),n),console.log("clicked",this.innerHTML),googleMap.getResorts(n)},googleMap.getResorts=function(e){var n=this;$.get("http://localhost:3000/api/resorts").done(function(t){if(e){var a=t.filter(function(n){return n.country===e});n.loopThroughResorts(a)}else n.loopThroughResorts(t)})},googleMap.loopThroughResorts=function(e){googleMap.deleteMarkers(),$.each(e,function(e,n){googleMap.createMarkerForResort(n)})},googleMap.createMarkerForResort=function(e){var n={url:"images/skiing.png",scaledSize:new google.maps.Size(20,20),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(0,0)},t=new google.maps.LatLng(e.lat,e.lng),a=new google.maps.Marker({position:t,region:e.region,icon:n,map:this.map});markers.push(a),this.addInWindowForResort(e,a)},googleMap.clearMarkers=function(){setMapOnAll(null)},googleMap.deleteMarkers=function(){googleMap.clearMarkers(),markers=[],googleMap.map.setZoom(2),googleMap.map.setCenter(26.607066,29.771936)},googleMap.addInWindowForResort=function(e,n){google.maps.event.addListener(n,"click",function(){"undefined"!=typeof googleMap.infoWindow&&googleMap.infoWindow.close(),$.get("http://api.openweathermap.org/data/2.5/weather?lat="+e.lat+"&lon="+e.lng+"&units=metric&APPID=17716dc84c929276085ec7322162e7f3").done(function(t){var a=Math.round(t.main.temp),i=Math.round(t.main.temp_min),o=Math.round(t.main.temp_max);googleMap.infoWindow=new google.maps.InfoWindow({content:'<div class="weather-infoWindow"><h4>'+e.name+'</h4><h4 class="modal-title">Current Weather</h4>\n        <div class="weather-container">\n        <div class="current-weather">\n        <img src="http://openweathermap.org/img/w/'+t.weather[0].icon+'.png" alt="icon">\n        <p>'+a+" ℃</p>\n        <br>\n        <h6>"+t.weather[0].description+'</h6>\n          </div>\n        <div class="minmax-temp">\n        <h6>Min</h6><h6>Max</h6>\n        <br>\n        <p>'+i+" ℃</p><p>"+o+' ℃</p>\n        </div>\n        </div>\n        <button class="btn btn-primary" id="forecast">Forecast</button>\n        </div>\n        </div>'}),googleMap.addForecast(e),googleMap.addMaps(),googleMap.infoWindow.open(this.map,n),googleMap.map.setCenter(n.getPosition()),googleMap.map.setZoom(5)})})},googleMap.addMaps=function(){$("#map-canvas").on("click","#flights",function(e){e&&e.preventDefault(),console.log("clicked"),$.get("http://localhost:3000/api/skimaps").done(function(e){console.log(e)})})},googleMap.addForecast=function(e){$("#map-canvas").on("click","#forecast",function(n){n&&n.preventDefault(),$.get("http://api.openweathermap.org/data/2.5/forecast?lat="+e.lat+"&lon="+e.lng+"&units=metric&APPID=17716dc84c929276085ec7322162e7f3").done(function(n){var t=Math.round(n.list[7].main.temp),a=Math.round(n.list[7].main.temp_min),i=Math.round(n.list[7].main.temp_max),o=Math.round(n.list[15].main.temp),s=Math.round(n.list[15].main.temp_min),l=Math.round(n.list[15].main.temp_max),r=Math.round(n.list[23].main.temp),p=Math.round(n.list[23].main.temp_min),c=Math.round(n.list[23].main.temp_max),d=moment(""+n.list[15].dt_txt).format("ddd Do MMM"),g=moment(""+n.list[23].dt_txt).format("ddd Do MMM");$(".modal-content").html('\n        <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4>'+e.name+'</h4>\n        <h4 class="modal-title">3 Day Forecast</h4>\n        </div>\n        <div class="modal-body">\n        <div class="col-1">\n        <h4>Tomorrow</h4>\n        <div class="weather-tomorrow">\n        <div class="forecast-weather">\n        <img src="http://openweathermap.org/img/w/'+n.list[7].weather[0].icon+'.png" alt="icon">\n        <p>'+t+" ℃</p>\n        <br>\n        <h6>"+n.list[7].weather[0].description+'</h6>\n        </div>\n        <div class="forecast-minmax"><h6>Min</h6><h6>Max</h6>\n        <br>\n        <p>'+a+" ℃</p><p>"+i+' ℃</p>\n        </div\n        </div>\n        </div>\n        </div>\n\n        <div class="col-2">\n        <h4>'+d+'</h4>\n        <div class="weather-tomorrow">\n        <div class="forecast-weather">\n        <img src="http://openweathermap.org/img/w/'+n.list[15].weather[0].icon+'.png" alt="icon">\n        <p>'+o+" ℃</p>\n        <br>\n        <h6>"+n.list[15].weather[0].description+'</h6>\n        </div>\n        <div class="forecast-minmax"><h6>Min</h6><h6>Max</h6>\n        <br>\n        <p>'+s+" ℃</p><p>"+l+' ℃</p>\n        </div\n        </div>\n        </div>\n        </div>\n\n        <div class="col-3">\n        <h4>'+g+'</h4>\n        <div class="weather-tomorrow">\n        <div class="forecast-weather">\n        <img src="http://openweathermap.org/img/w/'+n.list[23].weather[0].icon+'.png" alt="icon">\n        <p>'+r+" ℃</p>\n        <br>\n        <h6>"+n.list[23].weather[0].description+'</h6>\n        </div>\n        <div class="forecast-minmax"><h6>Min</h6><h6>Max</h6>\n        <br>\n        <p>'+p+" ℃</p><p>"+c+' ℃</p>\n        </div\n        </div>\n        </div>\n        </div>\n\n        <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n        </div>'),$(".modal").modal("show")})})},googleMap.openFlightForm=function(){$("nav").on("click",".flights",function(e){e&&e.preventDefault(),$("main").html('\n      <div class="flightForm">\n      <h2 class="loggedIn">Find Flights</h2>\n      <form class="form-inline">\n        <div class="form-group">\n        <label for="flight_origin">Flying from?</label>\n        <input class="form-control" type="text" id="flight_origin" placeholder="Origin">\n          </div>\n        <div class="form-group">\n        <label for="flight_destination">Flying to?</label>\n        <input class="form-control" type="text" id="flight_destination" placeholder="Destination">\n          </div>\n          <div class="form-group">\n          <label for="fligh_date">Travel Date</label>\n          <input class="form-control" type="date" id="flight_date" placeholder="Travel Date yyyy-mm-dd">\n          </div>\n          <div class="form-group">\n          <label for="flight_passengers">Number of Passengers</label>\n          <input class="form-control" type="number" id="flight_passengers" placeholder="Number of passengers">\n          </div>\n          <div id="checkbox">\n          <label for="cb1">Nonstop?</label>\n        <input type="checkbox" id="cb" onclick="googleMap.checkbox()" />\n        </div>\n        <div class="form-footer flight">\n        <button type="button" class="btn btn-default" data-dismiss="modal" id="close">Close</button>\n        <button type="submit" class="btn btn-primary" id="search">Search</button>\n        </div>\n        </form>\n        </div>')}),googleMap.findFlights()},googleMap.checkbox=function(){console.log("clicked"),$("#cb").is(":checked")?(console.log("checked"),$("#cb").val(0)):$("#cb").val("off"),console.log($("#cb").val())},googleMap.findFlights=function(){$("main").on("click","#close",googleMap.hideFlightForm),$("main").on("click","#search",function(e){googleMap.hideFlightForm(),console.log("clicked"),e&&e.preventDefault();var n=$("#flight_origin").val().toString(),t=$("#flight_destination").val().toString(),a=$("#flight_date").val().toString(),i=parseInt($("#flight_passengers").val()),o=parseInt($("#cb").val()),s={request:{slice:[{origin:n,destination:t,date:a,maxStops:o}],passengers:{adultCount:i},solutions:3,refundable:!1}};console.log(s),$.ajax({type:"POST",url:"https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyBeNMXTnV9y9muXtJCm-5BlC5sG1YRsVA0",contentType:"application/json",dataType:"json",data:JSON.stringify(s),success:function(e){console.log(JSON.stringify(e)),googleMap.displayFlights(e)},error:function(){alert("Access to Google QPX Failed.")}})})},googleMap.displayFlights=function(e){$(".modal-content").html('\n    <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n    <h4 class="modal-title">Flight Details</h4>\n    </div>\n    <div class="modal-body flight-details">\n\n\n    <div class="col-1">\n    <div class="trip">\n    <div class="journey">\n    <h5>Origin</h5><h5>Destination</h5>\n    <h6>'+e.trips.tripOption[0].slice[0].segment[0].leg[0].origin+"</h6><h6>"+e.trips.tripOption[0].slice[0].segment[0].leg[0].destination+'</h6>\n    </div>\n    <div class="class">\n    <p><span>Class:</span>'+e.trips.tripOption[0].slice[0].segment[0].cabin+'</p>\n    </div>\n    <div class="flight-time">\n    <p><span>Departure Time:</span> '+e.trips.tripOption[0].slice[0].segment[0].leg[0].departureTime+"</p>\n    <br>\n    <p><span>Arrival Time:</span> "+e.trips.tripOption[0].slice[0].segment[0].leg[0].arrivalTime+"</p>\n    <br>\n    <p><span>Flight Time:</span> "+e.trips.tripOption[0].slice[0].segment[0].leg[0].duration+'m</p>\n    </div>\n    <div class="sale-total">\n    <p><span>Sale Total:</span> '+e.trips.tripOption[0].saleTotal+'</p>\n    </div>\n    </div>\n    </div>\n\n    <div class="col-2">\n    <div class="trip">\n    <div class="journey">\n    <h5>Origin</h5><h5>Destination</h5>\n    <h6>'+e.trips.tripOption[1].slice[0].segment[0].leg[0].origin+"</h6><h6>"+e.trips.tripOption[1].slice[0].segment[0].leg[0].destination+'</h6>\n    </div>\n    <div class="class">\n    <p><span>Class:</span> '+e.trips.tripOption[1].slice[0].segment[0].cabin+'</p>\n    </div>\n    <div class="flight-time">\n    <p><span>Departure Time:</span> '+e.trips.tripOption[1].slice[0].segment[0].leg[0].departureTime+"</p>\n    <br>\n    <p><span>Arrival Time:</span> "+e.trips.tripOption[1].slice[0].segment[0].leg[0].arrivalTime+"</p>\n    <br>\n    <p><span>Flight Time:</span> "+e.trips.tripOption[1].slice[0].segment[0].leg[0].duration+'m</p>\n    </div>\n    <div class="sale-total">\n    <p><span>Sale Total</span> '+e.trips.tripOption[1].saleTotal+'</p>\n    </div>\n    </div>\n    </div>\n\n\n    <div class="col-3">\n    <div class="trip">\n    <div class="journey">\n    <h5>Origin</h5><h5>Destination</h5>\n    <h6>'+e.trips.tripOption[2].slice[0].segment[0].leg[0].origin+"</h6><h6>"+e.trips.tripOption[2].slice[0].segment[0].leg[0].destination+'</h6>\n    </div>\n    <div class="class">\n    <p><span>Class:</span> '+e.trips.tripOption[2].slice[0].segment[0].cabin+'</p>\n    </div>\n    <div class="flight-time">\n    <p><span>Departure Time:</span> '+e.trips.tripOption[2].slice[0].segment[0].leg[0].departureTime+"</p>\n    <br>\n    <p><span>Arrival Time:</span> "+e.trips.tripOption[2].slice[0].segment[0].leg[0].arrivalTime+"</p>\n    <br>\n    <p><span>Flight Time:</span> "+e.trips.tripOption[2].slice[0].segment[0].leg[0].duration+'m</p>\n    </div>\n    <div class="sale-total">\n    <p><span>Sale Total:</span> '+e.trips.tripOption[2].saleTotal+'</p>\n    </div>\n    </div>\n    </div>\n\n\n\n    </div>\n    <div class="modal-footer">\n    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n    </div>'),$(".modal").modal("show")},googleMap.hideFlightForm=function(e){e&&e.preventDefault(),$(".flightForm").hide()},$(googleMap.mapSetup.bind(googleMap));