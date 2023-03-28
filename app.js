function onload(){
    
}

function search(){
    var input = document.getElementById('search').value.toLowerCase();
    var r = /\d/;

    if(r.test(input)){
        alert("No numerical values please!");
    }
}