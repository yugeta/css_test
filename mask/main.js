
class Main{
  constructor(){
    this.event()
  }

  get elm_svg(){
    return document.querySelector("svg.stroke")
  }

  event(){
    window.addEventListener("click",()=>this.click())
  }

  click(){
    if(!this.elm_svg){return}

    // on -> off
    if(this.elm_svg.classList.contains("active")){
      this.elm_svg.classList.remove("active")
    }
    else{
      this.elm_svg.classList.add("active")
    }
  }


}

switch(document.readyState){
  case "complete":
  case "interactive":
    new Main();break
  default:
    document.addEventListener("DOMContentLoaded",()=>new Main())
}