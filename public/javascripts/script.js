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
  let processedRoomNumber = roomText.substring(roomText.indexOf('3.');
  //TODO: determine available door numbers, check to see if user cares;
  //if so, provde selection; otherwise, go straight onwards
  //for now, only provide 1 door (first door found);



  //request made to broadcast room number
  //IT WORKS WOOOOOOOOOO only on computer but that is sufficient!!!!!!!
  //possible todo: trouble shoot safri?
  fetch(IP_V4 + '/sendRoomNumber', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: roomText}).then((response) => {
    if (response.status == 200) {
      console.log("Room number successfully sent");
      alert(roomText);
    }
    else {
      console.log(response);
      console.log("Room number failed to send. An error occurred");
    }
  });
}

function

const DOOR_LIST = ["door(d3_404)", "door(d3_400)", "door(d3_508)", "door(d3_402)", "door(d3_500)", "door(d3_502)", "door(d3_430)", "door(d3_422)", "door(d3_420)", "door(d3_414a2)", "door(d3_414a3)", "door(d3_414a1)", "door(d3_416)", "door(d3_516)", "door(d3_418)", "door(d3_512)", "door(d3_510)", "door(d3_414b3)", "door(d3_414b2)", "door(d3_414b1)", "door(d3_432)", "door(d3_436)", "door(d3_824)", "door(d3_816a)", "door(d3_710b1)", "door(d3_710b2)", "door(d3_710b3)", "door(d3_710a1)", "door(d3_710a2)", "door(d3_710a3)", "door(d3_600)", "door(d3_303)"];
