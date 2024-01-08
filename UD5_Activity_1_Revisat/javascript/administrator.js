// Reads all the records from our ObjectStore
let loggedUsername;

function readAllUsers(db) {
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
            //Operations to do after reading all the records
            let prints = document.getElementById('print');
            let i = 0;
            result.forEach(element => {
                prints.innerHTML += '<tr>' 
                                + '<td>' + element.email +"</input>"+ "</td>"
                                + "<td id='username_container'>" + element.username + "</td>"
                                + '<td>' + element.image_name + "</td>"
                                + '<td>' + "<button class='edit_user' data-index='" + i + "'>Edit User</button>" + "</td>"
                                + '<td>' + "<button class='reset_password' data-index='" + i + "'>Reset Password</button>" + "</td>"
                                + '<td>' + "<button class='delete_user' data-index='" + i + "'>Delete User</button>" + "</td>"
                                + '<td hidden>' + element.id + "</td>";
                i++;   
            });

            // Add event listeners for each button class
            document.querySelectorAll('.edit_user').forEach(button => {
                button.addEventListener('click', (e) => {
                    // Get the index from the data attribute
                    const index = e.currentTarget.dataset.index;
                    const user = result[index];

                    // Perform Edit User action
                    console.log("Edit User clicked for user with email: " + user.id);
                    
                    //recuperar los elementos del dom que nos interesan
                    
                    const envoltorio = document.getElementsByClassName('envoltorio-popup');
                    const cerrar = document.getElementsByClassName('cerrar-popup');

                    var id = document.getElementById("id");
                    id.value = user.id;
                    var email = document.getElementById("email");
                    email.value = user.email;
                    var username = document.getElementById("username");
                    username.value = user.username;
                    var password = document.getElementById("password");
                    password.value = user.password;
                    var administrador = document.getElementById("administrador");
                    administrador.value = user.administrador;
                    var image_name = document.querySelector("input[value="+"'"+user.image_name+"'"+"]");
                    
                    var obj = { id: parseInt(id.value), email: email.value,
                    username: username.value,password: password.value, 
                    administrador: administrador.value, image_name: image_name.value};
                    console.log(obj);

                    envoltorio[0].style.display = 'block';
                    //click sobre el boton cerrar.
                    cerrar[0].addEventListener('click', () => {
                        envoltorio[0].style.display = 'none';
                    })

                    submit.addEventListener('click',(e)=>{
                        
                        obj.email = email.value;
                        obj.username = username.value;
                        obj.administrador = administrador.value;
                        obj.image_name = document.querySelector('input[name="image"]:checked').value;
                        console.log(obj);
                        editUser(obj);
                    })

                    //click sobre el envoltorio cerrar el popup
                    /* envoltorio[0].addEventListener('click', () => {
                        envoltorio[0].style.display = 'none';
                    }) */

                });
            });

            document.querySelectorAll('.reset_password').forEach(button => {
                button.addEventListener('click', (e) => {
                    // Get the index from the data attribute
                    const index = e.currentTarget.dataset.index;
                    const user = result[index];

                    // Perform Reset Password action
                    const envoltorio = document.getElementsByClassName('envoltorio-popup');
                    const cerrar = document.getElementsByClassName('cerrar-popup');
                    document.getElementById("password").hidden = false;
                    document.getElementById("usernameGroup").hidden = true;
                    document.getElementById("emailGroup").hidden = true;
                    document.getElementById("adminGroup").hidden = true;
                    document.getElementById("imageGroup").hidden = true;
                    document.querySelector("h2").innerText = "Change password";
                    var id = document.getElementById("id");
                    id.value = user.id;
                    var email = document.getElementById("email");
                    email.value = user.email;
                    var username = document.getElementById("username");
                    username.value = user.username;
                    var password = document.getElementById("password");
                    password.value = user.password;
                    var administrador = document.getElementById("administrador");
                    administrador.value = user.administrador;
                    var image_name = document.querySelector("input[value="+"'"+user.image_name+"'"+"]");

                    var obj = { id: parseInt(id.value), email: email.value,
                                username: username.value,password: password.value, 
                                administrador: administrador.value, image_name: image_name.value};
                    console.log(obj);
    
                    envoltorio[0].style.display = 'block';
                    //click sobre el boton cerrar.
                    cerrar[0].addEventListener('click', () => {
                        envoltorio[0].style.display = 'none';
                    })
                    submit.addEventListener('click',(e)=>{
                        
                        obj.password = password.value;
                        console.log(obj);
                        editUser(obj);
                    })
                });
            });

            document.querySelectorAll('.delete_user').forEach(button => {
                button.addEventListener('click', (e) => {
                    // Get the index from the data attribute
                    const index = e.currentTarget.dataset.index;
                    const user = result[index];

                    // Perform Delete User action
                    console.log("Delete User clicked for user with email: " + user.id);
                    if(loggedUsername == user.username){
                        console.log("yes");
                        deleteUser(user.id);
                        openCreateDb(logoutUser);
                    }else{
                        deleteUser(user.id);
                    }
                    
                });
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
            let logout = document.getElementById('logout');
            
            if(result.length != 0){
                result.forEach(element => {
                    console.log(element);
                    if (element.administrador == 1) {
                        login_username.innerText = element.username;
                        loggedUsername = element.username;
                        id.innerText = element.id;
                        
                    }else{
                        console.log("logout");
                        location.href = '/UD5_Activity_1_Revisat/index.html';
                    }
                });
            }else{
                console.log("logout");
                location.href = '/UD5_Activity_1_Revisat/index.html';
            }
            
            console.log(login_username.innerText);
            if(login_username.innerText == "Username"){
                logout.hidden = true;
            }
            
            
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


window.addEventListener('load', (event) => {
    openCreateDb(function () {
        console.log('Database');
    });
    openCreateDb(readUser);
    openCreateDb(readAllUsers);
    
})

home.addEventListener('click',(e)=>{
    location.href ="/UD5_Activity_1_Revisat/index.html";
})



logout.addEventListener('click', (e)=>{
    openCreateDb(logoutUser);
})

