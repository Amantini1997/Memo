import "./objects.js";
import { saveMemoes, loadMemoes, renderMemoes } from "./memolist.js";

document.addEventListener("DOMContentLoaded", loadContent);

const PAGE_TITLES = [
    "New Memo",
    "Memoes",
    "Settings"
];

function loadContent() {
    let memoes = loadMemoes(false);
    window.memoes = renderMemoes(memoes);
    saveMemoes();
    loadSwiper();
    loadPickers();
    savePageHeight();
    // setCalendarCallback();
}

function loadSwiper() {
    var swiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        loop: false,
        on: {
            slideChange: updateHeader,
        }
    });
    window.mySwiper = swiper;
    swiper.slideTo(1, 0, false);
}

function loadPickers() {
    loadDatePicker();
    loadTimePicker();
}

function loadDatePicker() {
    const datePicker = new Picker(document.querySelector('.js-date-picker'), {
        format: 'DD - MM - YYYY',
        text: {
            title: 'Pick a date',
        },
    });
}

function loadTimePicker() {
    new Picker(document.querySelector('.js-time-picker'), {
        format: 'HH : mm',
        text: {
            title: 'Pick time',
        },
    });
}

function updateHeader() {
    const pageTitle = document.querySelector("#page-title");
    pageTitle.innerHTML = PAGE_TITLES[window.mySwiper.activeIndex];
}

function savePageHeight() {
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) / 100;
    document.documentElement.style.setProperty("--viewport-height-one", vh + "px");
}