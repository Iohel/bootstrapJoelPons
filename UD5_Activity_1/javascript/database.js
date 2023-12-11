//import


//database
var indexedDB = window.indexedDB || window.mozIndexedDB ||
window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
var database = "JoelDB";
const DB_STORE_NAME = 'users';
const DB_VERSION = 1;
const key = "o7kTDg78egG1vAGY46xut0gT9nneSWp4cUH3miMbhGU8JhRgNxpKrj7z8KkiCovq";
var db;
var opened = false;
/**
* openCreateDb
* opens and/or creates an IndexedDB database
*/
function openCreateDb(onDbCompleted) {
    if(opened){
        db.close();
        opened = false;
    }
    
    //We could open changing version ..open(database, 3)
    var req = indexedDB.open(database, DB_VERSION);
    
    //This is how we pass the DB instance to our var
    req.onsuccess = function (e) {
        db = this.result; // Or event.target.result
        console.log("openCreateDb: Databased opened " + db);
        opened = true;
            //The function passed by parameter is called after creating/opening database
        onDbCompleted(db);
    };
    // Very important event fired when
    // 1. ObjectStore first time creation
    // 2. Version change
    //Value of previous db instance is lost. We get it back using the event
    req.onupgradeneeded = function() {
        db = req.result; //Or this.result
        console.log("openCreateDb: upgrade needed " + db);
        var store = db.createObjectStore(DB_STORE_NAME, { keyPath:"id", autoIncrement: true});
        console.log("openCreateDb: Object store created");
        
        store.createIndex('email', 'email', { unique: false });
        console.log("openCreateDb: Index created on email");
        store.createIndex('username', 'username', { unique: false });
        console.log("openCreateDb: Index created on username");
        store.createIndex('password', 'password', { unique: false });
        console.log("openCreateDb: Index created on password");
        store.createIndex('image_name', 'image_name', { unique: false });
        console.log("openCreateDb: Index created on image_id");
        store.createIndex('administrador', 'administrador', { unique: false });
        console.log("openCreateDb: Index created on administrador");
        store.createIndex('logged', 'logged', { unique: false });
        console.log("openCreateDb: Index created on logged");
    };
    

    req.onerror = function (e) {
        console.error("openCreateDb: error opening or creating DB:",
        e.target.errorCode);
    };
};
function addUser(db){
    
    let email = document.querySelector('#email');
    let username = document.querySelector('#username');
    let password = document.querySelector('#password');
    let image_name = document.querySelector('input[name="image"]:checked');
    let administrador = document.querySelector('.checkbox input:checked');
    let administradorValue;
    
    if (administrador != null) {
        administradorValue = '1';
    }else{
        administradorValue = '0';
    }
    console.log(encodePassword(password.value));
    let obj = { email: email.value, username: username.value, password: encodePassword(password.value), image_name: image_name.value, administrador: administradorValue, logged: 1};
    //let obj = { email: email, username: username, password: password};
    var tx = db.transaction(DB_STORE_NAME, "readwrite");
    var store = tx.objectStore(DB_STORE_NAME);
    
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
        console.log(administrador);
        if(administradorValue === '0'){
            setTimeout("",10000);
            location.href = './index.html';
        }else{
            location.href = './administrator.html';
        }
       
        
    };
    console.log('test2');
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
function readUser(e){
    console.log("readUser");
    //Both options work
    //var button_id = e.target.id;
    //var user_id =
    /* document.getElementById(button_id).getAttribute("user_id"); */
    var username = e.value;
    console.log(username);
    openCreateDb(function(db){
        console.log(db);
        console.log("Username: " + username);
        var tx = db.transaction(DB_STORE_NAME, "readonly");
        var store = tx.objectStore(DB_STORE_NAME);
        // Reads one record from our ObjectStore
        var req = store.get(username);
        console.log(req);
        req.onsuccess = function(e){
            var record = e.target.result;
            console.log(record);
            //Operations to do after reading a user
        };
        req.onerror = function(e){
            console.error("readUser: error reading data:",
            e.target.errorCode);
        };
        tx.oncomplete = function() {
            console.log("readUser: tx completed");
            db.close();
            opened = false;
        };
    });
}
function readByUsername(db) {
    var username = document.getElementById('username').value; //Get value
    var password = document.getElementById('password').value; //Get value
    
    console.log(username);
    var tx = db.transaction(DB_STORE_NAME, "readonly");
    var store = tx.objectStore(DB_STORE_NAME);
    try {
        //Creates an index
        var index = store.index("username");
    } catch (e) {
        console.log("Error creating an index: " + e);
    }
    console.log("Indexed established");
    
    //With this we could get just one object
    var req = index.get('username');
    
    req.onsuccess = function(e){
        var record = e.target.result;
        console.log(record);
        console.log("Found: " + record.username);
        console.log("Found: " + record.password);
        if(username == record.username && password == decryptPassword(password.value)){
            console.log("WORKING");
            location.href = '/UD5_Activity_1/index.html';
        }else if(r){

        }
        else{
            console.log("Mistake");
            
        }
    };
    
}
// Reads all the records from our ObjectStore
function readAllUsers(db) {
    var tx = db.transaction(DB_STORE_NAME, "readonly");
    var store = tx.objectStore(DB_STORE_NAME);
    var result = [];
    var req = store.openCursor();
    req.onsuccess = function(e){
        console.log(e);
        var cursor = e.target.result;
        console.log(cursor);
        if (cursor) {
            result.push(cursor.value);
            cursor.continue();
        } else {
            console.log("EOF");
            console.log(result);
            //Operations to do after reading all the records
            let prints = document.getElementById('print');
            let username = result[0].username;
            result.forEach(element => {
                prints.innerHTML = prints.innerHTML + '<di>';
                prints.innerHTML = prints.innerHTML + element.email + " | ";
                prints.innerHTML = prints.innerHTML + element.username + " | ";
                prints.innerHTML = prints.innerHTML + element.image_name + " | ";
                prints.innerHTML = prints.innerHTML + element.administrador + '|';
                prints.innerHTML = prints.innerHTML + "<input type='button' value='edit_user' id='edit_user'>" + '|';
                prints.innerHTML = prints.innerHTML + "<input type='button' value='reset_password' id='reset_password'>" + '|';
                prints.innerHTML = prints.innerHTML + "<input type='button' value='delete' id='delete'>" + '</div>';
                console.log(prints.innerHTML);
            });    
        }
    };


    req.onerror = function(e){
        console.error("readUsers: error reading data:",
        e.target.errorCode);
    };
    tx.oncomplete = function() {
        console.log("readUsers: tx completed");
        db.close();
        opened = false;       
    };
}
function readUser(db) {
    var tx = db.transaction(DB_STORE_NAME, "readonly");
    var store = tx.objectStore(DB_STORE_NAME);
    var result = [];
    var req = store.openCursor();
    req.onsuccess = function(e){
        console.log(e);
        var cursor = e.target.result;
        console.log(cursor);
        if (cursor) {
            result.push(cursor.value);
            cursor.continue();
        } else {
            console.log("EOF");
            console.log(result);
            //Operations to do after reading all the records
            let login_username = document.getElementById('login_username');
            let id = document.getElementById('login_id');
            let register_page = document.getElementById('register_page');
            let login_page = document.getElementById('login_page');
            let logout = document.getElementById('logout');
            
            if(login_username.value != "Username"){
                register_page.hidden = true;
                login_page.hidden = true;
                
            }else{
                
                logout.hidden = true;
            };
            
            result.forEach(element => {
                console.log(element.id);
                if (element.logged == 1) {
                    login_username.innerText = element.username;
                    id.innerText = element.id;
                    
                }
            });
        }
    };


    req.onerror = function(e){
        console.error("readUsers: error reading data:",
        e.target.errorCode);
    };
    tx.oncomplete = function() {
        console.log("readUsers: tx completed");
        db.close();
        opened = false;

        
    };
}
function editLoginStatus(db){
    var login_id = document.getElementById("login_id");
    var obj = { id: parseInt(login_id.innerText), logged: 0};
    var tx = db.transaction(DB_STORE_NAME, "readwrite");
    var store = tx.objectStore(DB_STORE_NAME);
    //Updates data in our ObjectStore
    req = store.put(obj);
    req.onsuccess = function (e) {
        console.log("Data successfully updated");
        //Operations to do after updating data
        location.href = '/UD5_Activity_1/index.html';
    };
    req.onerror = function(e) {
        console.error("editUser: Error updating data", this.error);
    };
    tx.oncomplete = function() {
        console.log("editUser: tx completed");
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
if(document.title == 'Register Page'){
    let insert = document.querySelector('#insert');
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
}
if (document.title == 'Login Page') {
    let login = document.getElementById('login');
    let register = document.getElementById('register');
    login.addEventListener('click', (e)=>{
        
        let Boolean1 = esObligatori[username,password];
        console.log(username.value,password.value);
        if(Boolean1){
            console.log('a');
        }else{
            openCreateDb(readByUsername);
        }

    })
    register.addEventListener('click', (e)=>{
        location.href = '/UD5_Activity_1/registerPage.html';
    })
}
if(document.title == "Menorca Games"){
    openCreateDb(readUser);
    logout.addEventListener('click', (e)=>{
        openCreateDb(editLoginStatus);
    })
    
}
if(document.title == "Admnistrator"){
    openCreateDb(readUser);
    reload.addEventListener('click', (e)=>{
        
        console.log("test");
    
        openCreateDb(readAllUsers);
        
        
    }) 
    logout.addEventListener('click', (e)=>{
        openCreateDb(editLoginStatus);
    })
}
