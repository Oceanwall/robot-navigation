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
  //roomText holds the room number of interest
  let roomText;

  //gets the room number
  for (let k = 0; k < buttonProps.length; k++) {
    if (buttonProps[k].id === "roomNumber") {
      roomText = buttonProps[k].innerHTML.slice(1, -1);
      k = buttonProps.length;
    }
  }


  //request made to broadcast room number
  //IT WORKS WOOOOOOOOOO only on computer but that is sufficient!!!!!!!
  //possible todo: trouble shoot safri?
  fetch('http://10.148.183.240:3000/sendRoomNumber', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: roomText}).then((response) => {
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
