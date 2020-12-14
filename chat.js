
var messages = document.getElementById("messages");
var textbox = document.getElementById("textbox");
var button = document.getElementById("button");

button.addEventListener("click", function(){
    var newMessage = document.createElement("li");
    newMessage.innerHTML = textbox.value;
    messages.appendChild(newMessage);
    textbox.value = "";
})

var contacts = document.getElementById("contacts");
var type = document.getElementById("type");
var add = document.getElementById("add");

add.addEventListener("click", function(){
    var newMessage = document.createElement("li");
    newMessage.innerHTML = type.value;
    var list = document.getElementById("contacts");
    list.appendChild(newMessage);
    type.value = "";
})