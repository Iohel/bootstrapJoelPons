let obj;
function addUser(db){
    
    let email = document.querySelector('#email');
    let username = document.querySelector('#username');
    let password = document.querySelector('#password');
    let image_name = document.querySelector('input[name="image"]:checked');
    let administrador = document.querySelector('.checkbox input:checked');
    let administradorValue;
    
    if(administrador != null) {
        administradorValue = '1';
    }else{
        administradorValue = '0';
    }
    console.log(encodePassword(password.value));
    obj = { email: email.value, username: username.value, password: encodePassword(password.value), image_name: image_name.value, administrador: administradorValue};
    //let obj = { email: email, username: username, password: password};
    var tx = db.transaction(DB_GENERAL_STORE_NAME, "readwrite");
    var store = tx.objectStore(DB_GENERAL_STORE_NAME);
    //DB_LOGGED_STORE_NAMEobj
    try {
        // Inserts data in our ObjectStore
        req = store.add(obj);
        
    } catch (e) {
        console.log("Catch");
    }
    req.onsuccess = function (e) {
        console.log("addUser: Data insertion successfully done. Id: "
        + e.target.result);
        // Operations we want to do after inserting data
        openCreateDb(addLoggedEntry);
        
       
        
    };
    req.onerror = function(e) {
        console.error("addUser: error creating data", this.error);
    };
    //After transaction is completed we close de database
    tx.oncomplete = function() {
        console.log("addUser: transaction completed");
        db.close();
        opened = false;
    };
}
function addLoggedEntry(db){
    
    var tx = db.transaction(DB_LOGGED_STORE_NAME, "readwrite");
    var store = tx.objectStore(DB_LOGGED_STORE_NAME);

    try {
        // Inserts data in our ObjectStore
        req = store.add(obj);
        
    } catch (e) {
        console.log("Catch");
    }
    req.onsuccess = function (e) {
        console.log("addUser: Data insertion successfully done. Id: "
        + e.target.result);
        // Operations we want to do after inserting data
        console.log(obj["administrador"]);
        if(obj.administrador === '0'){
            /* setTimeout("",10000); */
            location.href = './index.html';
        }else{
            location.href = './administrator.html';
        }
       
        
    };
    req.onerror = function(e) {
        console.error("addUser: error creating data", this.error);
    };
    //After transaction is completed we close de database
    tx.oncomplete = function() {
        console.log("addUser: transaction completed");
        db.close();
        opened = false;
    };
}

function encodePassword(e) {
    
    let hash = CryptoJS.AES.encrypt(e,key).toString();
    console.log('encript');
    console.log(hash);
    return hash;

   
}
function decryptPassword(e) {
    
    let hash = CryptoJS.AES.decrypt(e,key).toString();
    console.log('encript');
    console.log(hash);
    return hash;

   
}

//Form Checker
const form = document.querySelector('form');
let email = document.querySelector('#email');
let username = document.querySelector('#username');
let password = document.querySelector('#password');
let password2 = document.querySelector('#password2');
let images = document.querySelectorAll('input[name="image"]');
function esObligatori(inputArray) {
    let t = 0;
    inputArray.forEach((input) => { 
        if(input.value.trim() === ''){
            mostraError(input, 'es obligatori.');
            
        }else{
            mostraCorrecte(input);
            t++;
        }
    });
    if(t == inputArray.length){
        return true;
    }else{
        return false;
    }
    
}

function esEmailValid(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(email.value.trim())){
        mostraCorrecte(email);
        return true;
    }else{
        mostraError(email,'email no valido');
        return false;
    }
}
function imatgeSeleccionada(input) {
    let control = "e";
    input.forEach((e) => {
        
        if(e.checked){
            mostraCorrecte(e);
            control = 't';
        }else if(control == 'e'){
            mostraError(e,'Selecciona imatge.')
        }
        
    });
    if(!(control == 'e')){
        return true
    }else{
        return false;
    }
    
}
function esPasswordValid(password) {
    const re =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,}$/;
    if(re.test(password.value.trim())){
        mostraCorrecte(password);
        
        return true;
    }else{
        mostraError(password,'password no es valid')
        return false;
    }
}
function comprovaContrasenyesIguales(input1,input2) {
    
    if(input1.value != input2.value){
        mostraError(input2,'Las contrasenyas no son iguals.')
        return false;
    }
    else{
        mostraCorrecte(input2);
        return true;
    }
}
function mostraCorrecte(input) {
    const name = input.name;
    
    const error = form.querySelector('label.'+ name);
    
    error.innerText = "";
}
function mostraError(input,missatge){
    const name = input.name;
    const error = form.querySelector('label.'+ name);
    
    error.innerText = missatge;
    
}
window.addEventListener('load', (event) => {
    openCreateDb(function () {
        console.log('Database');
    });
})
let insert = document.getElementById("insert");
console.log("insert");
insert.addEventListener('click',(e) => {
    
    letBoolean1 = esObligatori([email,username,password,password2]);
    console.log(letBoolean1);
    letBoolean2 = esEmailValid(email);
    console.log(letBoolean2);
    letBoolean3 = esPasswordValid(password);
    console.log(letBoolean3);
    letBoolean4 = comprovaContrasenyesIguales(password,password2);
    console.log(letBoolean4);
    letBoolean5 = imatgeSeleccionada(images);
    console.log(letBoolean5);
    if(letBoolean1 && letBoolean2 && letBoolean3 && letBoolean4 && letBoolean5){
            
        openCreateDb(addUser);
    }else{
        console.log("test");
        email.innerText = "";
        username.innerText = "";
        password.innerText = "";
        password2.innerText = "";
            
    }
})


