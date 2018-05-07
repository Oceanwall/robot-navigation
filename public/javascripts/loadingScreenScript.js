const IP_V4 = "http://localhost:3000";

//Constantly checks with server to see if robot has arrived
window.onload = function() {
  let timer = setInterval(() => {
    //Make request every 2 seconds
    fetch(IP_V4 + '/checkIfArrived', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}}).then((response) => {
      if (response.status == 200) {
        clearInterval(timer);
        swal("You have arrived!", "", "success").then((value) => {
          document.location.href = IP_V4 + "/eventSelector";
        });
      }
      else {
        console.log(response.status);
        console.log("Still waiting");
      }
    });
  }, 2000);
}

function stopNavigation() {
  //Callback should return to events page.
  fetch(IP_V4 + '/stopRobot', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}}).then((response) => {
    fetch(IP_V4 + '/sendRoomNumber', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: 'eeeee'}).then((response) => {
      document.location.href = IP_V4 + "/eventSelector";
      console.log("fetched");
    });
  });
}
