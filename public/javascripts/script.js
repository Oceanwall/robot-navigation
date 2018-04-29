//Used by user when in proximity to robot so that robot can guide user to
//select location.

const IP_V4 = "http://10.148.183.240:3000";

window.onload = function() {
  let buttonContainer = document.getElementById("buttonContainer");
  let buttons = buttonContainer.childNodes;

  //adds event listeners to each of the buttons
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", sendEventRoom);
  }
}

//Well, technically sends a door request, but whatever.
function sendEventRoom(event) {
  let buttonOfInterest = event.currentTarget;
  let buttonProps = buttonOfInterest.childNodes;
  //roomText holds the room number of interest
  let roomText;

  //gets the room number
  for (let k = 0; k < buttonProps.length; k++) {
    if (buttonProps[k].id === "roomNumber") {
      roomText = buttonProps[k].innerHTML.slice(1, -1);
      k = buttonProps.length;
    }
  }

  //determine if room number is on the third floor; if not, provide rejection
  //TODO: do something better than an alert?
  if (roomText.indexOf('3.') == -1) {
    alert("Sorry, but functionality of this robot is currently only limited to the third floor.");
    //break out, dont send the post request
    return;
  }

  //Now that we know that the room number is on the third floor, we can determine available doors as necessary.
  let processedRoomNumber = roomText.substring(roomText.indexOf('3.')).replace('.', '_');;
  //TODO: determine available door numbers, check to see if user cares;
  //if so, provde selection; otherwise, go straight onwards
  //for now, only provide 1 door (first door found);
  let doorCode = `d${processedRoomNumber}`;
  let doorIndex = DOOR_LIST.indexOf(doorCode);
  //Error handling for invalid 3rd floor location, should never happen in demo
  if (doorIndex == -1) {
      alert("Sorry, but that room does not exist in our directory.");
      return;
  }


  //request made to broadcast room number
  //IT WORKS WOOOOOOOOOO only on computer but that is sufficient!!!!!!!
  //possible todo: trouble shoot safri?
  fetch(IP_V4 + '/sendRoomNumber', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: doorCode}).then((response) => {
    if (response.status == 200) {
      console.log("(Door of) room of interest successfully sent");
      //alert for now, but can be replaced in future with more cosmetically pleasing notification
      alert("Successful transmission! Robot is now navigating.");
    }
    else {
      console.log(response);
      console.log("(Door of) room of interest failed to send. An error occurred");
    }
  });
}

const DOOR_LIST = ["d3_404", "d3_400", "d3_508", "d3_402", "d3_500", "d3_502", "d3_430", "d3_422", "d3_420", "d3_414a2", "d3_414a3", "d3_414a1", "d3_416", "d3_516", "d3_418", "d3_512", "d3_510", "d3_414b3", "d3_414b2", "d3_414b1", "d3_432", "d3_436", "d3_824", "d3_816a", "d3_710b1", "d3_710b2", "d3_710b3", "d3_710a1", "d3_710a2", "d3_710a3", "d3_600", "d3_303"];
