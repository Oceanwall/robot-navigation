//shoddy DOM code below, be warned...
window.onload = function() {
  let buttonContainer = document.getElementById("buttonContainer");
  let buttons = buttonContainer.childNodes;

  //adds event listeners to each of the buttons
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", getEventRoom);
  }
}

//currently logs out the room number, but can be easily altered to call another
//method to broadcast the room number as necessary
function getEventRoom(event) {
  let buttonOfInterest = event.currentTarget;
  let buttonProps = buttonOfInterest.childNodes;
  let roomText;

  //gets the room number
  for (let k = 0; k < buttonProps.length; k++) {
    if (buttonProps[k].id === "roomNumber") {
      roomText = buttonProps[k].innerHTML;
      k = buttonProps.length;
    }
  }

  console.log(roomText);
  alert(roomText);
}
