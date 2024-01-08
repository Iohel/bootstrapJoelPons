//database
var indexedDB = window.indexedDB || window.mozIndexedDB ||
window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
var database = "JoelDB";
const DB_GENERAL_STORE_NAME = 'users';
const DB_LOGGED_STORE_NAME = 'logged';
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

        //USERS
        console.log("openCreateDb: upgrade needed " + db);
        var store = db.createObjectStore(DB_GENERAL_STORE_NAME, { keyPath:"id", autoIncrement: true});
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

        //Logged users.
        store = db.createObjectStore(DB_LOGGED_STORE_NAME, { keyPath:"id", autoIncrement: true});
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

        
    };
    

    req.onerror = function (e) {
        console.error("openCreateDb: error opening or creating DB:",
        e.target.errorCode);
    };
};

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
//Encode and decrypt doesnt work for login, for the sake of the web working i have disabled it.
/* function encodePassword(e) {
    
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

   
} */

window.addEventListener('load', (event) => {
    openCreateDb(function () {
        console.log('Database');
    });
})
