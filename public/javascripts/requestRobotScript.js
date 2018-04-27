/*  This JS script is in charge of allowing the user to enter the room number where
    they're currently located so that the robot can navigate to them (if the robot's not
    otherwise busy).
    It validates the user's room number input to ensure that it's a valid room.
*/

const IP_V4 = "http://10.148.183.240:3000";
let validInput = true;

function processRequest(event) {
  event.preventDefault();
  let submittedNumber = document.getElementById('roomNumberSubmission').value.replace('.', '_');
  let doorCode = `d${submittedNumber}`;
  let longerDoorCode = `door(${doorCode})`;
  //currently only sends user to first door found; in future, provide choice of doors?
  let doorIndex = DOOR_LIST.indexOf(longerDoorCode);

  if (doorIndex === -1) {
    validInput = false;
    document.getElementById("roomNumberSubmission").style.border = "1.5px red dotted";
    document.getElementById("errorText").style.visibility = "visible";
  }
  else {
    fetch(IP_V4 + '/userCurrentLocation', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: doorCode}).then((response) => {
      if (response.status == 200) {
        console.log("Room number of user's current location successfully sent");
        document.getElementById("roomNumberSubmission").style.border = "1.5px green dotted";
        //create alert of some type here to let user know that it was succesfully sent
        //make sure that input is not longer editable
        //after robot arrives, automatically redirect (?) on app.js
      }
      else {
        console.log(response);
        console.log("Room number of user's current location failed to send. An error occurred");
      }
    });
  }

  //reset input box
  document.getElementById("roomNumberSubmission").value = "";
  alert(formattedNumber);
}

function changedInput() {
  if (!validInput) {
    validInput = true;
    document.getElementById("roomNumberSubmission").style.border = "1.5px black dotted";
    document.getElementById("errorText").style.visibility = "hidden";
  }
}

//List of acceptable doors for BWI_KR navigation was obtained from https://github.com/utexas-bwi/bwi_common/blob/master/bwi_kr_execution/domain/navigation_facts.asp
const DOOR_LIST = ["door(d3_404)", "door(d3_400)", "door(d3_508)", "door(d3_402)", "door(d3_500)", "door(d3_502)", "door(d3_430)", "door(d3_422)", "door(d3_420)", "door(d3_414a2)", "door(d3_414a3)", "door(d3_414a1)", "door(d3_416)", "door(d3_516)", "door(d3_418)", "door(d3_512)", "door(d3_510)", "door(d3_414b3)", "door(d3_414b2)", "door(d3_414b1)", "door(d3_432)", "door(d3_436)", "door(d3_824)", "door(d3_816a)", "door(d3_710b1)", "door(d3_710b2)", "door(d3_710b3)", "door(d3_710a1)", "door(d3_710a2)", "door(d3_710a3)", "door(d3_600)", "door(d3_303)"];
