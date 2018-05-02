const IP_V4 = "http://localhost:3000";

window.onload = function() {
  let timer = setInterval(() => {
    //Make request every 2 seconds...
    fetch(IP_V4 + '/checkIfArrived', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}}).then((response) => {
      if (response.status == 200) {
        clearInterval(timer);
        // alert("Your navigation assistant has arrived!");
        swal("Your navigation assistant has arrived!", "", "success").then((value) => {
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
  //do some stuff here, make some requests etc to server that do ros stuff, TODO: IMPLEMENT THIS
  //callback should return to events page.
  document.location.href = IP_V4 + "/eventSelector";
}
