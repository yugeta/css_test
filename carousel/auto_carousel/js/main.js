import { LoadImage } from "./load_image.js"
import { FocusCarousel }  from "./forcus_carousel.js"

export class Main{
  selector    = ".focus-carousel"

  constructor(){
    new LoadImage({
      cash : "clear"
    }).promise.then(()=>{
      for(const area of this.carousel_elements){
        new FocusCarousel({
          area : area,
          gap  : 30,
          speed : 1.0,
        })
      }
    })
  }

  // 1ページ内のカルーセル領域の取得（エリア一覧）
  get carousel_elements(){
    return document.querySelectorAll(this.selector)
  }


}

switch(document.readyState){
  case "complete":
  case "interactive":
    new Main()
    break
  default:
    window.addEventListener("DOMContentLoaded" , (()=> new Main()))
}