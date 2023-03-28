function search(){
    var input = document.getElementById('search').value.toLowerCase();
    var r = /\d/;

    if(r.test(input)){
        alert("No numerical values please!");
    }
}

//Add cards to display
function addCard(){
    console.log('ADDING CARD');
    var ids = [1,2];
    fetch('./data.JSON')
    .then((response) => response.json())
    .then((json) => {
            var c = 1;
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
                        <img src="images/profile.png" alt="profilePic" style="height: 150px; width: 150px; margin-top: 50px;">
                        <h2 class="name" id="n1">
                            ${customer["Name"]}
                        </h2>
                        <h4 class="birthday" id="b1">
                            Birthday: ${dob}
                        </h4>
                        <h4 class="color" id="c1">
                            Favorite Color: ${color}
                        </h4>
                        <span>
                            <h3>Pets</h3>
                            <label>
                                <input type="radio" value="Name" name="type" checked>
                                Name
                            </label>
                            <label>
                                <input type="radio" value="Type" name="type">
                                Type
                            </label>
                            <label>
                                <input type="radio" value="Up" name="order" checked>
                                Up
                            </label>
                            <label>
                                <input type="radio" value="Down" name="order">
                                Down
                            </label>
                        </span>
                        <div class="petsection">
                            <div class="pet">
                                <h2 class="petdata" style="display:inline;">Name</h2>
                                <h3 class="petdata" style="display:inline;">Type</h3>
                            </div>
                            <div class="pet">
                                <h2 class="petdata" style="display:inline;">Name</h2>
                                <h3 class="petdata" style="display:inline;">Type</h3>
                            </div>
                            <div class="pet">
                                <h2 class="petdata" style="display:inline;">Name</h2>
                                <h3 class="petdata" style="display:inline;">Type</h3>
                            </div>
                        </div>
                    `
                /*var d = document.createElement('span')
                d.id = (c).toString();
                d.innerHTML = out;
                document.getElementById("main").appendChild(d);
                c++;
                console.log(d);*/

                const  div = document.getElementById('main');

                div.insertAdjacentHTML('afterbegin', out);
            }
        }
    );
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