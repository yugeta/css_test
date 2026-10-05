

export class LoadImage{
  images  = []
  img     = null
  src     = null
  attr    = "data-src"
  options = {}

  constructor(options){
    this.options = options || {}
    this.promise = new Promise((resolve, reject)=>{
      this.resolve = resolve
      this.reject  = reject
      this.images = this.get_iamges()
      if(this.images && this.images.length){
        this.set_images()
      }
      else{
        this.finish()
      }
    })
  }

  get_iamges(){
    return Array.from(document.querySelectorAll(`img[${this.attr}]`))
  }

  set_images(){
    if(!this.images || !this.images.length){
      this.finish()
      return
    }
    this.img = this.images.shift()
    this.src = this.img.getAttribute(this.attr)
    this.img.removeAttribute(this.attr)
    if(this.src){
      this.load_image()
    }
    else{
      this.set_images()
    }
  }

  get_src(src){
    
    switch(this.options.cash){
      case "clear":
        const dt = (+new Date())
        if(src.indexOf("?") === -1){
          return src.split("?")[0] + "?" + dt
        }
        else{
          return src + "&" + dt
        }
      break

      default:
        return src
    }
  }

  load_image(){
    this.img.onload = this.loaded_image.bind(this)
    this.img.src = this.get_src(this.src)
   }

  loaded_image(e){
    this.set_images()
  }

  finish(){
    this.resolve()
  }
}