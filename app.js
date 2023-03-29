function search(){
    //Filter numerical values
    var input = document.getElementById('search').value.toLowerCase();
    var r = /\d/;
    if(r.test(input)){
        alert("No numerical values please!");
    }

    fetch('./data.JSON')
    .then((response) => response.json())
    .then((json) => {

    });
}

//Add cards to display
function addCard(){
    console.log('ADDING CARD');
    document.getElementById("main").innerHTML = '';
    var ids = [1,2,3,4,5,6];
    fetch('./data.JSON')
    .then((response) => response.json())
    .then((json) => {
        var c = 1; //Current card object
        var p = 1; //Current pet object
        for(var i = 0; i < json["customers"].length; i++){
            var customer = json["customers"][i]
            if(!ids.includes(customer["Id"])){
                continue
            }
            console.log('ADDING ID: ' + customer["Id"]);

            var dob, color = 'N/A';
            try{
                dob = customer["DoB"];
            }catch{
                //No Birthday Present
            }
            try{
                color = customer["FavoriteColor"];
            }catch{
                //No Favorite Color Present
            }
            var out =
                `
                <span class="card" id=${c}>
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
                            <input type="radio" value="Name" name="type${c}" checked>
                            Name
                        </label>
                        <label>
                            <input type="radio" value="Type" name="type${c}">
                            Type
                        </label>
                        <label>
                            <input type="radio" value="Up" name="order${c}" checked>
                            Up
                        </label>
                        <label>
                            <input type="radio" value="Down" name="order${c}">
                            Down
                        </label>
                    </span>
                    <div class="petsection" id="ps${c}"></div>
                </span>
                `
            const div = document.getElementById('main');
            div.insertAdjacentHTML('beforeend', out);

            try{
                customer["Pets"].forEach(element => {
                    const pet = `
                        <div class="pet" id="p${p}">
                            <h2 class="petdata" style="display:inline;">${element["type"]}</h2>
                            <h3 class="petdata" style="display:inline;">${element["Name"]}</h3>
                        </div>
                    `;
                    document.getElementById("ps" + c).insertAdjacentHTML('beforeend', pet);
                    //Style Pets
                        document.getElementById(`p${p}`).style.cssText = `
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
            }
            catch{
                //No Pets
            }

            //Style Card
            document.getElementById(c).style.cssText = `
                height: 70%;
                width: min(350px, 20%);
                border-radius: 60px;
                margin: 0 20px;
                background-color: white;
            
                display: flex;
                flex-direction: column;
                align-items: center;
            `;

            //Style Pet Section
            document.getElementById("ps" + c).style.cssText = `
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
            c++
        }
    });
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