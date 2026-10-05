function Main(){
  this.slide = 5000
  this.move  = 50
  this.wipe  = 1000
  this.shift = this.slide - this.wipe * 2

  this.init()
  this.sort_reverse()
  this.set_slides()
  setTimeout(this.set_wipe.bind(this) , this.shift)
}

// 初期設定（css連動用のプロパティ変数定義）
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

// 表示されている画像(last-child)の移動開始処理
Main.prototype.set_slides = function(){
  const roots = document.querySelectorAll(`.image-wrap`)
  for(const root of roots){
    const img = root.querySelector(`:scope > img:last-child`)
    this.set_slide_animate(img)
  }
}

// 画像のゆっくり移動開始
Main.prototype.set_slide_animate = function(img){
  const move = -this.move
  img.animate([
    {"transform"  : `translateX(${move}px)`},
    {"transform"  : `translateX(0)`},
  ],{
    duration: this.slide
  })
}

// ワイプ開始
Main.prototype.set_wipe = function(){
  const roots = document.querySelectorAll(`.image-wrap`)
  for(const root of roots){
    const img = root.querySelector(`:scope > img:last-child`)
    img.setAttribute("data-wipe" , true)
    const img2 = root.querySelector(`:scope > img:nth-last-child(2)`)
    this.set_slide_animate(img2)
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

// ページのDOM読み込みが完了した後でMain処理を起動
switch(document.readyState){
  case "complete":
  case "interactive":
    new Main()
  break

  default:
    window.addEventListener("DOMContentLoaded" , (() => new Main()))
  break
}