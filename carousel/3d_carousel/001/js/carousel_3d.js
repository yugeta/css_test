import { Uuid } from "./uuid.js"


export class Carousel3d{
  selector = ".carousel.\\33 d"
  areas = []

  constructor(){
    this.promise = new Promise((resolve, reject)=>{
      this.resolve = resolve
      this.reject  = reject
      this.init()
      this.set_event()
      this.finish()
    })
  }

  get elements(){
    return document.querySelectorAll(this.selector)
  }

  get_items(carousel_area){
    if(!carousel_area){return []}
    return carousel_area.querySelectorAll(`:scope figure > *`)
  }

  init(){
    for(const area of this.elements){
      const uuid = new Uuid().make()
      area.setAttribute("data-uuid" , uuid)
      // center position
      const rect = area.getBoundingClientRect()
      this.areas.push({
        uuid   : area.getAttribute("data-uuid"),
        elm    : area,
        rect   : rect,
        center : rect.width / 2,
        items  : this.get_items(area),
      })

      // Write coordinates to item
      this.set_value(area)

    }
  }

  get_area_data(area){
    return this.areas.find(e => e.uuid === area.getAttribute("data-uuid"))
  }

  set_event(){
    for(const area of this.elements){
      const figure = area.querySelector(":scope > *")
      figure.addEventListener("scroll" , this.scroll.bind(this))
    }
  }

  scroll(e){
    
    this.set_value(e.target)
  }

  set_value(figure){
    if(!figure){return}
    const area = figure.closest(this.selector)
    const data  = this.get_area_data(area)
    if(!data){return}
    const items = data.items
    for(const item of items){
      
      const left = ~~item.offsetLeft - figure.scrollLeft + (item.offsetWidth / 2) - (data.rect.width) / 2
      const z = Math.abs(left) * -1
      item.style.setProperty("--z", `${z}px`,"")
      const rotate = (90 * (left / data.center))
      item.style.setProperty("--rot", `${rotate}deg`,"")
    }
  }


  finish(){
    this.resolve()
  }
}
