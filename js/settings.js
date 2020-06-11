const LIGHT_THEME = "light";
const DARK_THEME = "dark";
const localStorageThemeTag = "theme";

function toggleDarkMode(label) {
    let input = label.children[0];
    input.checked = !input.checked;
    let newTheme = input.checked ? DARK_THEME : LIGHT_THEME;
    document.body.dataset.theme = newTheme;
    localStorage.setItem(localStorageThemeTag, newTheme);
}

(function init() {
    const theme = localStorage.getItem(localStorageThemeTag);
    const isDarkMode = theme ? theme == DARK_THEME : false;
    document.querySelector("#darkmode").checked = isDarkMode;
    document.body.dataset.theme = isDarkMode ? DARK_THEME : LIGHT_THEME;
})();