//send the ROS subscriber the room number. The navigation ROS package is in charge
//of determining which door to navigate to.

/*  This JS script is in charge of allowing the user to enter the room number where
    they're currently located so that the robot can navigate to them (if the robot's not
    otherwise busy).
    It validates the user's room number input to ensure that it's a valid room.
*/

let validInput = true;

function processRequest(event) {
  event.preventDefault();
  let submittedNumber = document.getElementById('roomNumberSubmission').value.replace('.', '_');
  let formattedNumber = `room(l${submittedNumber})`;
  let roomIndex = ROOM_LIST.indexOf(formattedNumber);
  if (roomIndex === -1) {
    validInput = false;
    document.getElementById("roomNumberSubmission").classList.add('invalid');
    document.getElementById("errorText").style.visibility = "visible";
  }
  else {
    fetch('http://10.148.183.240:3000/userCurrentLocation', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: formattedNumber}).then((response) => {
      if (response.status == 200) {
        console.log("Room number of user's current location successfully sent");
      }
      else {
        console.log(response);
        console.log("Room number of user's current location failed to send. An error occurred");
      }
    });
    //maybe redirect user? hmm
    //or give indication that it was successful?
    //or maybe redirect to guiding page once robot indicates that it has successfully reached its destination?
  }

  //reset input box
  document.getElementById("roomNumberSubmission").value = "";
  alert(formattedNumber);
}

function changedInput() {
  if (!validInput) {
    validInput = true;
    document.getElementById("roomNumberSubmission").classList.remove('invalid');
    document.getElementById("errorText").style.visibility = "hidden";
  }
}




//List of acceptable rooms for BWI_KR navigation was obtained from https://github.com/utexas-bwi/bwi_common/blob/master/bwi_kr_execution/domain/navigation_facts.asp
const ROOM_LIST = ["room(l3_414b)", "room(l3_414a)", "room(l3_402)", "room(l3_520)", "room(l3_400)", "room(l3_508)", "room(l3_428)", "room(l3_404)", "room(l3_424)", "room(l3_502)", "room(l3_426)", "room(l3_500)", "room(l3_420)", "room(l3_506)", "room(l3_422)", "room(l3_504)", "room(l3_200)", "room(l3_300)", "room(l3_303)", "room(l3_302)", "room(l3_406)", "room(l3_250)", "room(l3_410)", "room(l3_412)", "room(l3_518)", "room(l3_414)", "room(l3_416)", "room(l3_514)", "room(l3_418)", "room(l3_516)", "room(l3_430)", "room(l3_510)", "room(l3_436)", "room(l3_512)", "room(l3_434)", "room(l3_432)", "room(l3_408)", "room(l3_828)", "room(l3_824)", "room(l3_818)", "room(l3_816)", "room(l3_814)", "room(l3_830)", "room(l3_728)", "room(l3_724)", "room(l3_722)", "room(l3_710b)", "room(l3_710a)", "room(l3_710)", "room(l3_804)", "room(l3_802)", "room(l3_718)", "room(l3_702)", "room(l3_700)", "room(l3_800)", "room(l3_600)", "room(l3_100)"];
