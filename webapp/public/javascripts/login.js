
// DOM Ready =============================================================
$(document).ready(function() {
  $( "form#login" )
    .attr("method","post")
    .attr("action","/login")
    .submit(login);

});

// Functions =============================================================
// Login
function login( event ) {
  //event.preventDefault();
  return true;

}
