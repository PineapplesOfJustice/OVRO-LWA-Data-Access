/* Global Variables */

// For Mobile v. Desktop Features //
var mobileCutoff = 1000;
var isMobile = false;

// For Sun Carousel
var sunArray = {
    radio: [],
}
var loadAmount = 48;
var sunArrayBackup = {
    radio: [],
};

var sunArrayObjectLoaded = {
    radio: -1,
}

var sunObject = {
    radio: {
        carousel: document.getElementById("radioSunCarousel"),
        carouselFilter: document.getElementById("radioSunCarouselFilter"),
        carouselSlider: document.getElementById("radioSunCarouselSlider"),
        carouselSliderContainer: document.getElementById("radioSunCarouselSliderContainer"),
        carouselDate: document.getElementById("radioSunDate"),
        carouselWarningLabel: document.getElementById("radioSunWarningLabel"),
    },
};

// Predefined Values
var dayToMilliSec = 8.64 * Math.pow(10, 7);
var hourToMilliSec = 3.6 * Math.pow(10, 6);

var monthArray = [
    {
        name: "January",
        abbreviation: "Jan",
        day: 31,
    },
    {
        name: "February",
        abbreviation: "Feb",
        day: 28,
        setDay: function(year) {
            if (year % 4 == 0 && year % 100 == 0 && year % 400 == 0) {
                this.day = 29;
            }
            else {
                this.day = 28;
            }
        }
    },
    {
        name: "March",
        abbreviation: "Mar",
        day: 31,
    },
    {
        name: "April",
        abbreviation: "Apr",
        day: 30,
    },
    {
        name: "May",
        abbreviation: "May",
        day: 31,
    },
    {
        name: "June",
        abbreviation: "Jun",
        day: 30,
    },
    {
        name: "July",
        abbreviation: "Jul",
        day: 31,
    },
    {
        name: "August",
        abbreviation: "Aug",
        day: 31,
    },
    {
        name: "September",
        abbreviation: "Sep",
        day: 30,
    },
    {
        name: "October",
        abbreviation: "Oct",
        day: 31,
    },
    {
        name: "November",
        abbreviation: "Nov",
        day: 30,
    },
    {
        name: "December",
        abbreviation: "Dec",
        day: 31,
    },];

var input = {
    toYear: document.getElementById("toYearInput"),
    toMonth: document.getElementById("toMonthInput"),
    toDay: document.getElementById("toDayInput"),
    toHour: document.getElementById("toHourInput"),
    toMinute: document.getElementById("toMinuteInput"),
    fromYear: document.getElementById("fromYearInput"),
    fromMonth: document.getElementById("fromMonthInput"),
    fromDay: document.getElementById("fromDayInput"),
    fromHour: document.getElementById("fromHourInput"),
    fromMinute: document.getElementById("fromMinuteInput"),
    stepAmount: document.getElementById("stepAmountInput"),
    stepType: document.getElementById("stepTypeInput"),
    submitUpdate: document.getElementById("submitUpdateButton"),
    abortUpdate: document.getElementById("abortUpdateButton"),
}

var firstDataEntry = {
    year: 2019,
    month: 6,
    day: 2,
    hour: 14,
    minute: 0,
}

/* Initiate Website */

initiateWebsite();
function initiateWebsite() {    
    var currentDate = new Date();
    var formattedToDate = formatDate(currentDate);
    input.toYear.value = formattedToDate.year;
    input.toMonth.value = formattedToDate.month + 1;
    input.toDay.value = formattedToDate.day;
    input.toHour.value = formattedToDate.hour;
    input.toMinute.value = 0;
    var formattedFromDate = formatDate(currentDate - loadAmount*hourToMilliSec);
    input.fromYear.value = formattedFromDate.year;
    input.fromMonth.value = formattedFromDate.month + 1;
    input.fromDay.value = formattedFromDate.day;
    input.fromHour.value = formattedFromDate.hour;
    input.fromMinute.value = 0;
    
    for (var type in sunObject) {
        var currentCarousel = sunObject[type].carousel;
        var currentCarouselDate = sunObject[type].carouselDate;
        var currentSunArray = sunArray[type];
        
        var url = "Assets/Images/Visual Sun Placeholder/" + capitalize(type) + ".jpg";
        var timeStamp = formattedToDate.year + "-" + returnTwoDigits(formattedToDate.month+1) + "-" + returnTwoDigits(formattedToDate.day) + " " + returnTwoDigits(formattedToDate.hour) + ":00:00 UTC";
        currentSunArray.push({
            src: url,
            date: timeStamp,
        });
        
        currentCarousel.setAttribute("src", url);
        currentCarouselDate.innerHTML = timeStamp;
    }
    
    /*for (var type in sunObject) {
        var currentSunArray = sunArray[type];
        var currentCarouselFilter = sunObject[type].carouselFilter;
        var currentCarouselSlider = sunObject[type].carouselSlider;
        var currentCarouselDate = sunObject[type].carouselDate;
        
        var currentDate = new Date();
        var formattedDate = formatDate(currentDate);
        
        for (var repeat = 0; repeat < loadAmount; repeat++) {
            currentSunArray.push(dateToSunArrayObject(formattedDate, type));
            formattedDate = subtractTime(1, "hour", formattedDate);
        }
        currentCarouselSlider.max = loadAmount;
        currentCarouselSlider.value = loadAmount;

        currentCarouselFilter.setAttribute("src", currentSunArray[0].src);
        currentCarouselDate.innerHTML = currentSunArray[0].date;
    }*/
    
    isMobile = false;
    if(window.innerWidth <= mobileCutoff || document.body.clientWidth <= mobileCutoff) {
        isMobile = true;
    }
    
    console.clear();
    console.log("Welcome to the Console!\nEnjoy your stay here\nand dont't break the Code!");
}


/* Input Functions */

function limitInput(elementId, max) {
    input[elementId].value = parseInt(Number(input[elementId].value));
    var currentInputValue = input[elementId].value;
    /*if(currentInputValue.slice(-1) == "." || currentInputValue.slice(-1) == "e" || isNaN(currentInputValue.slice(-1))) {
        input[elementId].value = currentInputValue.slice(0, currentInputValue.length-2);
        currentInputValue = input[elementId].value;
    }*/
    if(currentInputValue.length > max) {
        input[elementId].value = currentInputValue.trim().substr(0, max-1) + currentInputValue.trim().slice(-1);
    }
}

function updateCarouselArrays() {
    // Check the inputs for valid dates
    var toYearValue = input.toYear.value;
    var toMonthValue = input.toMonth.value - 1;
    var toDayValue = input.toDay.value;
    var toHourValue = input.toHour.value;
    var toMinuteValue = input.toMinute.value;
    var fromYearValue = input.fromYear.value;
    var fromMonthValue = input.fromMonth.value - 1;
    var fromDayValue = input.fromDay.value;
    var fromHourValue = input.fromHour.value;
    var fromMinuteValue = input.fromMinute.value;
    
    var stepAmount = Math.floor(Math.abs(input.stepAmount.value));
    if(stepAmount < 1) {
        stepAmount = 1;
        input.stepAmount.value = 1;
    }
    var stepType = input.stepType.options[input.stepType.selectedIndex].value;
    
    // Fix any 0 inputs
    var toDate = new Date(Date.UTC(toYearValue, toMonthValue, toDayValue, toHourValue, toMinuteValue));
    var formattedToDate = formatDate(toDate);
    var fromDate = new Date(Date.UTC(fromYearValue, fromMonthValue, fromDayValue, fromHourValue, fromMinuteValue));
    var formattedFromDate = formatDate(fromDate);
    toYearValue = formattedToDate.year;
    toMonthValue = formattedToDate.month;
    toDayValue = formattedToDate.day;
    toHourValue = formattedToDate.hour;
    toMinuteValue = formattedToDate.minute;
    fromYearValue = formattedFromDate.year;
    fromMonthValue = formattedFromDate.month;
    fromDayValue = formattedFromDate.day;
    fromHourValue = formattedFromDate.hour;
    fromMinuteValue = formattedFromDate.minute;
    
    // Cap the maximum input based on current date
    var currentDate = new Date();
    var formattedDate = formatDate(currentDate);
    
    if(toYearValue > formattedDate.year) {
        toYearValue = formattedDate.year;
        toMonthValue = formattedDate.month;
        toDayValue = formattedDate.day;
        toHourValue = formattedDate.hour;
        toMinuteValue = 0;
    }
    else if(toYearValue == formattedDate.year && toMonthValue > formattedDate.month) {
        toMonthValue = formattedDate.month;
        toDayValue = formattedDate.day;
        toHourValue = formattedDate.hour;
        toMinuteValue = 0;
    }
    else if(toYearValue == formattedDate.year && toMonthValue == formattedDate.month && toDayValue > formattedDate.day) {
        toDayValue = formattedDate.day;
        toHourValue = formattedDate.hour;
        toMinuteValue = 0;
    }
    else if(toYearValue == formattedDate.year && toMonthValue == formattedDate.month && toDayValue == formattedDate.day && toHourValue > formattedDate.hour) {
        toHourValue = formattedDate.hour;
        toMinuteValue = 0;
    }
    else if(toYearValue == formattedDate.year && toMonthValue == formattedDate.month && toDayValue == formattedDate.day && toHourValue == formattedDate.hour && toMinuteValue > formattedDate.minute) {
        toMinuteValue = formattedDate.minute;
    }
    
    // Cap the minimum input based on firstDataInput
    if(toYearValue < firstDataEntry.year) {
        toYearValue = firstDataEntry.year;
        toMonthValue = firstDataEntry.month;
        toDayValue = firstDataEntry.day + 1;
        toHourValue = firstDataEntry.hour;
        toMinuteValue = 0;
    }
    else if(toYearValue == firstDataEntry.year && toMonthValue < firstDataEntry.month) {
        toMonthValue = firstDataEntry.month;
        toDayValue = firstDataEntry.day + 1;
        toHourValue = firstDataEntry.hour;
        toMinuteValue = 0;
    }
    else if(toYearValue == firstDataEntry.year && toMonthValue == firstDataEntry.month && toDayValue < firstDataEntry.day) {
        toDayValue = firstDataEntry.day + 1;
        toHourValue = firstDataEntry.hour;
        toMinuteValue = 0;
    }
    else if(toYearValue == firstDataEntry.year && toMonthValue == firstDataEntry.month && toDayValue == firstDataEntry.day && toHourValue < firstDataEntry.hour) {
        toHourValue = firstDataEntry.hour + 1;
        toMinuteValue = 0;
    }
    else if(toYearValue == firstDataEntry.year && toMonthValue == firstDataEntry.month && toDayValue == firstDataEntry.day && toHourValue == firstDataEntry.hour && toMinuteValue == firstDataEntry.minute) {
        toHourValue = firstDataEntry.hour + 1;
        toMinuteValue = 0;
    }
    
    // Make sure that the fromTime (start time) is less than the toTime (end time)
    if(toYearValue < fromYearValue) {
        fromYearValue = toYearValue;
        fromMonthValue = toMonthValue;
        fromDayValue = toDayValue - 1;
        fromHourValue = 0;
        fromMinuteValue = 0;
    }
    else if(toYearValue == fromYearValue && toMonthValue < fromMonthValue) {
        fromMonthValue = toMonthValue;
        fromDayValue = toDayValue - 1;
        fromHourValue = 0;
        fromMinuteValue = 0;
    }
    else if(toYearValue == fromYearValue && toMonthValue == fromMonthValue && toDayValue < fromDayValue) {
        fromDayValue = toDayValue - 1;
        fromHourValue = 0;
        fromMinuteValue = 0;
    }
    else if(toYearValue == fromYearValue && toMonthValue == fromMonthValue && toDayValue == fromDayValue && toHourValue < fromHourValue) {
        fromHourValue = toHourValue - 1;
        fromMinuteValue = 0;
    }
    else if(toYearValue == fromYearValue && toMonthValue == fromMonthValue && toDayValue == fromDayValue && toHourValue == fromHourValue && toMinuteValue < fromMinuteValue) {
        fromHourValue = toHourValue - 1;
        fromMinuteValue = 0;
    }
    
    // Cap the minimum input based on the firstDataEntry
    if(fromYearValue < firstDataEntry.year) {
        fromYearValue = firstDataEntry.year;
        fromMonthValue = firstDataEntry.month;
        fromDayValue = firstDataEntry.day;
        fromHourValue = firstDataEntry.hour;
        fromMinuteValue = 0;
    }
    else if(fromYearValue == firstDataEntry.year && fromMonthValue < firstDataEntry.month) {
        fromMonthValue = firstDataEntry.month;
        fromDayValue = firstDataEntry.day;
        fromHourValue = firstDataEntry.hour;
        fromMinuteValue = 0;
    }
    else if(fromYearValue == firstDataEntry.year && fromMonthValue == firstDataEntry.month && fromDayValue < firstDataEntry.day) {
        fromDayValue = firstDataEntry.day;
        fromHourValue = firstDataEntry.hour;
        fromMinuteValue = 0;
    }
    else if(fromYearValue == firstDataEntry.year && fromMonthValue == firstDataEntry.month && fromDayValue == firstDataEntry.day && fromHourValue < firstDataEntry.hour) {
        fromHourValue = firstDataEntry.hour;
        fromMinuteValue = 0;
    }
    else if(fromYearValue == firstDataEntry.year && fromMonthValue == firstDataEntry.month && fromDayValue == firstDataEntry.day && fromHourValue == firstDataEntry.hour && fromMinuteValue < firstDataEntry.minute) {
        fromMinuteValue = firstDataEntry.minute;
    }
    
    // Update input boxes
    toDate = new Date(Date.UTC(toYearValue, toMonthValue, toDayValue, toHourValue, toMinuteValue));
    formattedToDate = formatDate(toDate);
    formattedToDate = subtractTime(0, "hour", formattedToDate);
    fromDate = new Date(Date.UTC(fromYearValue, fromMonthValue, fromDayValue, fromHourValue, fromMinuteValue));
    formattedFromDate = formatDate(fromDate);
    formattedFromDate = subtractTime(0, "hour", formattedFromDate);
    
    input.toYear.value = formattedToDate.year;
    input.toMonth.value = formattedToDate.month + 1;
    input.toDay.value = formattedToDate.day;
    input.toHour.value = formattedToDate.hour;
    input.toMinute.value = formattedToDate.minute;
    input.fromYear.value = formattedFromDate.year;
    input.fromMonth.value = formattedFromDate.month + 1;
    input.fromDay.value = formattedFromDate.day;
    input.fromMinute.value = formattedFromDate.minute;

    
    // Set load amount
    
    //loadAmount = Math.ceil((toDate-fromDate)/hourToMilliSec) + 1;

    loadAmount = 1;
    var presentDate = getShallowCopyOfObject(formattedToDate);
    var presentTime = new Date(Date.UTC(presentDate.year, presentDate.month, presentDate.day, presentDate.hour, presentDate.minute)).getTime();
    var targetDate = getShallowCopyOfObject(formattedFromDate);
    var targetTime = new Date(Date.UTC(targetDate.year, targetDate.month, targetDate.day, targetDate.hour, targetDate.minute)).getTime();

    while(presentTime > targetTime) {
        presentDate = subtractTime(stepAmount, stepType, presentDate);
        presentTime = new Date(Date.UTC(presentDate.year, presentDate.month, presentDate.day, presentDate.hour, presentDate.minute)).getTime();
        loadAmount += 1;
    }
    
    // initiate update
    for (var type in sunObject) {
        sunArrayObjectLoaded[type] = -1;
        sunArrayBackup[type] = sunArray[type];
        sunArray[type] = [];
        var currentSunArray = sunArray[type];
        var currentCarousel = sunObject[type].carousel;
        var currentCarouselFilter = sunObject[type].carouselFilter;
        var currentCarouselSlider = sunObject[type].carouselSlider;
        var currentCarouselDate = sunObject[type].carouselDate;
        
        var formattedDate = getShallowCopyOfObject(formattedToDate);

        currentCarousel.setAttribute("onclick", null);
        currentCarousel.setAttribute("onmouseout", null);
        currentCarouselSlider.setAttribute("oninput", null);

        currentCarousel.setAttribute("style", "pointer-events: none");
        currentCarouselSlider.setAttribute("style", "pointer-events: none");
        
        for (var repeat = 0; repeat < loadAmount; repeat++) {
            currentSunArray.push(dateToSunArrayObject(formattedDate, type));
            formattedDate = subtractTime(stepAmount, stepType, formattedDate);
        }
    }
        
    var currentCarouselWarningLabel = sunObject[type].carouselWarningLabel;
    if(currentCarouselWarningLabel.style.pointerEvents == "none") {
        for (var type in sunObject) {
            var currentSunArray = sunArray[type];
            var currentCarouselFilter = sunObject[type].carouselFilter;
            var currentCarouselSlider = sunObject[type].carouselSlider;
            var currentCarouselDate = sunObject[type].carouselDate;
            
            currentCarouselSlider.max = loadAmount;
            currentCarouselSlider.value = loadAmount;
            currentCarouselFilter.setAttribute("src", currentSunArray[0].src);
            currentCarouselDate.innerHTML = currentSunArray[0].date;
        }
    }
    else{
        setTimeout(function() {
            for (var type in sunObject) {
                var currentSunArray = sunArray[type];
                var currentCarouselFilter = sunObject[type].carouselFilter;
                var currentCarouselSlider = sunObject[type].carouselSlider;
                var currentCarouselDate = sunObject[type].carouselDate;

                currentCarouselSlider.max = loadAmount;
                currentCarouselSlider.value = loadAmount;
                currentCarouselFilter.setAttribute("src", currentSunArray[0].src);
                currentCarouselDate.innerHTML = currentSunArray[0].date;
            }
        }, 1000);
        currentCarouselWarningLabel.setAttribute("style", "-webkit-transform: translate(-50%, -50%) scale(0) rotate(720deg); transform: translate(-50%, -50%) scale(0) rotate(720deg); pointer-events: none;");
    }
    
    
    // allow abort button
    var submitUpdateButton = input.submitUpdate;
    var abortUpdateButton = input.abortUpdate;
    abortUpdateButton.style.left = "0%";
    abortUpdateButton.style.opacity = "1";
    abortUpdateButton.style.pointerEvents = "auto";
}

function cancelCarouselArraysUpdate() {
    for(var type in sunObject) {
        var currentCarouselFilter = sunObject[type].carouselFilter;
        var functionParameter = "('" + type + "')";

        currentCarouselFilter.setAttribute("onerror", "cancelUpdate" + functionParameter);
        currentCarouselFilter.setAttribute("onload", "cancelUpdate" + functionParameter);
    }
    
    var submitUpdateButton = input.submitUpdate;
    var abortUpdateButton = input.abortUpdate;
    abortUpdateButton.style.left = "25%";
    abortUpdateButton.style.opacity = "0";
    abortUpdateButton.style.pointerEvents = "none";
}


/* Re-Position Carousel Slider */ 

window.onresize = function() {
    for(var type in sunObject) {
        var currentCarousel = sunObject[type].carousel;
        var currentCarouselSliderContainer = sunObject[type].carouselSliderContainer;
        
        var offsetX = currentCarousel.offsetLeft - currentCarouselSliderContainer.offsetLeft - 10;
        var offsetY = currentCarousel.offsetTop - currentCarouselSliderContainer.offsetTop;
        var carouselSize = currentCarousel.offsetWidth;
        var sliderSize = 200;
        //currentCarouselSliderContainer.style.transform = "translate(" + (offsetX) + "px, " + (offsetY+carouselSize/2-sliderSize/2) + "px";
        currentCarouselSliderContainer.setAttribute("style", "-webkit-transform: translate(" + (offsetX) + "px, " + (offsetY+carouselSize/2-sliderSize/2) + "px); transform: translate(" + (offsetX) + "px, " + (offsetY+carouselSize/2-sliderSize/2) + "px);");
    }
           
    isMobile = false;
    if(window.innerWidth <= mobileCutoff || document.body.clientWidth <= mobileCutoff) {
        isMobile = true;
    }
}


/* Carousel Filter Events */

function filterCarousel(type) {
    var currentCarouselFilter = sunObject[type].carouselFilter;
    var currentCarouselSlider = sunObject[type].carouselSlider;
    var currentCarouselDate = sunObject[type].carouselDate;
    
    var currentSunArray = sunArray[type];
    var currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;
    
    currentSunArray.splice(currentSunArrayIndex, 1);
    
    while (currentCarouselSlider.max > currentSunArray.length-1) {
        currentCarouselSlider.max -= 1;
        if(currentSunArrayIndex != 0) {
            currentCarouselSlider.value -= 1;
        }
    }
    if (currentCarouselSlider.value < 0) {
        currentCarouselSlider.value = 0;
    }
    currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;
    
    if(currentSunArray.length > 0) {
        currentCarouselFilter.setAttribute("src", currentSunArray[currentSunArrayIndex].src);
        currentCarouselDate.innerHTML = currentSunArray[currentSunArrayIndex].date;    
    }
    else {
        cancelUpdate(type);
    }
}

function continueCarouselFilter(type) {
    var currentCarousel = sunObject[type].carousel;
    var currentCarouselFilter = sunObject[type].carouselFilter;
    var currentCarouselSlider = sunObject[type].carouselSlider;
    var currentCarouselDate = sunObject[type].carouselDate;
    
    var currentSunArray = sunArray[type];
    var currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;
    
    sunArrayObjectLoaded[type] += 1;
    var currentSunArrayObjectLoaded = sunArrayObjectLoaded[type]; 
    
    if(currentSunArrayObjectLoaded < loadAmount && currentSunArray.length > currentSunArrayObjectLoaded+2) {
        currentCarousel.setAttribute("src", currentSunArray[currentSunArrayIndex].src);
        currentCarouselDate.innerHTML = currentSunArray[currentSunArrayIndex].date;
        currentCarouselSlider.value -= 1;
        currentSunArrayIndex += 1;
        currentCarouselFilter.setAttribute("src", currentSunArray[currentSunArrayIndex].src);
    }
    else {
        var functionParameter = "('" + type + "')";
        
        currentCarouselSlider.value = currentCarouselSlider.max;
        currentCarousel.setAttribute("src", currentSunArray[0].src);
        currentCarouselDate.innerHTML = currentSunArray[0].date;
        
        currentCarousel.setAttribute("onclick", "enterForcedSliderFocus" + functionParameter);
        currentCarousel.setAttribute("onmouseout", "exitForcedSliderFocus" + functionParameter);
        currentCarouselSlider.setAttribute("oninput", "updateCarousel" + functionParameter);
        
        currentCarousel.setAttribute("style", "pointer-events: auto");
        currentCarouselSlider.setAttribute("style", "pointer-events: auto");
    
        var submitUpdateButton = input.submitUpdate;
        var abortUpdateButton = input.abortUpdate;
        abortUpdateButton.style.left = "25%";
        abortUpdateButton.style.opacity = "0";
        abortUpdateButton.style.pointerEvents = "none";
        
        console.clear();
        console.log("Welcome to the Console!\nEnjoy your stay here\nand dont't break the Code!");
    }
}

function cancelUpdate(type) {
    var currentCarousel = sunObject[type].carousel;
    var currentCarouselFilter = sunObject[type].carouselFilter;
    var currentCarouselSlider = sunObject[type].carouselSlider;
    var currentCarouselDate = sunObject[type].carouselDate;
    var currentSunArray = sunArray[type];
    var currentSunArrayBackup = sunArrayBackup[type];
    var currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;

    currentSunArray.splice(currentSunArrayIndex);

    if(currentSunArray.length < currentSunArrayBackup.length) {
        sunArray[type] = currentSunArrayBackup;
        currentSunArray = sunArray[type];
    }
    currentCarouselSlider.max = currentSunArray.length - 1;

    var functionParameter = "('" + type + "')";

    currentCarouselSlider.value = currentCarouselSlider.max;
    currentCarousel.setAttribute("src", currentSunArray[0].src);
    currentCarouselDate.innerHTML = currentSunArray[0].date;

    currentCarouselFilter.setAttribute("onerror", "filterCarousel" + functionParameter);
    currentCarouselFilter.setAttribute("onload", "continueCarouselFilter" + functionParameter);

    currentCarousel.setAttribute("onclick", "enterForcedSliderFocus" + functionParameter);
    currentCarousel.setAttribute("onmouseout", "exitForcedSliderFocus" + functionParameter);
    currentCarouselSlider.setAttribute("oninput", "updateCarousel" + functionParameter);

    currentCarousel.setAttribute("style", "pointer-events: auto");
    currentCarouselSlider.setAttribute("style", "pointer-events: auto");
    
    var submitUpdateButton = input.submitUpdate;
    var abortUpdateButton = input.abortUpdate;
    abortUpdateButton.style.left = "25%";
    abortUpdateButton.style.opacity = "0";
    abortUpdateButton.style.pointerEvents = "none";

    console.clear();
    console.log("Welcome to the Console!\nEnjoy your stay here\nand dont't break the Code!");
}


/* Carousel Events */

function reportImage(type) {
    var currentCarousel = sunObject[type].carousel;
    var currentCarouselSlider = sunObject[type].carouselSlider;
    var currentCarouselDate = sunObject[type].carouselDate;
    
    var currentSunArray = sunArray[type];
    var currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;
    
    currentSunArray.splice(currentSunArrayIndex, 1);
    
    while (currentCarouselSlider.max > currentSunArray.length-1) {
        currentCarouselSlider.max -= 1;
        if(currentSunArrayIndex != 0) {
            currentCarouselSlider.value -= 1;
        }
    }
    if (currentCarouselSlider.value < 0) {
        currentCarouselSlider.value = 0;
    }
    currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;
    
    currentCarousel.setAttribute("src", currentSunArray[currentSunArrayIndex].src);
    currentCarouselDate.innerHTML = currentSunArray[currentSunArrayIndex].date;    
}

function relocateCarouselSlider(type) {
    var currentCarousel = sunObject[type].carousel;
    var currentCarouselSliderContainer = sunObject[type].carouselSliderContainer;

    var offsetX = currentCarousel.offsetLeft - currentCarouselSliderContainer.offsetLeft - 10;
    var offsetY = currentCarousel.offsetTop - currentCarouselSliderContainer.offsetTop;
    var carouselSize = currentCarousel.offsetWidth;
    var sliderSize = 200;
    //currentCarouselSliderContainer.style.transform = "translate(" + (offsetX) + "px, " + (offsetY+carouselSize/2-sliderSize/2) + "px)";
    currentCarouselSliderContainer.setAttribute("style", "-webkit-transform: translate(" + (offsetX) + "px, " + (offsetY+carouselSize/2-sliderSize/2) + "px); transform: translate(" + (offsetX) + "px, " + (offsetY+carouselSize/2-sliderSize/2) + "px);");

   currentCarousel.setAttribute("onload", null);
}

function updateCarousel(type) {
    var currentCarousel = sunObject[type].carousel;
    var currentCarouselSlider = sunObject[type].carouselSlider;
    var currentCarouselDate = sunObject[type].carouselDate;
    
    var currentSunArray = sunArray[type];
    var currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;
    
    currentCarousel.setAttribute("src", sunArray[type][currentSunArrayIndex].src);
    currentCarouselDate.innerHTML = sunArray[type][currentSunArrayIndex].date;
}

function enterForcedSliderFocus(type) {
    if(!isMobile) {
        var currentCarouselSlider = sunObject[type].carouselSlider;
        currentCarouselSlider.focus();
        currentCarouselSlider.style.opacity = 1;
    }
}

function exitForcedSliderFocus(type) {
    var currentCarouselSlider = sunObject[type].carouselSlider;
    currentCarouselSlider.style.opacity = 0.7;
    currentCarouselSlider.blur();
}


/* Support Functions */

function dateToSunArrayObject(date, type) {
    if(type == "visible") {
        var url = "https://soho.nascom.nasa.gov/data/REPROCESSING/Completed/" + date.year + "/c2/" + date.year + "" + returnTwoDigits(date.month+1) + "" + returnTwoDigits(date.day) + "/" + date.year + "" + returnTwoDigits(date.month+1) + "" + returnTwoDigits(date.day) + "_" + returnTwoDigits(date.hour) + returnTwoDigits(date.minute) + "_c2_512.jpg";
    }
    else if(type == "radio") {
        var url = "http://www.tauceti.caltech.edu/marinanderson/solar/hourly/" + date.year + "-" + returnTwoDigits(date.month+1) + "-" + returnTwoDigits(date.day) + "-" + returnTwoDigits(date.hour) + ":" + returnTwoDigits(date.minute) + ":00-image.jpg";
    }
        
    var timeStamp = date.year + "-" + returnTwoDigits(date.month+1) + "-" + returnTwoDigits(date.day) + " " + returnTwoDigits(date.hour) + ":" + returnTwoDigits(date.minute) + ":00 UTC";
    return {
        src: url,
        date: timeStamp,
    };
}

function formatDate(date) {
    var givenDate = new Date(date);
    
    var day = givenDate.getUTCDate();
    var month = givenDate.getUTCMonth();
    var year = givenDate.getUTCFullYear();
    var hour = givenDate.getUTCHours();
    var minute = givenDate.getUTCMinutes();
    
    monthArray[1].setDay(year);
    return {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
    };
}

function subtractTime(amount, type, object) {
    var data = getShallowCopyOfObject(object);
    data[type] -= amount;
    while (data.minute < 0) {
        data.hour -= 1;
        data.minute += 60;
    }
    while (data.hour < 0) {
        data.day -= 1;
        data.hour += 24;
    }
    while (data.day < 1) {
        data.month -= 1;
        if (data.month == 1) {
            monthArray[1].setDay(data.year);
        }
        else if (data.month == -1) {
            data.year -= 1;
            data.month += 12;
        }
        data.day += monthArray[data.month].day;
    }
    while (data.month < 0) {
        data.year -= 1;
        data.month += 12;
    }
    return data;
}

function addTime(amount, type, object) {
    var data = getShallowCopyOfObject(object);
    data[type] += amount;
    while (data.hour > 59) {
        data.minute -= 59;
        data.hour += 1;
    }
    while (data.hour > 23) {
        data.hour -= 24;
        data.day += 1;
    }
    while (data.day > monthArray[data.month].day) {
        data.day -= monthArray[data.month].day;
        data.month += 1;
        if (data.month == 1) {
            monthArray[1].setDay(data.year);
        }
        else if (data.month > 11) {
            data.month -= 12;
            data.year += 1;
        }
    }
    while (data.month > 11) {
        data.month -= 12;
        data.year += 1;
    }
    return data;
}

function getMilliSecToNextHour() {
    var currentHour = new Date();
    var nextHour = Math.ceil(currentHour / hourToMilliSec) * hourToMilliSec;
    return (nextHour - currentHour);
}

function returnTwoDigits(number) {
    if (number < 10) {
        return ("0" + number);
    }
    else if (number > 99) {
        return String(number).substr(-2);
    }
    else{
        return number;
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getShallowCopyOfObject(source) {
    return Object.assign({}, source);
}

function getOffset(element) {
    var rect = element.getBoundingClientRect();
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { 
        top: rect.top + scrollTop, 
        left: rect.left + scrollLeft,
    };
}
