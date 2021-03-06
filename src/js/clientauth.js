const Auth = Auth || {};

Auth.init = function(){
  this.apiUrl = 'https://snowglobe.herokuapp.com/api';
  this.$main  = $('main');
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));
  $('.usersShow').on('click', this.usersShow.bind(this));

  this.$main.on('submit', 'form', this.handleForm);
  $('.modal').on('submit', 'form', this.handleForm);
  $('main').on('click', '#close', this.closeProfile);

  if (this.getToken()){
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

Auth.loggedInState = function(){
  $('.loggedIn').show();
  $('.loggedOut').hide();

  Auth.setCurrentUser();
};

Auth.loggedOutState = function(){
  $('.loggedOut').show();
  $('.loggedIn').hide();
  this.login();
};

Auth.setCurrentUser = function() {
  if(Auth.getToken()) {
    const token = Auth.getToken();
    const payload = token.split('.')[1];
    const decoded = JSON.parse(window.atob(payload));
    const userId = decoded.user;

    Auth.ajaxRequest(`https://snowglobe.herokuapp.com/api/users/${userId}`, 'GET', null, data => {
      Auth.currentUser = data;
    });
  }
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
        <label for="user_firstName">First Name</label>
        <input class="form-control" type="text" name="user[firstName]" id="user_firstName" placeholder="First Name">
      </div>
      <div class="form-group">
      <label for="user_lastName">Last Name</label>
      <input class="form-control" type="text" name="user[lastName]" id="user_lastName" placeholder="Last Name">
    </div>
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
          <input class="form-control" type="password" name="user[passwordConfirmation]" id="user_passwordConfirmation" placeholder="Confirm Password">
        </div>
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary register" value="Register">Register</button>
        <button type="button" class="btn btn-default close-register" data-dismiss="modal">Close</button>
      </div>
    </form>`);

  $('.modal').modal('show');
};

Auth.login = function(e) {
  if (e) e.preventDefault();

  this.$main.html(`
    <div class="login">
      <form method="post" action="/login" class="loggedOut">
        <div class="form-group">
          <input class="form-control" type="email" name="email" placeholder="Email">
        </div>
        <div class="form-group">
          <input class="form-control" type="password" name="password" placeholder="Password">
        </div>
        <input class="btn btn-primary login" type="submit" value="Login">
        </form>
      </div>
    <div class="jumbotron loggedOut">
  </div>`);
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

  $('.modal').modal('hide');

  return Auth.ajaxRequest(url, method, data, data => {
    if (data.token) Auth.setToken(data.token);
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
        <div class="user-tile">
          <h2>${Auth.currentUser.firstName} ${Auth.currentUser.lastName}</h2>
          <h4 id="username">${Auth.currentUser.username}</h4>
          <p>${Auth.currentUser.email}</p>
          <ul class="list-inline">
            <li><a id="close" href="#">Close</a></li>
          </ul>
      </div>`);
  });
};

Auth.closeProfile = function() {
  $('.user-tile').hide();
};


Auth.ajaxRequest = function(url, method, data, callback){
  return $.ajax({
    url,
    method,
    data,
    beforeSend: this.setRequestHeader.bind(this)
  }).done(callback)
    .fail(data => {
      console.log('failed', data);
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
};

Auth.removeToken = function() {
  return window.localStorage.clear();
};

$(Auth.init.bind(Auth));
