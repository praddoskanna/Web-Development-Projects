var randomNumber1 = Math.floor(Math.random() * 6) + 1 ; //1-6
console.log(document.getElementsByClassName("container").value);
var randomImage = "images/dice" + randomNumber1 + ".png";

document.querySelector(".img1").setAttribute("src",randomImage);

var randomNumber2 = Math.floor(Math.random() * 6) + 1 ; //1-6

var randomImage = "images/dice" + randomNumber2 + ".png";

document.querySelector(".img2").setAttribute("src",randomImage);

if(randomNumber1 > randomNumber2){
document.querySelector("h1").textContent = "🎌Krithik Sai Wins";
}
else if ( randomNumber1 === randomNumber2 ){
  document.querySelector("h1").textContent = "🎌Draw🎌";
}
else{
  document.querySelector("h1").textContent = "Pradosh Wins🎌";
}

function refreshPage(){
    window.location.reload();
}
