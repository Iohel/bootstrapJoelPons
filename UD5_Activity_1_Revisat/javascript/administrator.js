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
            let login_username = document.getElementById('login_username');
            let id = document.getElementById('login_id');
            let register_page = document.getElementById('register_page');
            let login_page = document.getElementById('login_page');
            let logout = document.getElementById('logout');
            
            result.forEach(element => {
                
                if (element != null) {
                    login_username.innerText = element.username;
                    id.innerText = element.id;
                    
                }else{
                    login_username.innerText = "Username";
                }
            });
            console.log(login_username.innerText);
            if(login_username.innerText == "Username"){
                logout.hidden = true;
            }else{
                register_page.hidden = true;
                login_page.hidden = true;
            };
            
            
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

function deleteUser(db){
    var tx = db.transaction(DB_LOGGED_STORE_NAME, "readwrite");
    var store = tx.objectStore(DB_LOGGED_STORE_NAME);
    //Delete data in our ObjectStore
    var req = store.clear();
    req.onsuccess = function(e){
        console.log("deleteUser: Data successfully removed");
        //Operation to do after deleting a record
        location.href = '/index.html';
    };
    req.onerror = function(e){
        console.error("deleteUser: error removing data:",
        e.target.errorCode);
    };
    tx.oncomplete = function() {
        console.log("deleteUser: tx completed");
            
    };
};

window.addEventListener('load', (event) => {
    openCreateDb(function () {
        console.log('Database');
    });
})

openCreateDb(readUser);
reload.addEventListener('click', (e)=>{
        
    console.log("test");
    
    openCreateDb(readAllUsers);
        
}) 

logout.addEventListener('click', (e)=>{
    openCreateDb(deleteUser);
})

