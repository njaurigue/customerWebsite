/**
 * search()
 * Searches JSON file for customers with pet names/types matching query
 * @return - None
 */
function search(){
    fetch('./data.JSON')
    .then((response) => response.json())
    .then((json) => {
        //Filter numerical values
        var input = document.getElementById('search').value.toLowerCase();
        var r = /\d/;

        //Run default search after invalid or empty queries
        if(r.test(input)){
            alert("No numerical values please!");
            addCards('DEFAULT');
        }
        if(input == ''){
            addCards("DEFAULT");
            return;
        }

        //Find customers with pets matching query
        var ids = [];
        for(var i = 0; i < json["customers"].length; i++){
            try{
                var pets = json["customers"][i]["Pets"];
                pets.forEach(element => {
                    if(element["type"].toLowerCase().includes(input) || element["Name"].toLowerCase().includes(input)){
                        ids.push(json["customers"][i]["Id"]);
                    }
                });
            }catch{
                continue;
            }
        }
        addCards(ids);
    });
}

/**
 * addCards(ids)
 * Displays specified cards of customer information (name, DoB, favorite color, pets)
 * @param ids - Array of customer IDs to be displayed
 * @return - None
 */
function addCards(ids){
    //DEFAULT - display all customers
    if(ids == "DEFAULT"){
        ids = [1,2,3,4,5,6];
    }
    document.getElementById("main").innerHTML = ''; //Clear page
    fetch('./data.JSON')
    .then((response) => response.json())
    .then((json) => {
        //Sort Customers by Birthday
        json["customers"].sort(dateSort);

        //Traverse only requested customers
        for(var i = 0; i < json["customers"].length; i++){
            var customer = json["customers"][i];
            var id = customer["Id"];
            if(!ids.includes(customer["Id"])){
                continue
            }

            //Check for data provided
            var dob = customer["DoB"];
            var color = customer["FavoriteColor"];
            if(dob == undefined){
                dob = 'N/A';
            }
            if(color == undefined){
                color = 'N/A';
            }

            //Build and append Card element
            var out =
                `
                <span class="card" id=${id}>
                    <img src="images/profile.png" alt="profilePic" style="height: 150px; width: 150px; margin-top: 50px;">
                    <h2 class="name" id="n1" style="margin-bottom: 5px;">
                        ${customer["Name"]}
                    </h2>
                    <h4 class="info" id="b1">
                        Birthday: ${dob}
                    </h4>
                    <h4 class="info" id="c1">
                        Favorite Color: ${color}
                    </h4>
                    <span>
                        <h3 style="margin-bottom: 5px;">Pets (Sort)</h3>
                        <label>
                            <input type="radio" value="Name" id="name${id}" name="type${id}" onclick="updatePets(${id})" checked>
                            Name
                        </label>
                        <label>
                            <input type="radio" value="Type" id="type${id}" name="type${id}" onclick="updatePets(${id})">
                            Type
                        </label>
                        <label>
                            <input type="radio" value="A-Z" id="az${id}" name="order${id}" onclick="updatePets(${id})" checked>
                            A-Z
                        </label>
                        <label>
                            <input type="radio" value="Z-A" id="za${id}" name="order${id}" onclick="updatePets(${id})">
                            Z-A
                        </label>
                    </span>
                    <div class="petsection" id="ps${id}"></div>
                </span>
                `
            const div = document.getElementById('main');
            div.insertAdjacentHTML('beforeend', out);

            //Style card element
            document.getElementById(id).style.cssText = `
                height: 70%;
                width: 350px;
                border-radius: 60px;
                margin: 0 20px;
                background-color: white;
            
                display: flex;
                flex-direction: column;
                align-items: center;
            `;

            //Update pet section
            updatePets(customer["Id"]);

            //Style pet section
            document.getElementById("ps" + id).style.cssText = `
                border-radius: 60px;
                height: 250px;
                width: 80%;
                margin-top: 5px;
                padding: 10px 30px;
                overflow-y: scroll;
                overflow-x: hidden;
            
                display: block;
                margin: auto;
            `;
        }
    });
}

/**
 * updatePets(id)
 * Updates pet section of specified customer based on sort type/direction.
 * @param id - Customer ID of pets to be sorted
 * @return - None
 */
function updatePets(id){
    document.getElementById("ps" + id).innerHTML = ''; //Clear page
    fetch('./data.JSON')
    .then((response) => response.json())
    .then((json) => {
        var plist;
        for(var i = 0; i < json["customers"].length; i++){

            //Check for pets
            if(json["customers"][i]["Id"] == id){
                try{
                    plist = json["customers"][i]["Pets"];
                }catch{
                    //No pets
                    return;
                }
                break;
            }
        }

        //Sort pet list
        if(document.getElementById("name" + id).checked){
            plist.sort(petSortName);
        }else{
            plist.sort(petSortType);
        }
        if(document.getElementById("az" + id).checked){
            plist.reverse();
        }

        var p = 1;
        plist.forEach(element => {
            //Build and append pet element
            const pet = `
                <div class="pet" id="p${id} + ${p}">
                    <h2 class="petdata" style="display:inline; margin: 0 5px;">${element["Name"]}</h2>
                    <h3 class="petdata" style="display:inline;">${element["type"]}</h3>
                </div>
            `;
            document.getElementById("ps" + id).insertAdjacentHTML('beforeend', pet);

            //Style pet element
            document.getElementById(`p${id} + ${p}`).style.cssText = `
                border: 2px solid #b4b4b4;
                border-radius: 30px;
                height: 60px;
                width: 100%;

                display: flex;
                align-items: center;
                justify-content: center;
                margin: 5px auto;
            `;
            p++;
        });
    });
}

/**
 * fillTable()
 * Fills table view with all customer information
 * @return - None
 */
function fillTable(){
    document.getElementById("table").innerHTML = ''; //Clear page
    fetch('./data.JSON')
    .then((response) => response.json())
    .then((json) => {
        //Sort Customers by Birthday
        json["customers"].sort(dateSort);

        var p = 0;
        for(var i = 0; i < json["customers"].length; i++){
            var customer = json["customers"][i];

            //Check for data provided
            var id = customer["Id"];
            var dob = customer["DoB"];
            var color = customer["FavoriteColor"];
            if(dob == undefined){
                dob = 'N/A';
            }
            if(color == undefined){
                color = 'N/A';
            }

            //Build and append card element
            var out = `
                <div class="card">
                    <div class="top">
                        <div class="photo">
                            <img src="images/profile.png" alt="profilePic" style="height: 90px; width: 90px;">
                        </div>
                        <div class="info">
                            <p style="font-size: 20px; margin: 0;">${customer["Name"]}</p>
                            <p style="font-size: 16px; margin: 0;">${dob}</p>
                            <p style="font-size: 16px; margin: 0;">${color}</p>
                        </div>
                    </div>
                    <div class="petsection" id="ps${id}"></div>
                </div>
            `
            const div = document.getElementById('table');
            div.insertAdjacentHTML('beforeend', out);            

            //Build and append pet elements (if provided)
            try{
                var plist = customer["Pets"];
                plist.forEach(element => {
                    const pet = `
                        <div class="pet" id="p${id} + ${p}">
                            <h2 class="petdata" style="display:inline; margin: 0 5px">${element['Name']}</h2>
                            <h3 class="petdata" style="display:inline; margin: 0 5px"></h3>${element['type']}</h3>
                        </div>
                    `
                    document.getElementById("ps" + id).insertAdjacentHTML('beforeend', pet);
                    
                    //Style Pets
                    document.getElementById(`p${id} + ${p}`).style.cssText = `
                        border: 2px solid #b4b4b4;
                        border-radius: 30px;
                        height: 40px;
                        width: 90%;
        
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 5px auto;
                    `;
                    p++;
                });
            }catch{
                //No Pets
            }
        }
    });
}

//Pet Name Sort Function (Descending)
function petSortType(a,b){
    if(a["type"] < b["type"]){
        return 1;
    }else if(a["type"] > b["type"]){
        return -1;
    }else{
        return 0;
    }}

//Pet Name Sort Function (Descending)
function petSortName(a,b){
    if(a["Name"] < b["Name"]){
        return 1;
    }else if(a["Name"] > b["Name"]){
        return -1;
    }else{
        return 0;
    }
}

//Birthday Sort Function (Descending)
function dateSort(a,b){
    var adob = a["DoB"];
    var bdob = b["DoB"];
    if(parseInt(adob.substring(adob.length - 4)) < parseInt(bdob.substring(bdob.length - 4))){
        return 1;
    }else if(parseInt(adob.substring(adob.length - 4)) > parseInt(bdob.substring(bdob.length - 4))){
        return -1;
    }else if(parseInt(adob.substring(adob.indexOf('/') + 1, adob.indexOf('/', adob.indexOf('/') + 1))) < parseInt(bdob.substring(bdob.indexOf('/') + 1, bdob.indexOf('/', bdob.indexOf('/') + 1)))){
        return 1;
    }else if(parseInt(adob.substring(adob.indexOf('/') + 1, adob.indexOf('/', adob.indexOf('/') + 1))) > parseInt(bdob.substring(bdob.indexOf('/') + 1, bdob.indexOf('/', bdob.indexOf('/') + 1)))){
        return -1;
    }else if(parseInt(adob.substring(adob.indexOf(0, adob.indexOf('/')))) < parseInt(bdob.substring(bdob.indexOf(0, bdob.indexOf('/'))))){
        return 1;
    }else if(parseInt(adob.substring(adob.indexOf(0, adob.indexOf('/')))) > parseInt(bdob.substring(bdob.indexOf(0, bdob.indexOf('/'))))){
        return -1;
    }else{
        return 0;
    }
}

//Scroll Behavior
/*var item = document.getElementById("main");

window.addEventListener("wheel", function (e) {
    console.log('printing');
    console.log(e.deltaY);
    if (e.deltaY > 0) {
        item.scrollLeft += 75;
    } else {
        item.scrollLeft -= 75;
    }
    console.log(item.scrollLeft);
});*/