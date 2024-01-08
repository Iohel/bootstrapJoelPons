//Check for logged user.
let obj;
function readLoggedUser(db) {
    var tx = db.transaction(DB_LOGGED_STORE_NAME, "readonly");
    var store = tx.objectStore(DB_LOGGED_STORE_NAME);
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
            result.forEach(element => {
                
                if (element != null) {
                    if(element.administrador === '0'){
                        /* setTimeout("",10000); */
                        location.href = './index.html';
                    }else{
                        location.href = './administrator.html';
                    }
                    
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

function readGeneralUser(db) {
    let username = document.getElementById('username'); //Get value
    let password = document.getElementById('password'); //Get value
    let control = false;
    var tx = db.transaction(DB_GENERAL_STORE_NAME, "readonly");
    var store = tx.objectStore(DB_GENERAL_STORE_NAME);
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
            //Operations to do after reading all the record
            result.forEach(element => {

                if(element.username === username.value && element.password === password.value) {
                    console.log("pepe");
                    obj = element;
                    control = true;
                    openCreateDb(addLoggedEntry);
                    
                }
            });
            /* if (!control) {
                console.log("test");
                username.value = ""; //Get value
                password.value= "";
            } */
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


const form = document.querySelector('form');
function esObligatori(inputArray) {
    let t = 0;
    console.log("test");
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
    openCreateDb(readLoggedUser);
})

let login = document.getElementById('login');
let register = document.getElementById('register');
login.addEventListener('click', (e)=>{
        
    let Boolean1 = esObligatori([username,password]);
    console.log(username.value,password.value);
    console.log(Boolean1);
    if(Boolean1){
        
        openCreateDb(readGeneralUser)
    }else{
        document.getElementById('username').innerText = ""; //Get value
        document.getElementById('password').innerText = ""; //Get value
    }

})
register.addEventListener('click', (e)=>{
    location.href = '/UD5_Activity_1_Revisat/registerPage.html';
})
