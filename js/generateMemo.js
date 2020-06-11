window.showModal = (show, modalId) => {
    const style = document.getElementById(modalId).classList;
    if (show) {
        style.add("show");
        style.remove("no-show");
        window.mySwiper.allowTouchMove = false;
    } else {
        style.remove("show");
        style.add("no-show");
        window.mySwiper.allowTouchMove = true;
        // setSelectedDate();
    }
}

function dateToString(date) {
    return `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
}