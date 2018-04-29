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
  //currently only sends user to first door found; in future, provide choice of doors?
  let doorIndex = DOOR_LIST.indexOf(doorCode);

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
        alert("Request successfully sent! Robot is coming to you, please wait...")
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
const DOOR_LIST = ["d3_404", "d3_400", "d3_508", "d3_402", "d3_500", "d3_502", "d3_430", "d3_422", "d3_420", "d3_414a2", "d3_414a3", "d3_414a1", "d3_416", "d3_516", "d3_418", "d3_512", "d3_510", "d3_414b3", "d3_414b2", "d3_414b1", "d3_432", "d3_436", "d3_824", "d3_816a", "d3_710b1", "d3_710b2", "d3_710b3", "d3_710a1", "d3_710a2", "d3_710a3", "d3_600", "d3_303"];
