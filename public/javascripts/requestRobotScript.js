/*  Allows for direct navigation to a certain room number / door number.
    Validates the user's room number input to ensure that it's a valid room.
*/

const IP_V4 = "http://localhost:3000";
const SPECIAL_DOORS = ["d3_414", "d3_710", "d3_816"];
let validInput = true;
let doorCode = "";

window.onload = function() {
  //Automatic return timer, prompts user interaction to stop; doesn't move at all when already at base
  console.log("Timer on");
  let count = 0;
  let timer = setInterval(function() {
    if (count == 3) {
      fetch(IP_V4 + '/sendRoomNumber', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: "d3_414a1"}).then((response) => {
        if (response.status == 200) {
          document.location.href = IP_V4 + "/returningScreen";
        }
        else {
          console.log(response);
          console.log("Return failed to send. An error occurred");
        }
      });
    }
    count++;
    console.log("15 seconds have elapsed");
    console.log(count);
    if (count == 2) {
      //Reset count to 0 if warning is acknowledged
      swal("Are you still there? Click anywhere on the screen to stop Bender from navigating home.", "", "warning").then((value) => {
        count = 0;
      });
    }
  }, 30000);
}

//Determines which room/door the user wants to go to
function processRequest(event) {
  event.preventDefault();
  let submittedNumber = document.getElementById('roomNumberSubmission').value.replace('.', '_');
  doorCode = `d${submittedNumber}`;
  let doorIndex = DOOR_LIST.indexOf(doorCode);

  if (doorIndex === -1) {
    //Handling doors that dont comply to d3_###
    let specialOptions = SPECIAL_DOORS.indexOf(doorCode);
    if (specialOptions != -1) {
      if (specialOptions == 2) {
        doorCode = "d3_816a";
        sendRequest();
      }
      //Multiple doors possible here.
      //index 0 = 414, index 1 = 710
      else {
        document.getElementById("chooseDoors").style.visibility = "visible";
      }
    }
    else {
      validInput = false;
      //Give user feedback for erroneous choice
      document.getElementById("roomNumberSubmission").style.border = "1.5px red dotted";
      document.getElementById("errorText").style.visibility = "visible";
      document.getElementById("roomNumberSubmission").value = "";
    }
  }
  else {
    sendRequest();
  }
}

//Given a user's choice of door, prepare the complete door number for the HTTP request
function processDoorChoice(event) {
  event.preventDefault();
  let doorChoice = document.getElementById("doorSelect").value;
  doorCode = doorCode + doorChoice;
  document.getElementById("chooseDoors").style.visibility = "hidden";
  sendRequest();
}

//Make the relevant HTTP request to the ROS client to being movement
function sendRequest() {
  fetch(IP_V4 + '/sendRoomNumber', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: doorCode}).then((response) => {
    if (response.status == 200) {
      console.log("Room number of user's current location successfully sent");
      document.getElementById("roomNumberSubmission").style.border = "1.5px green dotted";
      document.getElementById("roomNumberSubmission").value = "";
      console.log(doorCode);
      swal("Request successfully sent! Robot is now navigating...", "", "success").then((value) => {
        document.location.href = IP_V4 + "/loadingScreen";
      });
    }
    else {
      console.log(response);
      console.log("Room number of user's current location failed to send. An error occurred");
    }
  });
}

//When the user changes their room number input, hide error messages
function changedInput() {
  if (!validInput) {
    validInput = true;
    document.getElementById("roomNumberSubmission").style.border = "1.5px black dotted";
    document.getElementById("errorText").style.visibility = "hidden";
  }
}

//Transfers view to Events page
function transferViews() {
  document.location.href = IP_V4 + '/eventSelector';
}

//List of acceptable doors for BWI_KR navigation was obtained from https://github.com/utexas-bwi/bwi_common/blob/master/bwi_kr_execution/domain/navigation_facts.asp
const DOOR_LIST = ["d3_404", "d3_400", "d3_508", "d3_402", "d3_500", "d3_502", "d3_430", "d3_422", "d3_420", "d3_414a2", "d3_414a3", "d3_414a1", "d3_416", "d3_516", "d3_418", "d3_512", "d3_510", "d3_414b3", "d3_414b2", "d3_414b1", "d3_432", "d3_436", "d3_824", "d3_816a", "d3_710b1", "d3_710b2", "d3_710b3", "d3_710a1", "d3_710a2", "d3_710a3", "d3_600", "d3_303"];
