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
            location.href = '/UD5_Activity_1_Revisat/index.html';
        }else if(r){

        }
        else{
            console.log("Mistake");
            
        }
    };
    
}

window.addEventListener('load', (event) => {
    openCreateDb(function () {
        console.log('Database');
    });
})

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
    location.href = '/UD5_Activity_1_Revisat/registerPage.html';
})
