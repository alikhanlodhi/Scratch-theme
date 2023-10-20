
class VideoPlayer extends HTMLElement {
  constructor() {
    super();
    this.VideoPlayButton = document.querySelector('#play-button');
    this.VideoThumbnail = document.querySelector(
      '.video_thumbnail_wrapper'
    );
    this.VideoPlayer = this.querySelector('video');
    this.desktopSrc = this.dataset.desktopVideoSrc;
    this.mobileSrc = this.dataset.mobileVideoSrc;
    this.controls = this.dataset.controls;
    this.autoplay = this.dataset.autoPlay;
    this.loop = this.dataset.loop;
    this.muted = this.dataset.muted;
    this.hideThumbnailImage = this.hideThumbnailImage.bind(this);
    this.init();
  }

  init() {
    if (this.controls === 'true') {
      this.VideoPlayer?.setAttribute('controls', '');
    }
    if (this.autoplay === 'true') {
      this.VideoPlayer?.setAttribute('autoplay', '');
      this.VideoPlayer?.play();
    }
    if (this.loop === 'true') {
      this.VideoPlayer?.setAttribute('loop', '');
    }
    if (this.muted === 'true') {
      this.VideoPlayer?.setAttribute('muted', '');
    }
    if (window.innerWidth < 580) {
      this.VideoPlayer?.setAttribute('src', this.mobileSrc);
      this.VideoPlayer?.setAttribute('data-mobile', 'true');
    } else {
      this.VideoPlayer?.setAttribute('src', this.desktopSrc);
      this.VideoPlayer?.setAttribute('data-desktop', 'true');
    }
    this.bindEvents();
  }

  bindEvents() {
    this.VideoPlayButton?.addEventListener('click', this.hideThumbnailImage);
  }

  hideThumbnailImage = () => {
    this.VideoThumbnail.parentNode.removeChild(this.VideoThumbnail);
    this.VideoPlayer.play();
  }

}
customElements.define('video-player', VideoPlayer);




class VerticalScroller extends HTMLElement {
  constructor() {
    super();

    const mainContainer = document.querySelector('.vertical_scroll_categroy_section')
    const slides = this.querySelectorAll('.slide');

    // this.progressBarContainer = this.querySelector('.progress-bar-container');
    // this.progressbar = this.querySelector('.progress-bar-sc');
    // this.progressBarIndecator = this.querySelector('.progress-bar-indicator');

    // const sectionId = this.dataset.sectionId;
    // const containerClass = `.container-${sectionId}`;
    // const container = document.querySelector(containerClass);
    // const sections = gsap.utils.toArray(`${containerClass} > .panel`);

    // const containerWidth = document.querySelector(containerClass).offsetWidth;
    // const containerScrollWidth = document.querySelector(containerClass).scrollWidth;

    // let scrollTween = gsap.to(sections, {
    //   x: () => -1 * (containerScrollWidth - containerWidth) - (sections.length * 20),
    //   delay: 2,
    //   ease: 'none',
    //   scrollTrigger: {
    //     trigger: containerClass,
    //     pin: true,
    //     scrub: 0.1,
    //     start: 'center center',
    //     end: '+=' + containerScrollWidth * 2,
    //     onUpdate: this.handleProgressBar.bind(this),
    //     pin: '.pin'
    //   },
    // });

    slides.forEach((slide) => {
      slide.addEventListener('mouseenter', function (e) {
        slide.querySelector('lottie-player').play();
      });
      slide.addEventListener('mouseleave', function (e) {
        slide.querySelector('lottie-player').stop();
      });
    });

    const scrollContainer = this.querySelector('.scroll-content-wrapper');
    const scrollContent = this.querySelector('.scroller-container');
    const progressBarIndecator = scrollContainer.querySelector('.progress-bar-indicator')
    scrollContent.addEventListener('scroll', function () {
      var scrollPercentage = (scrollContent.scrollLeft / (scrollContent.scrollWidth - scrollContainer.clientWidth)) * 100;
      const progress = parseInt(scrollPercentage);

      if (progress > 0) {
        mainContainer.style.paddingLeft = 0;
        mainContainer.style.paddingRight = 0;
      } else {
        mainContainer.style.paddingLeft = '40px';
        mainContainer.style.paddingRight = '40px';
      }
      progressBarIndecator.style.left = progress < 15 ? `0px` : `calc(${progress}% - 50px)`;
    });
  }

  // handleProgressBar(self) {
  //   const progress = parseInt(self.progress * 100);
  //   this.progressBarIndecator.style.left = progress < 15 ? `0px` : `calc(${progress}% - 50px)`;
  // }

}
customElements.define('vertical-scroller', VerticalScroller);

class SwiperSlider extends HTMLElement {
  constructor() {
    super();
    this.swiperEl = this.querySelector('swiper-container:not(#thumb-slider-container)');
    this.slides = this.swiperEl.querySelectorAll('swiper-slide');
    this.swiperParams = this.getAttribute('data-swiperParams');
    this.swiperThumb = this.querySelector('swiper-container#thumb-slider-container');
    this.swiperThumbsParams = this.getAttribute('data-thumbsParams');
    this.lottie_player =
      this.getAttribute('data-lottie-player') ||
      this.querySelector('lottie-player').getAttribute(
        'data-lottie-player'
      );
  }

  connectedCallback() {
    let swiper_params = JSON.parse(this.swiperParams);
    let swiperThumbsParams = JSON.parse(this.swiperThumbsParams);
    if (swiper_params) {
      Object.assign(this.swiperEl, swiper_params);
      const swiperr = this.querySelector('swiper-container:not(#thumb-slider-container)')

      this.swiperEl.initialize();
    }
    if (swiperThumbsParams) {
      Object.assign(this.swiperThumb, swiperThumbsParams);
      this.swiperThumb.initialize();
    }
    if (this.lottie_player == 'true' || this.lottie_player == true) {
      this.bindEvents();
      if (window.innerWidth <= 1100) {
        this.isInViewPort();
      }
    }
  }

  bindEvents() {
    this.slides.forEach((slide) => {
      slide.addEventListener('mouseenter', function (e) {
        slide.querySelector('lottie-player').play();
      });
      slide.addEventListener('mouseleave', function (e) {
        slide.querySelector('lottie-player').stop();
        slide.querySelector('lottie-player').goToAndStop(0);
      });
    });

  }

  isInViewPort() {
    this.observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const ltiePlayer = entry.target.querySelector('lottie-player');
          console.log("isIntersecting", ltiePlayer);
          ltiePlayer.stop();
          ltiePlayer.play();
        }
      });
    }, { threshold: 0.5 });
    this.slides.forEach((slide) => {
      this.observer.observe(slide);
    });
  }
}
customElements.define('swiper-slider', SwiperSlider);