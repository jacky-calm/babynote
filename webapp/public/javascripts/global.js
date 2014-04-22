// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

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

// Fill table with data
function populateTable() {
  // jQuery AJAX call for JSON
  $.getJSON( '/notelist', function( data ) {
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      var li = $("#note-item-templete").clone().attr("id","li-"+this._id);
      li.appendTo("#notelist")
      li.find("p").html(this.noteContent)
      li.find(".time span").html(this.insertAt);
      li.find("a.js-action-del").attr("rel", this._id).attr("href", "#");
    });

    $("#note-item-templete").hide();
  });
};

// Show User Info
function showBabyInfo() {
  //Populate Info Box
  $('#userInfoName').text("Lele");
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
      'noteDate': new Date(),
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

      // Check for successful (blank) response
      if (response.msg === '') {
        // Clear the form inputs
        $('#noteContent').val('');
        // Update the table
        populateTable();
      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

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
  var confirmation = confirm('Are you sure you want to delete this note?');
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
      //populateTable();
      $("#li-"+noteId).remove();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }

};
