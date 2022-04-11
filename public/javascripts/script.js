function carteVanzareCheck () {
    if(document.getElementById('vanzare').checked){
        console.log("E checked vanzare!!!")
        document.getElementById('pret-box').style.display = "block";  
    } 
}

function carteSchimbCheck () {
    if(document.getElementById('schimb').checked){
         console.log("E checked schimb!!!")
         document.getElementById('pret-box').style.display = "none";
    } 
}

function accepta () {

    console.log("Accepta button was clicked");
    const comandaPath = window.location.pathname;
    console.log(comandaPath);
    const comandaId = comandaPath.substr(16);
    console.log(comandaId);
    
    fetch(`/comenzile-mele/${comandaId}`, {method: 'POST'})
        .then(function(response) {
            if(response.ok) {
                console.log('Accepta was recorded');
                // const element = document.createElement("p");
                // const text = document.createTextNode("Cererea a fost aceptată");
                // element.appendChild(text);
                // const buton = document.getElementById('acceptat');
                // buton.parentNode.insertBefore(element, buton);
                var buton = document.getElementById('acceptat');
                buton.classList.add('disabled')
                location.reload();
                return;
            }
            throw new Error('Request failed.');
        })
        .catch(function(error) {
            console.log(error);
        }); 
}

function confirmare () {

    console.log("Confirmare button was clicked");
    const comandaPath = window.location.pathname;
    console.log(comandaPath);
    const comandaId = comandaPath.substr(16);
    console.log(comandaId);
    
    fetch(`/comenzile-mele/${comandaId}/ccm`, {method: 'POST'})
        .then(function(response) {
            if(response.ok) {
                console.log('Confirmarea was recorded');
                var buton = document.getElementById('confirmare');
                buton.classList.add('disabled')
                location.reload();
                return;
            }
            throw new Error('Request failed.');
        })
        .catch(function(error) {
            console.log(error);
        }); 
}


// function cartiSchimbCheck (req, res, next) {
//     try{
//         if(document.getElementById('schimb').checked){
//             const toateCartile =  Book.find( {schimb_vanzare: "schimb"} );
//             res.render('carti', { title: 'Carti', toateCartile });
//         }
//     } catch(error) {
//         next(error);
//     }
// }