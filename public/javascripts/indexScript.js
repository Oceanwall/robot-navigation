//Controls setup of events page and facilitates necessary HTTP requests to start robot guidance.

const IP_V4 = "http://localhost:3000";
const SPECIAL_DOORS = ["d3_414", "d3_710", "d3_816"];
const TAGS = ['food', 'networking', 'club', 'seminar'];
let doorCode = "";

window.onload = function() {
  let buttons = document.getElementsByClassName("eventButton");
  let tags = document.getElementsByClassName('invisible');
  let iconHolders = document.getElementsByClassName('iconHolder');

  //adds event listeners and icons to each of the buttons
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", sendEventRoom);
  }

  for (let i = 0; i < tags.length; i++) {
    let tagList = tags[i].innerHTML;
    let space = tagList.indexOf(' ');
    while (space != -1) {
      let currentTag = tagList.substring(0, space);
      //depending on current tag, add an icon.
      let icon = document.createElement('img');
      icon.classList.add('icon');

      if (currentTag == "food") {
        icon.src = "../images/food.png";
        icon.alt = "Food-providing Event";
        iconHolders[i].appendChild(icon);
      }
      else if (currentTag == "networking") {
        icon.src = "../images/networking.png";
        icon.alt = "Networking Event";
        iconHolders[i].appendChild(icon);
      }
      else if (currentTag == "club") {
        icon.src = "../images/club.png";
        icon.alt = "Club-sponsored Event";
        iconHolders[i].appendChild(icon);
      }
      else if (currentTag == "seminar") {
        icon.src = "../images/seminar.png";
        icon.alt = "Seminar or Lecture Event";
        iconHolders[i].appendChild(icon);
      }
      tagList = tagList.substring(space + 1);
      space = tagList.indexOf(' ');
    }
  }

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
  }, 10000);
}

//Once an event is selected, sends the door number to the ROS action client for movement
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

  //Determine if room number is on the third floor; if not, provide rejection
  if (roomText.indexOf('3.') == -1) {
    swal("Sorry, but functionality of this robot is currently only limited to the third floor.", "", "error");
    //End, do not send the HTTP request
    return;
  }

  //Now that we know that the room number is on the third floor, we can determine available doors as necessary.
  let processedRoomNumber = roomText.substring(roomText.indexOf('3.')).replace('.', '_');;
  doorCode = `d${processedRoomNumber}`;
  let doorIndex = DOOR_LIST.indexOf(doorCode);

  //If the door is not on the list of normal doors
  if (doorIndex == -1) {
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
    //If not a special door, then this door choice is not valid.
    else {
      swal("Sorry, but that room does not exist in our directory.", "", "error");
      return;
    }
  }
  else sendRequest();
}

//Once the user has selected a particular door (for rooms with multiple doors), process their choice.
function processDoorChoice(event) {
  event.preventDefault();
  let doorChoice = document.getElementById("doorSelect").value;
  doorCode = doorCode + doorChoice;
  document.getElementById("chooseDoors").style.visibility = "hidden";
  sendRequest();
}

//Sends HTTP request to server to proc. relevant action from ROS client
function sendRequest() {
  fetch(IP_V4 + '/sendRoomNumber', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: doorCode}).then((response) => {
    if (response.status == 200) {
      console.log("(Door of) room of interest successfully sent");
      swal("Successful transmission! Robot is now navigating.", "", "success").then((value) => {
        document.location.href = IP_V4 + "/loadingScreen";
      });
    }
    else {
      console.log(response);
      console.log("(Door of) room of interest failed to send. An error occurred");
    }
  });
}

//Switch page view to direct request
function transferViews() {
  document.location.href = IP_V4;
}

//Special Doors: 414(6 doors, a1-a3 and b1-b3), 816(just a), 710(a1-a3, b1-b3)
const DOOR_LIST = ["d3_404", "d3_400", "d3_508", "d3_402", "d3_500", "d3_502", "d3_430", "d3_422", "d3_420", "d3_416", "d3_516", "d3_418", "d3_512", "d3_510", "d3_432", "d3_436", "d3_824", "d3_600", "d3_303"];
