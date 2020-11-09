const timerElement = document.getElementById("timer");
const submitElement = document.getElementById("submit");

let durationInterval;

timerElement.addEventListener("click", (event) => {
  let duration = 0;
  clearInterval(durationInterval);

  durationInterval = setInterval(() => {
    duration++;
    timerElement.innerHTML = "<i class='fas fa-stopwatch'></i> " + formatTime(duration) + "s";
  }, 1);
});

submitElement.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("submitted");

  clearInterval(durationInterval);
});

function formatTime(millis) {
  return (millis / 1000).toFixed(2);
}