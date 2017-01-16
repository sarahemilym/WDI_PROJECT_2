const Auth = Auth || {};

Auth.init = function(){
  this.apiUrl = 'http://localhost:3000/api';
  this.$main  = $('main');
  console.log(Auth.currentUser);
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));
  $('.usersShow').on('click', this.usersShow.bind(this));
  this.$main.on('submit', 'form', this.handleForm);

  if (this.getToken()){
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

Auth.loggedInState = function(){
  $('.loggedIn').show();
  $('.loggedOut').hide();
};

Auth.loggedOutState = function(){
  $('.loggedOut').show();
  $('.loggedIn').hide();
  this.login();
};

Auth.register = function(e){
  if (e) e.preventDefault();
  $('.modal-content').html(`
    <form method="post" action="/register">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    <h4 class="modal-title">Register</h4>
    </div>
    <div class="modal-body">
    <div class="form-group">
    <label for="user_username">Username</label>
    <input class="form-control" type="text" name="user[username]" id="user_username" placeholder="Username">
    </div>
    <div class="form-group">
    <label for="user_email">Email</label>
    <input class="form-control" type="email" name="user[email]" id="user_email" placeholder="Email">
    </div>
    <div class="form-group">
    <label for="user_password">Password</label>
    <input class="form-control" type="password" name="user[password]" id="user_password" placeholder="Password">
    </div>
    <div class="form-group">
    <label for="user_passwordConfirmation">Confirm Password</label>
    <input class="form-control" type="passwordConfirmation" name="user[passwordConfirmation]" id="user_passwordConfirmation" placeholder="Confirm Password">
    </div>
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    <button type="submit" class="btn btn-primary" value="Register">Register</button>
    </div>
    </form>`);

    $('.modal').modal('show');
  };

  Auth.login = function(e) {
    if (e) e.preventDefault();

    this.$main.html(`
      <h2 class="loggedOut">Login</h2>
      <form method="post" action="/login" class="loggedOut">
      <div class="form-group">
      <input class="form-control" type="email" name="email" placeholder="Email">
      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <input class="btn btn-primary" type="submit" value="Login">
      </form>
      `);
    };

    Auth.logout = function(e){
      if (e) e.preventDefault();
      this.removeToken();
      this.loggedOutState();
    };


        Auth.handleForm = function(e){
          if (e) e.preventDefault();

          const url    = `${Auth.apiUrl}${$(this).attr('action')}`;
          const method = $(this).attr('method');
          const data   = $(this).serialize();

          return Auth.ajaxRequest(url, method, data, data => {
            if (data.token) Auth.setToken(data.token);
            Auth.currentUser = data.user;
            Auth.loggedInState();
          });
        };

        Auth.usersShow = function(e){
          if (e) e.preventDefault();

          $.ajax({
            method: 'GET',
            url: `${Auth.apiUrl}/users/${Auth.currentUser._id}`,
            beforeSend: this.setRequestHeader.bind(this)
          }).done(user => {
            $('main').html(`
              <div class="user">
                <div class="user-tile">
                  <h2 id="username">${Auth.currentUser.username}</h2>
                  <p>${Auth.currentUser.email}</p>
                  <ul class="list-inline">
                    <li><a href="#" class="usersEdit" data-id="${user._id}">Edit</a></li>
                    <li><a data-id="${user._id}" class="usersDelete" href="#">Delete</a></li>
                  </ul>
                </div>
              </div>`
            );
          });
        };

        Auth.ajaxRequest = function(url, method, data, callback){
          return $.ajax({
            url,
            method,
            data,
            beforeSend: this.setRequestHeader.bind(this)
          })
          .done(callback)
          .fail(data => {
            console.log(data);
          });
        };

        Auth.setRequestHeader = function(xhr) {
          return xhr.setRequestHeader('Authorization', `Bearer ${this.getToken()}`);
        };

        Auth.setToken = function(token) {
          return window.localStorage.setItem('token', token);
        };

        Auth.getToken = function() {
          return window.localStorage.getItem('token');
        }

        Auth.removeToken = function() {
          return window.localStorage.clear();
        };


        $(Auth.init.bind(Auth));
