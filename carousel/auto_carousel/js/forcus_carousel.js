/**
 * Focus Carousel
 */

export class FocusCarousel{
  areas       = []
  area        = null
  figure      = null
  isScrolling = null
  is_hover    = null

  constructor(options){
    this.promise = new Promise((resolve, reject)=>{
      this.resolve = resolve
      this.reject  = reject
      
      if(!options || !options.area){
        this.finish()
        return
      }
      this.options = options || {}

      this.area = options.area || null
      this.init()
      this.set_event()
      this.start_anim()
      this.finish()
    })
  }

  get items(){
    return Array.from(this.figure.querySelectorAll(`:scope > *`))
  }

  // カルーセル内のアイテム一覧の取得
  get_items(carousel_area){
    if(!carousel_area){return []}
    return carousel_area.querySelectorAll(`:scope figure > *`)
  }

  // 各種設定データの取得（登録）
  init(){
    this.figure = this.area.querySelector("figure")
    this.options.gap = this.options.gap || 0
    this.area.style.setProperty("--gap" , `${this.options.gap}px`)
    // this.set_active_init()
  }

  // イベント登録
  set_event(){
    this.figure.addEventListener("scroll" , this.scroll.bind(this))
    this.figure.addEventListener("mouseover" , this.mouseover.bind(this))
    this.figure.addEventListener("mouseout" , this.mouseout.bind(this))
    window.addEventListener("resize" , this.scroll.bind(this))
  }

  // [イベント] カルーセルのスクリール処理
  scroll(e){
    this.set_active_scroll()
  }

  // // 初回時、最初のitemをactiveにセットする
  // set_active_init(){
  //   this.isScrolling = true
  //   this.figure.firstElementChild.setAttribute("data-status" , "active")
  //   setTimeout((()=>{
  //     this.isScrolling = false
  //   }),200)
  // }

  // フォーカスアイテムの選択（中心のアイテム）
  set_active_scroll(){
    if(!this.figure){return}
    const current_active_item = this.figure.querySelector(`[data-status="active"]`)

    // 全てのitem取得
    const items = this.figure.querySelectorAll(":scope > .item")

    // center抽出
    let active_center = this.get_center_item(items, current_active_item)
    if(!active_center || current_active_item === active_center){return}

    // active設置処理
    this.set_active_attribute(items, active_center)
  }

  // item一覧の中心にあるitemを取得
  get_center_item(items, current_active_item){
    const area_center = this.figure.scrollLeft + this.area.offsetWidth / 2
    for(const item of items){
      const item_center = item.offsetLeft + (item.offsetWidth/2)
      if(area_center - item.offsetWidth / 2 < item_center 
      && item_center < area_center + item.offsetWidth / 2){
        if(current_active_item === item){continue}
        return item
      }
    }
  }

  // active設置処理
  set_active_attribute(items, active_center){
    for(const item of items){
      if(item === active_center){
        item.setAttribute("data-status" , "active")
      }
      else if(item.hasAttribute("data-status")){
        item.removeAttribute("data-status")
      }
    }
  }

  // オートカルーセルスタート
  start_anim(){
    if(!this.is_hover){
      const current_scrollLeft = this.figure.scrollLeft
      this.figure.scrollTo({
        left : current_scrollLeft + this.options.speed,
        // behavior: "smooth",
      })
      // loop処理
      this.loop()
    }
    requestAnimationFrame(this.start_anim.bind(this))
  }

  mouseover(){
    this.is_hover = true
  }
  mouseout(){
    this.is_hover = false
  }

  // loop処理
  loop(){
    const items = this.figure.querySelectorAll(":scope > .item")
    let current_scroll_left = this.figure.scrollLeft
    for(const item of items){
      if(item.scrollLeft + item.offsetWidth + this.options.gap < current_scroll_left){
        this.figure.appendChild(item)
        this.figure.scrollLeft -= (item.offsetWidth + this.options.gap)
        current_scroll_left = this.figure.scrollLeft
      }
    }
  }

  // 設定完了処理(.promise.then()で処理追加が可能)
  finish(){
    this.resolve()
  }
}
