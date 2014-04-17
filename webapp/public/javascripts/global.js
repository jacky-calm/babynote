// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  populateTable();
  showBabyInfo();

  $("#noteDate").datepicker();
  $("#noteDate").val($.datepicker.formatDate('mm/dd/yy', new Date()));
  $('#btnAddNote').on('click', addNote);

  // Delete Note link click
  $('#notelist').on('click', 'a.linkdeletenote', deleteNote);

});

// Functions =============================================================

// Fill table with data
function populateTable() {
  // Empty content string
  var listContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/notelist', function( data ) {
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      listContent += '<li>' + this.noteContent + '(posted at '+this.noteDate + ') ';
      listContent += '<a href="#" class="linkdeletenote" rel="' + this._id + '">delete</a>';
      listContent += '</li>';
    });

    // Inject the whole content string into our existing HTML table
    $('#notelist').html(listContent);
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
      'noteDate': $('#noteDate').val(),
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
        //$('#addUser fieldset input').val('');

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

  // Check and make sure the user confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/deletenote/' + $(this).attr('rel')
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }

};
