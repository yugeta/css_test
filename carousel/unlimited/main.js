class InfiniteCarousel {
  constructor(elm) {
    if (!elm) return;
    this.root = elm;
    this.selector = ".slider";
    this.scrollStopFlag = false;

    // 初期化
    this.init();
  }

  init() {
    this.setupElements();
    this.setInitialActiveItem();
    this.cloneElements();
    this.setInitialPosition();
    this.attachEvents();
  }

  setupElements() {
    this.elmSlider = this.root.querySelector(this.selector);
    this.elmItems = Array.from(this.elmSlider.querySelectorAll(".item"));
    this.centerPos = this.elmSlider.offsetWidth / 2;
  }

  setInitialActiveItem() {
    if (this.elmItems.length > 0) {
      this.elmItems[0].classList.add("active");
    }
  }

  cloneElements() {
    const numClones = Math.ceil(this.elmSlider.offsetWidth / this.elmItems[0].offsetWidth);

    // 前後にアイテムを複製
    this.elmItems.forEach(item => {
      for (let i = 0; i < numClones; i++) {
        const clone = item.cloneNode(true);
        this.elmSlider.appendChild(clone);
      }
    });

    this.elmItems.slice().reverse().forEach(item => {
      for (let i = 0; i < numClones; i++) {
        const clone = item.cloneNode(true);
        this.elmSlider.prepend(clone);
      }
    });

    this.elmItems = Array.from(this.elmSlider.querySelectorAll(".item"));
  }

  setInitialPosition() {
    const activeItem = this.elmItems.find(item => item.classList.contains("active"));
    if (activeItem) {
      const offset = activeItem.offsetLeft - this.centerPos + activeItem.offsetWidth / 2;
      this.elmSlider.scrollLeft = offset;
    }
  }

  attachEvents() {
    this.elmSlider.addEventListener("scroll", this.throttle(this.handleScroll.bind(this), 100));
  }

  handleScroll() {
    if (this.scrollStopFlag) return;

    const activeItem = this.elmItems.find(item => item.classList.contains("active"));
    if (!activeItem) return;

    const rect = activeItem.getBoundingClientRect();
    const sliderRect = this.elmSlider.getBoundingClientRect();

    if (rect.left > sliderRect.right || rect.right < sliderRect.left) {
      this.scrollStopFlag = true;

      // 中央位置にアイテムがあるように調整
      const offset = activeItem.offsetLeft - this.centerPos + activeItem.offsetWidth / 2;
      this.elmSlider.scrollLeft = offset;

      // スクロール完了後にフラグを解除
      requestAnimationFrame(() => {
        this.scrollStopFlag = false;
      });
    }
  }

  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

// 使用例
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".carousel");
  if (slider) {
    new InfiniteCarousel(slider);
  }
});