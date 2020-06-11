export class Memo {
    id;
    title;
    date;
    time;
    notes;

    constructor(title, date, time, notes) {
        this.title = title;
        this.date = date;
        this.time = time || "All day";
        this.notes = notes;
        this.id = MemoUtils.idCounter++;
        return this;
    }

    get id() {
        return this.id;
    }

    set title(title) {
        this.title = title;
        this.render();
    }

    get title() {
        return this.title;
    }

    set notes(notes) {
        this.notes = notes;
        this.render();
    }

    get notes() {
        return this.notes;
    }

    get date() {
        return this.time;
    }

    setTime(hour, min) {
        this.date.setTime(hour, min);
        this.render();
    }

    // setTimeFromDate(date) {
    //     this.date.setTimeFromDate(hour, min);
    //     this.render();
    // }

    setDate(year, month, day) {
        this.date.setDate(year, month, day);
        this.render();
    }

    setDateFromDate(date) {
        this.date.setDateFromDate(date);
        this.render();
    }

    getAsJSON() {
        return {
            id: this.id,
            title: this.title,
            date: this.date, 
            time: this.time, 
            notes: this.notes
        };
    }
}



export class MemoUtils {
    static PARENT_SELECTOR = "#memo-list-page";
    static PARENT_NODE = document.querySelector(MemoUtils.PARENT_SELECTOR); 
    static TEMPLATE_SELECTOR = "template#memo-template";
    static TEMPLATE_NODE = document.querySelector(MemoUtils.TEMPLATE_SELECTOR); 
    static idCounter = 0;
    static memoFromJSON = (json) => {
        const {title, date, time, notes} = json;
        return new Memo(title, date, time, notes);
    }
}

// class MemoDate {
//     rawDate;

//     constructor(date) {
//         this.rawDate = date || new Date(); 
//     }

//     get rawDate() {
//         return this.rawDate;
//     }

//     set rawDate(date) {
//         this.rawDate = date;
//     }

//     getDate() {
//         return this.parseDateText();
//     }

//     getTime() {
//         return this.parseTimeText();
//     }

//     // -------------------
//     //    DATE Functions
//     // -------------------

//     parseDateJSON(date = this.rawDate) {
//         let year = date.getFullYear();
//         let month = date.getMonth() + 1;
//         let day = date.getDate();
//         return {year, month, day};
//     }

//     parseDateText(separator=" / ", date = this.rawDate) {
//         let {day, month, year} = this.parseDateJSON(date);
//         return [day, month, year].join(separator);
//     }

//     setDate(year, month, day) {
//         this.rawDate.setFullYear(year, month - 1, day);
//     }

//     setDateFromDate(date) {
//         this.setTime(this.parseDateJSON(date));
//     }


//     // -------------------
//     //    TIME Functions
//     // -------------------

//     parseTimeJSON(time = this.rawDate) {
//         let hours = time.getHours();
//         let minutes = time.getMinutes();
//         return {hours, minutes};
//     }

//     parseTimeText(separator=" : ", time = this.rawDate) {
//         let {hours, minutes} = this.parseTimeJSON(time);
//         return [hours, minutes].join(separator);
//     }

//     setTime(hour, min) {
//         this.rawDate.setHours(hour, min);
//     }

//     setTimeFromDate(date) {
//         this.setDate(this.parseTimeJSON(date));
//     }
// }