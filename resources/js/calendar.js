"use strict";
//Calendar

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// let monthAndYear = document.getElementsByClassName("year-month")[0];
let headerMonths = document.getElementsByClassName('month')[0];
let headerYears = document.getElementsByClassName('year')[0];
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let selectYear = document.getElementById('year');
let selectMonth = document.getElementById('month');

selectYear.value=currentYear;
selectMonth.value=currentMonth;

next.addEventListener('click', nextMonth);
prev.addEventListener('click', previousMonth);
selectYear.addEventListener('input', (event)=> {
    if(event.keyCode == 13) {
        event.preventDefault();
        return false;
    } else {
        jump();
    }
})
selectMonth.addEventListener('change', jump);

showCalendar(currentMonth,currentYear);

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();

    let tbl = document.getElementsByClassName("calendar-days")[0]; // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    headerMonths.innerHTML = months[month];
    headerYears.innerHTML = year;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }

            else {
                let cell = document.createElement("td");
                let cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("active");
                } // color today's date
                cell.classList.add('day');
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }


        }

        tbl.appendChild(row); // appending each row into calendar body.
    }
}

function nextMonth() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previousMonth() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}


function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}


// Events

let noEvents = document.getElementsByClassName('no-Events')[0];
let eventTitle = document.getElementsByClassName('event-title')[0];
let eventDesc = document.getElementsByClassName('event-desc')[0];

noEvents.innerHTML += 'There are no events on ' + months[currentMonth] + ' ' + today.getDate();

//https://stackoverflow.com/questions/34896106/attach-event-to-dynamic-elements-in-javascript Event Delegation for new elements
document.addEventListener('click',function(e){
    if(!e.target.classList.contains('active') && e.target.classList.contains('day')){
        if(document.getElementsByClassName('active')[0] === undefined){
            e.target.classList.add('active');
        }
        document.getElementsByClassName('active')[0].classList.remove('active');
        e.target.classList.add('active');
    } else if(e.target.classList.contains('active')===null && e.target.classList.contains('day')){
        e.target.classList.add('active');
    }
 });

//handles new Event form
 let newEvent = {
    // day: parseInt(event.innerHTML),
    title: document.querySelector('#new-event-title'),
    desc: document.querySelector('#new-event-desc'),
    month: headerMonths.innerHTML,
    year: headerYears.innerHTML,
    active: document.getElementsByClassName('active')[0].innerHTML,
    submit: ()=>{
        if(newEvent.title.value.length===0){
            console.log('sasc');
            newEvent.title.classList.add('error');
        } else if(newEvent.desc.value.length===0) {
            newEvent.desc.classList.add('error');
        } else {
            newEventJson(newEvent.title.value, newEvent.desc.value, newEvent.month, newEvent.year, newEvent.active);
        }
    }
 };

 document.querySelector('#submit-event').addEventListener('click', (e)=>{
    e.preventDefault();
    newEvent.submit();
 });

 //adds json to eventData
 function newEventJson(title , description, month, year, day){
     let event = {
        "title": title,
        "description": description,
        "year": year,
        "month": month,
        "day": day
     };
     eventData.events.push(event);
 }

//JSON event data
 let eventData = {
     "events": [

     ]
 };