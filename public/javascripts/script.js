//shoddy DOM code below, be warned...
window.onload = function() {
  let buttonContainer = document.getElementById("buttonContainer");
  let buttons = buttonContainer.childNodes;

  //adds event listeners to each of the buttons
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", sendEventRoom);
  }
}

//currently logs out the room number, but can be easily altered to call another
//method to broadcast the room number as necessary
function sendEventRoom(event) {
  let buttonOfInterest = event.currentTarget;
  let buttonProps = buttonOfInterest.childNodes;
  let roomText;

  //gets the room number
  for (let k = 0; k < buttonProps.length; k++) {
    if (buttonProps[k].id === "roomNumber") {
      roomText = buttonProps[k].innerHTML.slice(1, -1);
      k = buttonProps.length;
    }
  }

  alert(roomText);
  //roomText holds the room number of interest


  //request made to broadcast room number
  fetch('http://localhost:3000/sendRoomNumber', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: roomText}).then((response) => {
    if (response == "success") {
      console.log("Room number successfully sent");
    }
    else {
      console.log("Room number failed to send. An error occurred");
    }
  });
}
