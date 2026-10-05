/**
 * # Title
 * - １要素を横無限スクロールさせるスニペット
 * 
 * # Summary
 * - 文字を無限スクロール
 * - 写真などのを無限スクロール
 * 
 * # Howto
 * - <div class="telop-scroll">~</div>で単一要素を囲う
 * - 自動で、内部要素（単一要素）が画面幅に合わせて複製される。
 */

function Main(){
  window.addEventListener("resize" , this.set_copy.bind(this))
  this.set_copy()
}

// telop-scrollクラスを全て抽出
Main.prototype.set_copy = function(){
  const elms = document.querySelectorAll(`.telop-scroll`)
  for(const elm of elms){
    this.copy(elm)
  }
}

// telop-scrollの内部をスクロールサイズに合わせて複製
// - root要素の２倍以上になるように、内部要素（単一要素）をコピーする（既にコピーされていて多い場合は削除する）
Main.prototype.copy = function(root){
  const root_width = root.offsetWidth
  const elm        = root.firstElementChild
  const elm_width  = elm.offsetWidth
  const elm_count  = root.children.length
  let need_count = Math.ceil((root_width * 2) / elm_width)
  need_count = need_count > 2 ? need_count : 2

  console.log(root_width,elm_width,elm_count,need_count)

  if(elm_count < need_count){
    for(let i=0; i<need_count - elm_count; i++){
      const node = root.firstElementChild.cloneNode(true)
      root.appendChild(node)
    }
  }
  else if(elm_count > need_count){
    for(let i=0; i< elm_count - need_count; i++){
      root.removeChild(root.lastElementChild)
    }
  }
}

switch(document.readyState){
  case "complete":
  case "interactive":
    new Main()
  break
  default:
    window.addEventListener("DOMContentLoaded", (()=> new Main()))
}