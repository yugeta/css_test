function Main(){
  this.slide = 8000
  this.move  = 50
  this.wipe  = 1000
  this.shift = this.slide - this.wipe * 2

  this.init()
  this.sort_reverse()
  this.set_slide()
  setTimeout(this.set_wipe.bind(this) , this.shift)
}

Main.prototype.init = function(){
  const roots = document.querySelectorAll(`.image-wrap`)
  for(const root of roots){
    root.style.setProperty("--slide", `${this.slide}ms`, "")
    root.style.setProperty("--move" , `${this.move}px`, "")
    root.style.setProperty("--wipe" , `${this.wipe}ms`, "")
  }
}

// DOMの順番を逆にする（DOM最終が先頭で表示されるため）
Main.prototype.sort_reverse = function(){
  const roots = document.querySelectorAll(`.image-wrap`)
  for(const root of roots){
    const imgs = root.querySelectorAll(`:scope > img`)
    for(const img of imgs){
      root.insertBefore(img, root.firstElementChild)
    }
  }
}

Main.prototype.set_slide = function(){
  const roots = document.querySelectorAll(`.image-wrap`)
  for(const root of roots){
    const img = root.querySelector(`:scope > img:last-child`)
    img.setAttribute("data-slide" , true)
  }
}

// ワイプ開始
Main.prototype.set_wipe = function(){
  const roots = document.querySelectorAll(`.image-wrap`)
  for(const root of roots){
    const img = root.querySelector(`:scope > img:last-child`)
    img.setAttribute("data-wipe" , true)
    const img2 = root.querySelector(`:scope > img:nth-last-child(2)`)
    img2.setAttribute("data-slide" , true)
  }
  setTimeout(this.sort_change.bind(this) , this.wipe)
}

// 最終を先頭にもってくる
Main.prototype.sort_change = function(){
  const roots = document.querySelectorAll(`.image-wrap`)
  for(const root of roots){
    const img = root.querySelector(`:scope > img:last-child`)
    root.insertBefore(img, root.firstElementChild)
    img.removeAttribute("data-wipe")
    img.removeAttribute("data-slide")
  }
  setTimeout(this.set_wipe.bind(this) , this.shift)
}

switch(document.readyState){
  case "complete":
  case "interactive":
    new Main()
  break

  default:
    window.addEventListener("DOMContentLoaded" , (() => new Main()))
  break
}