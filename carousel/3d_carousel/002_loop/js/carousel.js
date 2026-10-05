import { Uuid } from "./uuid.js"

export class Carousel{
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
      const figure = area.querySelector("figure")
      this.set_status(figure)
      this.set_loop(figure)
    }
  }

  get_area_data(area){
    return this.areas.find(e => e.uuid === area.getAttribute("data-uuid"))
  }

  set_event(){
    for(const area of this.elements){
      const figure = area.querySelector(":scope > *")
      figure.addEventListener("scroll" , this.scroll.bind(this))
      figure.addEventListener("scrollend" , this.scroll_end.bind(this))
    }
    window.addEventListener("resize" , this.resize.bind(this))
  }

  scroll(e){
    this.set_status(e.target)
  }

  set_status(figure){
    if(!figure){return}
    const area = figure.closest(this.selector)
    const data  = this.get_area_data(area)
    if(!data){return}
    const items = data.items
    for(const item of items){
      const center = Math.abs(~~(item.offsetLeft - figure.scrollLeft + (item.offsetWidth / 2)) - data.center)
      if(center < item.offsetWidth/2){
        item.setAttribute("data-status" , "active")
      }
      else if(item.hasAttribute("data-status")){
        item.removeAttribute("data-status")
      }
    }
  }

  scroll_end(e){
    this.set_loop(e.target)
  }
  set_loop(figure){
    if(!figure){return}
    // if(!data){return}
    const elms = figure.querySelectorAll(":scope > *")

    // left
    if(figure.scrollLeft < elms[0].offsetWidth){
      this.item_end2start(figure, elms[elms.length-1], elms[0])
    }

    // right
    else if(elms[elms.length-1].offsetLeft < figure.scrollLeft + figure.offsetWidth){
      this.item_start2end(figure, elms[0])
    }
  }

  item_end2start(figure, end_elm, start_elm){
    figure.insertBefore(end_elm, start_elm)
    figure.scrollLeft += end_elm.offsetWidth / 2
  }

  item_start2end(figure, start_elm){
    figure.appendChild(start_elm)
  }

  resize(){
    // console.log("resize")
    this.init()
  }


  finish(){
    this.resolve()
  }
}
