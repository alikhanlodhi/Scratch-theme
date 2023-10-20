     const slider = document.getElementById("slider");
        const prevButton = document.getElementById("prev");
        const nextButton = document.getElementById("next");
        const slideWidth = document.querySelector(".slider-item").clientWidth;
        let currentIndex = 0;

        function slideNext() {
            if (currentIndex < slider.children.length - 1) {
                currentIndex++;
                updateSliderPosition();
            }
        }

        function slidePrev() {
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
            }
        }

        function updateSliderPosition() {
            slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }

        prevButton.addEventListener("click", slidePrev);
        nextButton.addEventListener("click", slideNext);
   