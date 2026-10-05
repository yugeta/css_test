function Main(){
  const btn = document.querySelector("button.js")
  
  // スマホ
  if('ontouchstart' in window || navigator.maxTouchPoints){
    btn.addEventListener("touchstart"  , (e => {e.target.setAttribute("data-status","mouseover")}))
    btn.addEventListener("touchend"    , (e => {e.target.removeAttribute("data-status")}))
    btn.addEventListener("touchcancel" , (e => {e.target.removeAttribute("data-status")}))
  }
  // pc
  else{
    btn.addEventListener("mouseover", (e => {e.target.setAttribute("data-status","mouseover")}))
    btn.addEventListener("mouseout" , (e => {e.target.removeAttribute("data-status")}))
  }
}

switch(document.readyState){
  case "complete":
  case "interactive":
    Main()
  default:
    window.addEventListener("DOMContentLoaded", (()=>Main()))
}