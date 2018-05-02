const IP_V4 = "http://10.147.121.127:3000";

window.onload = function() {
  let timer = setInterval(() => {
    //Make request every 2 seconds...
    fetch(IP_V4 + '/checkIfArrived', {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}}).then((response) => {
      if (response.status == 200) {
        clearInterval(timer);
        alert("Your navigation assistant has arrived!");
        document.location.href = IP_V4 + "/eventSelector";
      }
      else {
        console.log(response.status);
        console.log("Still waiting");
      }
    });
  }, 2000);
}
