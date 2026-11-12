const add25 = document.getElementById("addTime25min");
const addBtn = document.getElementById("addTime5min");
const list = document.getElementById("reset");
const timer = document.getElementById("time");


add25.addEventListener("click", addtime(25))


function addTime(cantTime){
    timer.innerText(cantTime)
}