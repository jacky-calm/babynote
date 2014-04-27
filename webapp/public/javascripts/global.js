
// DOM Ready =============================================================
$(document).ready(function() {

  $("#note-item-templete").hide();
  // Populate the user table on initial page load
  populateTable();
  showBabyInfo();

  //$("#noteDate").datepicker();
  //$("#noteDate").val($.datepicker.formatDate('mm/dd/yy', new Date()));
  $('#btnAddNote').on('click', addNote);

  // Delete Note link click
  $('#notelist').on('click', 'a.js-action-del', deleteNote);

});

// Functions =============================================================
//
// append/prepend notes to the notelist
function appendNotes(notes, append=true){
    $.each(notes, function(){
      var li = $("#note-item-templete").clone().attr("id","li-"+this._id).show();
      append ? li.appendTo("#notelist") : li.prependTo("#notelist");
      li.find("p").html(this.noteContent)
      li.find(".time span").html(this.insertAt);
      li.find("a.js-action-del").attr("rel", this._id).attr("href", "#");
    });
}

// Fill table with data
function populateTable() {
  // jQuery AJAX call for JSON
  $.getJSON( '/notelist', function( notes ) {
    appendNotes(notes);
  });
};

// Show User Info
function showBabyInfo() {
  //Populate Info Box
  //$('#userInfoName').text(user.babies[0].name);
  $('#userInfoAge').text("07/29/2012");
  $('#userInfoGender').text("Female");
};

// Add User
function addNote(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addNote input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all user info into one object
    var newNote = {
      'noteContent': $('#noteContent').val(),
      'noteTag': $('#noteTag').val(),
      'notePhoto': $('#notePhoto').val(),
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newNote,
      url: '/addnote',
      dataType: 'JSON'
    }).done(function( response ) {
      //alert(JSON.stringify(response));
      // Check for successful (blank) response
      if (response.msg) {
        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      } else {
        // Clear the form inputs
        $('#noteContent').val('');
        // Update the table
        appendNotes(response, false);
      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

// Delete User
function deleteNote(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = true;//confirm('Are you sure you want to delete this note?');
  var noteId = $(this).attr('rel');
  // Check and make sure the user confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/deletenote/' + noteId
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      $("#li-"+noteId).remove();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }

};

var formatDate = function(timeInMS) {
  return moment(timeInMS).format("HH:mm MM-DD-YYYY");
};
