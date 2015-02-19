// DOM Ready =============================================================
$(document).ready(function() {
    // Populate the user table on initial page load
    populateGameTable();

    $("#inputDateBeaten").datepicker();

    // Username link click
    //$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddGame').on('click', addGame);

    // Delete User link click
    $('#gamelist table tbody').on('click', 'td a.linkdeletegame', deleteGame);


});

// Functions =============================================================

// Fill table with data
function populateGameTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/games/gameslist', function( data ) {

      // For each item in our JSON, add a table row and cells to the content string
      $.each(data, function(){
          tableContent += '<tr style="font-size:20px;">';
          tableContent += '<td style="padding-right:20px;">' + this.title + '</td>';
          tableContent += '<td>' + this.datecompleted + '</td>';
          tableContent += '<td>' + this.rating + '</td>';
          tableContent += '<td style="width:20px;"><a href="#" style="color:red;" class="linkdeletegame" rel="'+ this._id +'">{X}</a></td>';
          tableContent += '</tr>';
      });

      // Inject the whole content string into our existing HTML table
      $('#gamelist table tbody').html(tableContent);
  });

};

// Add User
function addGame(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    if($('#addgame fieldset input #inputTitle').val() === ''){
      errorCount++;
    }
    if($('#addgame fieldset input #inputDateBeaten').val() === ''){
      errorCount++;
    }
    if($('#addgame fieldset input #inputRating').val() === ''){
      errorCount++;
    }
    $('#addgame fieldset input').each(function(index, val) {
        console.log($(this).val());
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newGame = {
            'title': $('#addgame fieldset input#inputTitle').val(),
            'datecompleted': $('#addgame fieldset input#inputDateBeaten').val(),
            'rating': $('#addgame fieldset input#inputRating').val(),
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newGame,
            url: '/games/addgame',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addgame fieldset input').val('');

                // Update the table
                populateGameTable();

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

// Delete
function deleteGame(event){
  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this user?');

  // Check and make sure the user confirmed
  if (confirmation === true) {
    // If they did, do our delete
    $.ajax({
        type: 'DELETE',
        url: '/games/deletegame/' + $(this).attr('rel')
    }).done(function( response ) {

        // Check for a successful (blank) response
        if (response.msg === '') {
        }
        else {
            alert('Error: ' + response.msg);
        }

        // Update the table
        populateGameTable();

    });
  }
  else{

  }

}
