var search
var button = document.getElementById("button")

var search = document.getElementById("search")

var upcomingGames = document.getElementById("scores")

var subBut = document.getElementById("subButton")

var list = document.getElementById("list")
var keys = []

click();

getdata();
getList();
getWeather();
search.focus();









button.onclick = function () {
    var param = search.value

    if (param.indexOf('.com') > -1) {
        var link = "https://www." + param
        var newPage = window.open(link, '_blank');
        newPage.focus();
        search.value = "";

    } else {
        var link = "https://www.google.com/search?q=" + param
        var newPage = window.open(link, '_blank');
        newPage.focus();
        search.value = "";
    }
    // var link = "https://www.google.com/search?q=" + param
    // var newPage = window.open(link, '_blank');
    // newPage.focus();
    // search.value = "";


}



function click() {







}

//window.addEventListener('onkeyup', keysPressed)




search.addEventListener("keyup", function (event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Trigger the button element with a click
        button.click();
    }

    if (event.keyCode === 18) {

        search.value += ".com"
    }


});


subBut.addEventListener("click", function () {

    makeList();




})





function makeList() {
    var item = prompt("Add Item to List","Your Item")

    if (item != null) {
        var data = {
            "key": "key",
            "stuff": item
        }
        var arrStr = JSON.stringify(data)
        var request = new XMLHttpRequest
        request.open("POST", "/data", true)
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(arrStr);
        getList();
    }
}

function getList() {
    var req = new XMLHttpRequest;
    req.open("GET", "/respo");
    req.send();
    req.addEventListener('load', function () {
        var data = JSON.parse(this.response);
        //console.log(data)

        data.forEach(function (val) {
            var action = val.stuff
            //console.log(action)
            var ul = document.createElement("ul");
            li = document.createElement("li")
            li.appendChild(document.createTextNode(action));
            li.id = action
            ul.appendChild(li)
            list.appendChild(ul);

            uniqueLi = {};

            $("#list li").each(function () {
                var thisVal = $(this).text();
                if (!(thisVal in uniqueLi)) {
                    uniqueLi[thisVal] = "";
                } else {
                    $(this).remove();
                }
            })





            document.getElementById(action).addEventListener('click', function () {
                deleteThing(action)
            })
            document.getElementById(action).addEventListener('mouseover', function () {
                document.getElementById(action).style.color = "red";
            })

            document.getElementById(action).addEventListener('mouseout', function () {
                document.getElementById(action).style.color = "#343a40";
            })
        })
    })
}



function deleteThing(thing) {
    var myList = document.getElementById("list")
    var obj = document.getElementById(thing);
    myList.querySelectorAll('li').forEach(function (item) {
        obj.remove();
    });

    var raw = {
        "item": thing
    }
    var string = JSON.stringify(raw)

    var req = new XMLHttpRequest;
    req.open("POST", "/del")
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(string)
}



function getdata() {
    var newrequest = new XMLHttpRequest();
    newrequest.open("GET", "/nba");

    newrequest.send();
    newrequest.addEventListener('load', function () {
        var data = JSON.parse(this.response);
        data.pop();
        data.forEach(function (i) {
            var visitor = i.v;
            var home = i.h;
            var string = visitor + " at " + home


            var ul = document.createElement("ul");
            ul.appendChild(document.createTextNode(string));
            upcomingGames.appendChild(ul);


        })

    })
}



function getWeather() {

    var req = new XMLHttpRequest;
    req.open("GET", "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/8356d7d56bb059e612c30ba6c4b5885a/41.1414855,-73.3578955")
    req.send();


    req.addEventListener('load', function () {
        var data = JSON.parse(this.responseText);
        //console.log(data);
        var temp = "Temperature is " + data.currently.temperature;
        var sum = data.hourly.summary;
        var oSum = data.daily.summary;
        var feels = "Feels like " + data.currently.apparentTemperature



        var Tul = document.createElement("ul");
        Tul.appendChild(document.createTextNode(temp));
        wStats.appendChild(Tul);

        var Ful = document.createElement("ul");
        Ful.appendChild(document.createTextNode(feels));
        wStats.appendChild(Ful);

        var Sul = document.createElement("ul");
        Sul.appendChild(document.createTextNode(sum));
        wStats.appendChild(Sul);

        // var oSul = document.createElement("ul");
        // oSul.appendChild(document.createTextNode(oSum));
        // wStats.appendChild(oSul);



    })




}