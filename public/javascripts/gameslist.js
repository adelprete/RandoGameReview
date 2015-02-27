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

    //$('#inputTitle').on('change',gameSuggestions);


});

// Functions =============================================================

//Retrieve search suggestions
/*
function gameSuggestions(){

  $.ajax({
      type: 'GET',
      url: 'http://thegamesdb.net/api/GetGamesList.php?name=' + $('#inputTitle').val(),
      dataType: 'xml',
      success: xmlParser
  });
};

function xmlParser(xml){
  $(xml).find('Game').each(function (){
    $('#gamesuggestions').append('<div>' + $(this).find('GameTitle').text() +'</div>')
  });
}
*/
// Fill table with data
function populateGameTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/games/gameslist', function( data ) {
      /*
      data.sort(function(a, b) {
        a = new Date(a.datecompleted);
        b = new Date(b.datecompleted);
        return a>b ? -1 : a<b ? 1 : 0;
      });
      */
      // For each item in our JSON, add a table row and cells to the content string
      $.each(data, function(){
          var datecompleted = new Date(this.datecompleted);
          var YYYY = datecompleted.getFullYear();
          var dd = datecompleted.getDate();
          var mm = datecompleted.getMonth()+1;
          if(dd<10){
            dd='0'+dd;
          }
          if(mm<10){
            mm='0'+mm;
          }
          var formatted_date = mm + '/' + dd + '/' + YYYY;

          tableContent += '<tr class="active" style="font-size:20px;">';
          tableContent += '<td style="padding-left:8px;padding-top:2px;padding-bottom:2px;word-wrap:break-word;">' + this.title + '</td>';
          tableContent += '<td style="padding-left:8px;padding-top:2px;padding-bottom:2px;">' + formatted_date + '</td>';
          tableContent += '<td style="padding-left:8px;padding-top:2px;padding-bottom:2px;">' + this.rating + '</td>';
          //tableContent += '<td style="width:20px;"><a href="#" style="color:red;" class="linkdeletegame" rel="'+ this._id +'">{X}</a></td>';
          tableContent += '</tr>';
      });

      // Inject the whole content string into our existing HTML table
      $('#gamelist table tbody').html(tableContent);
  });

};

// Add User
function addGame(event) {
    event.preventDefault();

    var dateCompleted;
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorNumber = 0;
    if($('#addgame div input#inputTitle').val() === ''){
      errorNumber = 1;
    }
    else{

      if($('#addgame div input#inputTitle').val().length > 140){
        errorNumber = 3;
      }
      else if($('#addgame div input#inputTitle').val().trim().length === 0){
        errorNumber = 4;
      }
    }

    if($('#addgame div input #inputDateBeaten').val() === ''){
      errorNumber = 1;
    }
    else{
      //make sure no future dates are entered
      var today = new Date();
      var dateCompleted = new Date($('#addgame div input#inputDateBeaten').val());
      if(dateCompleted > today){
        errorNumber = 2;
      }
    }
    console.log("Rating = " + $('#addgame div select#inputRating').val());
    if($('#addgame div select#inputRating').val() == null){
      errorNumber = 1;
    }

    // Check and make sure errorCount's still at zero
    if(errorNumber === 0) {

        // If it is, compile all user info into one object
        var newGame = {
            'title': $('#addgame div input#inputTitle').val(),
            'datecompleted': dateCompleted,
            'rating': $('#addgame div select#inputRating').val(),
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
                $('#addgame div input').val('');

                // Clear the form inputs
                $('#addgame div select').val('');

                // Update the table
                populateGameTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else if (errorNumber === 1){
        // If errorNumber is 1
        alert("Looks like you've got a blank field somewhere pal");
        return false;
    }
    else if (errorNumber === 2){
        alert("Can't beat a game in the future dummy!");
        return false;
    }
    else if (errorNumber === 3){
        alert('Lets keep things under 140 characters, yea?');
        return false;
    }
    else if (errorNumber === 4){
        alert('Would you type something for the game title atleast!');
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
