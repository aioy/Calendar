"use strict";
//Calendar

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

 //JSON event data
 let eventData = {
    "events": [
        {
            "description": 'es',
            "year": '2018',
            "month": 'Nov',
            "day": '28'
        }
    ]
 };

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
showEvents();

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
                    cell.classList.add("active"); // color today's date
                } 
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
    showEvents();
}

function previousMonth() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
    showEvents();
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
    showEvents();
}


function daysInMonth (month, year) {
    return new Date(year, month+1, 0).getDate();
}


// Events

//https://stackoverflow.com/questions/34896106/attach-event-to-dynamic-elements-in-javascript Event Delegation for new elements
document.addEventListener('click',function(e){
    if(!e.target.classList.contains('active') && e.target.classList.contains('day')){
        if(document.getElementsByClassName('active')[0] === undefined){
            e.target.classList.add('active');
        }
        document.getElementsByClassName('active')[0].classList.remove('active');
        if(document.getElementsByClassName('active')[0] === undefined){
            e.target.classList.add('active');
        }
        e.target.classList.add('active');
    } else if(e.target.classList.contains('active')===null && e.target.classList.contains('day')){
        e.target.classList.add('active');
    }
 });

//handles new Event form
 let newEvent = {
    // day: parseInt(event.innerHTML),
    desc: document.querySelector('#new-event-desc'),
    month: headerMonths,
    year: headerYears,
    active: document.getElementsByClassName('active'),
    submit: ()=>{
        if(newEvent.desc.value.length===0) {
            newEvent.desc.classList.add('error');
        } else {
            newEventJson(newEvent.desc.value, newEvent.month.innerHTML, newEvent.year.innerHTML, newEvent.active[0].innerHTML);
            hideShowEventsDiv();
            showEventText(newEvent.desc.value, newEvent.month.innerHTML, newEvent.year.innerHTML, newEvent.active[0].innerHTML);
            newEvent.clear();
        }
    },
    clear: ()=>{
        newEvent.desc.value='';
    }
 };

 const hideShowEventsDiv = ()=> {
     let eventsDiv = document.querySelector('.events');
     let newEventForm = document.querySelector('.new-event-form');
     let saveEventButton = document.querySelector('.submit-event');
     let showEventForm = document.querySelector('.show-event-form');

     if(eventsDiv.classList.contains('hidden')){
         //show Events
        newEventForm.classList.add('hidden');
        newEventForm.classList.remove('visible');
        eventsDiv.classList.remove('hidden');
        eventsDiv.classList.add('visible');
        showEvents();
        //change rotate class for Event listener
        saveEventButton.classList.remove('rotate');
        showEventForm.classList.add('rotate');
     } else {
         //show new Event Form
        eventsDiv.classList.remove('visible');
        eventsDiv.classList.add('hidden');
        newEventForm.classList.remove('hidden');
        newEventForm.classList.add('visible');
        showEventForm.classList.remove('rotate');
        saveEventButton.classList.add('rotate');
     }   
 }

 //Submit form and show event or new event form
 document.addEventListener('click', (e)=>{
    e.preventDefault();
    if(e.target.classList.contains('rotate') && e.target.classList.contains('submit-event')){
        newEvent.submit();
    } else if(e.target.classList.contains('rotate')) {
        hideShowEventsDiv();
    }
 });

//color the events on the calendar
function showEvents () {
    let days = document.getElementsByClassName('day');
    let events = [];
    [...eventData['events']].forEach((event)=>{
        [...days].forEach((day)=>{
            if(event['day']===day.innerHTML && event['month']===headerMonths.innerHTML && event['year']===headerYears.innerHTML){
                day.classList.add('active-event');
                events.push(event)
            } 
        });
    });
    return events;
}

//clears previous event Text
function clearEventText() {
    if(document.getElementsByClassName('event-desc')){
        [...document.getElementsByClassName('event-desc')].forEach((event)=>{
            event.outerHTML='';
        });
    }
}

//shows eventText
function showEventText(desc,month,year,day) {

    let noEvents = document.getElementsByClassName('no-Events')[0];
    let eventsDescContainer = document.querySelector('.events');

        //span element to put Event text into
        const span = document.createElement('span');
        let EventText = document.createTextNode(desc);;

        //clear previous events message
        noEvents.style.display='none';

        //append to container
        span.appendChild(EventText)
        span.classList.add('event-desc', 'event-message');
        eventsDescContainer.appendChild(span);


        //switch direction of events container to show event on top, button on bottom
        eventsDescContainer.style.flexDirection = 'column-reverse';
}

//compares eventData array values to date of day clicked on 
const checkEvents = (obj, date)=>{
    let isInArray = eventData['events'].find(event => event[obj]===date)
    return isInArray;
}

// //handler to show text from eventData array
document.addEventListener('click', (e)=> {
    let noEvents = document.getElementsByClassName('no-Events')[0];
    let eventsDescContainer = document.querySelector('.events');

    if(e.target.classList.contains('day')){
        //Clear previous event Text
        clearEventText();
        [...eventData['events']].forEach((event)=>{
            if(event['day']===e.target.innerHTML && event['month']===headerMonths.innerHTML && event['year']===headerYears.innerHTML){

                //show event Text
                showEventText(event['description'], event['month'], event['year'], event['day']);

            }  else if(!checkEvents('year',headerYears.innerHTML) || !checkEvents('month', headerMonths.innerHTML) || !checkEvents('day', e.target.innerHTML))  {
                clearEventText();
                noEvents.style.display='initial';
                noEvents.innerHTML = `There are no events on ${headerMonths.innerHTML} ${e.target.innerHTML} ${headerYears.innerHTML}`;

                //reverse flexDirection to original direction
                eventsDescContainer.style.flexDirection = 'column';
            }
        });
    }
});

 //adds json to eventData
function newEventJson(description, month, year, day){
    let event = {
        "description": description,
        "year": year,
        "month": month,
        "day": day
     };
     eventData.events.push(event);
 }

