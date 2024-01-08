function deleteUser(e){
    console.log("deleteUser");
    var user_id = e;
    
    openCreateDb(function(db){
        console.log(user_id);
        var tx = db.transaction(DB_GENERAL_STORE_NAME, "readwrite");
        var store = tx.objectStore(DB_GENERAL_STORE_NAME);
        //Delete data in our ObjectStore
        var req = store.delete(parseInt(user_id));
        req.onsuccess = function(e){
            console.log("deleteUser: Data successfully removed: " + user_id);
            //Operation to do after deleting a record
            location.href = '/UD5_Activity_1_Revisat/administrator.html';
        };
        req.onerror = function(e){
            console.error("deleteUser: error removing data:",
            e.target.errorCode);
        };
        tx.oncomplete = function() {
            console.log("deleteUser: tx completed");
            
            db.close();
            opened = false;
        };
    });
}

function logoutUser(db){
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

function editUser(obj){
    let id = document.getElementById('login_id').innerText;
    console.log(obj);
    if (obj.id == id) {
        openCreateDb(function(db){
            var tx = db.transaction(DB_LOGGED_STORE_NAME, "readwrite");
            var store = tx.objectStore(DB_LOGGED_STORE_NAME);
            //Updates data in our ObjectStore
            req = store.put(obj);
            req.onsuccess = function (e) {
                console.log("Data successfully updated");
                //Operations to do after updating data
                
            };
            req.onerror = function(e) {
                console.error("editUser: Error updating data", this.error);
            };
            tx.oncomplete = function() {
                console.log("editUser: tx completed");
                db.close();
                opened = false;
            };
        });
    }
    openCreateDb(function(db){
        var tx = db.transaction(DB_GENERAL_STORE_NAME, "readwrite");
        var store = tx.objectStore(DB_GENERAL_STORE_NAME);
        //Updates data in our ObjectStore
        req = store.put(obj);
        req.onsuccess = function (e) {
            console.log("Data successfully updated");
            //Operations to do after updating data
            location.href = "/UD5_Activity_1_Revisat/administrator.html";
        };
        req.onerror = function(e) {
            console.error("editUser: Error updating data", this.error);
        };
        tx.oncomplete = function() {
            console.log("editUser: tx completed");
            db.close();
            opened = false;
        };
    });
    
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

                var idl = document.getElementById("id");
                    idl.value = id.innerText;
                    var email = document.getElementById("email");
                    email.value = element.email;
                    var username = document.getElementById("username");
                    username.value = element.username;
                    var password = document.getElementById("password");
                    password.value = element.password;
                    var administrador = document.getElementById("administrador");
                    administrador.value = element.administrador;
                    var image_name = document.querySelector("input[value="+"'"+element.image_name+"'"+"]");
                    image_name.checked = true;
                    var obj = { id: parseInt(idl.value), email: email.value,
                    username: username.value,password: password.value, 
                    administrador: administrador.value, image_name: image_name.value};
                    console.log(obj);
                submit.addEventListener('click',(e)=>{
                        
                    obj.email = email.value;
                    obj.username = username.value;
                    obj.password = password.value;
                    obj.image_name = document.querySelector('input[name="image"]:checked').value;
                    console.log(obj);
                    editUser(obj);
                })
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
window.addEventListener('load', (event) => {
    openCreateDb(function () {
        console.log('Database');
    });
    
});
openCreateDb(readUser);
home.addEventListener('click',(e)=>{
    location.href ="/UD5_Activity_1_Revisat/index.html";
})
logout.addEventListener('click', (e)=>{
    openCreateDb(logoutUser);
})

home.addEventListener('click',(e)=>{
    location.href ="/UD5_Activity_1_Revisat/index.html";
})

logout.addEventListener('click', (e)=>{
    openCreateDb(logoutUser);
})