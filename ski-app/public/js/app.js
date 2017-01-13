"use strict";var googleMap=googleMap||{},google=google;googleMap.mapSetup=function(){var o=document.getElementById("map-canvas"),t={zoom:2,center:new google.maps.LatLng(51.490744,(-.140362)),mapTypeId:google.maps.MapTypeId.ROADMAP};this.map=new google.maps.Map(o,t),this.getResorts()},googleMap.getResorts=function(){$.get("http://localhost:3000/api/resorts").done(this.loopThroughResorts)},googleMap.loopThroughResorts=function(o){$.each(o,function(o,t){googleMap.createMarkerForResort(t)})},googleMap.createMarkerForResort=function(o){var t=new google.maps.LatLng(o.lat,o.lng),e=new google.maps.Marker({position:t,map:this.map});this.addInWindowForResort(o,e)},googleMap.addInWindowForResort=function(o,t){var e=this;google.maps.event.addListener(t,"click",function(){"undefined"!=typeof e.infoWindow&&e.infoWindow.close(),e.infoWindow=new google.maps.InfoWindow({content:"<p>"+o.name+"</p>"}),e.infoWindow.open(e.map,t),e.map.setCenter(t.getPosition()),e.map.setZoom(5)})},$(googleMap.mapSetup.bind(googleMap));var Auth=Auth||{};Auth.init=function(){this.apiUrl="http://localhost:3000/api",this.$main=$("main"),$(".register").on("click",this.register.bind(this)),$(".login").on("click",this.login.bind(this)),$(".logout").on("click",this.logout.bind(this)),this.$main.on("submit","form",this.handleForm)},Auth.loggedInState=function(){$(".loggedIn").show(),$(".loggedOut").hide()},Auth.loggedOutState=function(){$(".loggedOut").show(),$(".loggedShow").hide()},Auth.register=function(o){o&&o.preventDefault(),this.$main.html('\n    <h2>Register</h2>\n    <form method="post" action="/register">\n    <div class="form-group">\n    <input class="form-control" type="text" name="user[username]" placeholder="Username">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="email" name="user[email]" placeholder="Email">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="password" name="user[password]" placeholder="Password">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">\n    </div>\n    <input class="btn btn-primary" type="submit" value="Register">\n    </form>\n    ')},Auth.login=function(o){o&&o.preventDefault,this.$main.html('\n      <h2>Login</h2>\n      <form method="post" action="/login">\n      <div class="form-group">\n      <input class="form-control" type="email" name="email" placeholder="Email">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="password" placeholder="Password">\n      </div>\n      <input class="btn btn-primary" type="submit" value="Login">\n      </form>\n      ')},Auth.logout=function(o){o&&o.preventDefault,this.removeToken(),this.loggedOutState()},Auth.handleForm=function(o){o&&o.preventDefault();var t=""+Auth.apiUrl+$(this).attr("action"),e=$(this).attr("method"),n=$(this).serialize();return Auth.ajaxRequest(t,e,n)},Auth.ajaxRequest=function(o,t,e,n){return $.ajax({url:o,method:t,data:e}).done(n).fail(function(o){console.log(o)})},Auth.setRequestHeader=function(o){return o.setRequestHeader("Authorization","Bearer "+this.getToken())},Auth.setToken=function(){return window.localStorage.getItem("token")},Auth.removeToken=function(){return window.localStorage.clear()},$(Auth.init.bind(Auth));