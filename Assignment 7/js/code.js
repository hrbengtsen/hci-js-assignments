const timerElement = document.getElementById("timer");
const submitStateElement = document.getElementById("submitState");
const forms = document.getElementsByClassName("needs-validation");

let durationInterval;
let duration = 0;

timerElement.addEventListener("click", (event) => {
  if (duration !== 0) {
    duration = 0;
    clearInterval(durationInterval);
    timerElement.innerHTML = "<i class='fas fa-stopwatch'></i> " + 0 + "s";
  }
  else {
    let startTime = Date.now();
    durationInterval = setInterval(() => {
      duration = Date.now() - startTime;
      timerElement.innerHTML = "<i class='fas fa-stopwatch'></i> " + formatTime(duration) + "s";
    }, 10);
  }

  Array.prototype.filter.call(forms, function(form) {
    form.classList.remove('was-validated');
    form.reset();
  });
  submitStateElement.innerText = "";
});

(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (duration === 0) {
          submitStateElement.innerText = "Time not started.";
        }
        else {
          if (form.checkValidity()) {
            console.log("submitted");
            clearInterval(durationInterval);
            submitStateElement.innerText = "Form was submitted in " + formatTime(duration) + "s";
          }
          else {
            submitStateElement.innerText = "Form was not validated.";
          }
          form.classList.add('was-validated');
        }
      }, false);
    });
  }, false);
})();

function formatTime(millis) {
  return (millis / 1000).toFixed(2);
}