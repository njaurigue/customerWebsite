function search(){
    fetch('./data.JSON')
    .then((response) => response.json())
    .then((json) => {
        //Filter numerical values
        var input = document.getElementById('search').value.toLowerCase();
        console.log(input);
        var r = /\d/;
        if(r.test(input)){
            alert("No numerical values please!");
        }
        if(input == ''){
            addCards("DEFAULT");
            return;
        }

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

//Add cards to display
function addCards(ids){
    if(ids == "DEFAULT"){
        ids = [1,2,3,4,5,6];
    }
    document.getElementById("main").innerHTML = '';
    fetch('./data.JSON')
    .then((response) => response.json())
    .then((json) => {
        //Sort Customers by Birthday
        json["customers"].sort(dateSort);

        //Add requested cards
        for(var i = 0; i < json["customers"].length; i++){
            var customer = json["customers"][i];
            var id = customer["Id"];
            if(!ids.includes(customer["Id"])){
                continue
            }

            try{
                var dob = customer["DoB"];
            }catch{
                //No Birthday Present
            }
            try{
                var color = customer["FavoriteColor"];
            }catch{
                //No Favorite Color Present
            }
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

            updatePets(customer["Id"]);

            //Style Card
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

            //Style Pet Section
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

function updatePets(id){
    document.getElementById("ps" + id).innerHTML = '';
    fetch('./data.JSON')
    .then((response) => response.json())
    .then((json) => {
        var plist;
        for(var i = 0; i < json["customers"].length; i++){
            if(json["customers"][i]["Id"] == id){
                try{
                    plist = json["customers"][i]["Pets"];
                }catch{
                    //No Pets
                    return;
                }
                break;
            }
        }
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
            const pet = `
                <div class="pet" id="p${id + p}">
                    <h2 class="petdata" style="display:inline;">${element["Name"]}</h2>
                    <h3 class="petdata" style="display:inline;">${element["type"]}</h3>
                </div>
            `;
            document.getElementById("ps" + id).insertAdjacentHTML('beforeend', pet);
            //Style Pets
            document.getElementById(`p${id + p}`).style.cssText = `
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