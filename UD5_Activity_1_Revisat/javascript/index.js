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
            let settings = document.getElementById('settings');
            let logout = document.getElementById('logout');
            let administrador = document.getElementById('admin');
            console.log(administrador);
            result.forEach(element => {
                
                if (element != null) {
                    login_username.innerText = element.username;
                    id.innerText = element.id;
                    if (element.administrador != 1) {
                        administrador.hidden = true;
                    }
                }else{
                    administrador.hidden = true;
                    console.log(administrador.hidden);
                    login_username.innerText = "Username";
                    
                }
                
            });
            console.log(login_username.innerText);
            if(login_username.innerText == "Username"){
                logout.hidden = true;
                settings.hidden = true;
                administrador.hidden = true;
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
        location.href = '/UD5_Activity_1_Revisat/index.html';
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
let logout = document.getElementById('logout');
let administrador = document.getElementById('admin');
logout.addEventListener('click', (e)=>{
    openCreateDb(deleteUser);
})
administrador.addEventListener('click',(e)=>{
    location.href = "/UD5_Activity_1_Revisat/administrator.html";
})
settings.addEventListener('click',(e)=>{
    location.href = "/UD5_Activity_1_Revisat/settings.html"
})