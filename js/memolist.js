import { Memo, MemoUtils } from './objects.js';

const memoPage = document.getElementById("memo-form");
const memoElements = memoPage.elements;
const JSON_SEPARATOR = "~";

window.cleanNonResettableFields = () => {
    document.getElementById("date").value = null;
}

window.generateMemo = () => {
    const title = memoElements.title.value;
    if (!title && window.config.mandatoryFields.title) {
        displayErrorModal("Title can't be empty");
        return;
    }
    const date = memoElements.date.value;
    if (!date && window.config.mandatoryFields.date) {
        displayErrorModal("Date can't be empty");
        return;
    }
    const time = memoElements.time.value;
    const notes = memoElements.notes.value;
    const memo = new Memo(title, date, time, notes);
    appendMemo(memo, true);
    clickResetFormButton();
    displaySuccessModal();
}

function displayErrorModal(error) {
    const modal = document.getElementById("error-modal");
    modal.innerHTML = `${error} <img src="img/cross.png">`;
    modal.classList.remove("display");
    modal.classList.add("display");
    setTimeout(() => modal.classList.remove("display"), 4000);  
}

function displaySuccessModal() {
    const modal = document.getElementById("success-modal");
    modal.classList.remove("display");
    modal.classList.add("display");
    setTimeout(() => modal.classList.remove("display"), 4000);    
}

function appendMemo(memo, save=false) {
    const memoTag = getMemoHTML(memo);
    MemoUtils.PARENT_NODE.appendChild(memoTag);
    if (save) {
        saveMemo(memo);
    }
}

function clickResetFormButton() {
    let cancelButton = memoElements["cancel-btn"];
    cancelButton.click();
}

export function loadMemoes(cleanMemory = true) {
    let memoes = localStorage.getItem("memoes");
    if(cleanMemory) {
        localStorage.removeItem("memoes");
        saveMemoes(); // refresh IDs
    }
    if(memoes) {
        document.getElementById("empty-list-placeholder").hidden = true;
    }
    return memoes 
        ? memoes.split(JSON_SEPARATOR).map(JSON.parse)
        : [];
}

export function renderMemoes(memoesJSON) {
    const memoes = memoesJSON.map(MemoUtils.memoFromJSON);
    memoes.forEach(memo => appendMemo(memo));
    return memoes;
}

function saveMemo(memo) {
    window.memoes.push(memo.getAsJSON());
    saveMemoes();
}

export function saveMemoes() {
    if (window.memoes && window.memoes.length) {
        let memoArrayString = window.memoes
                                    .map(JSON.stringify)
                                    .reduce((a, b) => a + JSON_SEPARATOR + b);
        localStorage.setItem("memoes", memoArrayString);
        document.getElementById("empty-list-placeholder").classList.add("no-show");
    } else {
        localStorage.removeItem("memoes");
    }
}

function getMemoHTML(memo) {
    var cardClone = MemoUtils.TEMPLATE_NODE.content.cloneNode(true);
    cardClone.querySelector(".memo").id = memo.id;
    ["title", "date", "time", "notes"].forEach(info => {
        let infoField = cardClone.querySelector(`.${info}`);
        memo[info] 
            ? infoField.innerHTML = ((info === "notes") ? "<br/>" : "" ) + sanitize(memo[info])
            : infoField.hidden = true;
    });
    cardClone.querySelector(".delete").onclick = () => promptDeleteMemo(memo.id);
    return cardClone;
}

function sanitize(string) {
    return string
            .replace("<", "&lt;")
            .replace(">", "&gt;");
}

function promptDeleteMemo(id) {
    const title = document.getElementById(id).querySelector(".title").innerHTML;
    setDeleteModalMemoId(id);
    document.getElementById("delete-confirm-title").innerHTML = title;
    window.showModal(true, "delete-confirm-modal");
}

function deleteMemoById(id) {
    const memoToDelete = document.getElementById(id);
    memoToDelete.classList.add("fade");
    window.memoes = window.memoes.filter(memo => memo.id != id);
    setTimeout(() => {
        memoToDelete.parentElement.removeChild(memoToDelete);
        if (window.memoes.length == 0) {
            document.getElementById("empty-list-placeholder").classList.remove("no-show");
        }
    }, 1500);
    saveMemoes();
}

window.undoDeleteMemo = () => {
    window.showModal(false, "delete-confirm-modal");
    setDeleteModalMemoId(null);
}

window.deleteMemo = () => {
    window.showModal(false, "delete-confirm-modal");
    deleteMemoById(getDeleteModalMemoId());
}

function setDeleteModalMemoId(id) {
    document.getElementById("delete-confirm-modal").dataset.memoId = id;
}

function getDeleteModalMemoId() {
    return document.getElementById("delete-confirm-modal").dataset.memoId;
}