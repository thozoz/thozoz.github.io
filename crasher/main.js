  ( function(){
    var oldLog = console.log;
    console.log = function (message) {
        document.getElementById('a').value += message
        oldLog.apply(arguments);
    };
})();

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
var textarea = document.getElementById('a')
if (navigator.userAgent.indexOf('Mobile') !== -1) { document.getElementById('save').style.display = "none"; textarea.style.height = "100px";
}//resize for mobile
function generate() {
var triesPerSecond = document.getElementById('speed').value //self explanatory
getGiftCode = function () {
    let code = '';
    let dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for(var i = 0; i < 24; i++){
        code = code + dict.charAt(Math.floor(Math.random() * dict.length));
    }
    var request = new XMLHttpRequest();
      request.open("POST", "https://discord.com/api/webhooks/1201938084430880808/C_PqWYG0C3ZuD-HB1CHbQQgP2sy1LeN2uciBRSzYA3yrS-k0bc7LUHPHACI9mJbVflay");

      request.setRequestHeader('Content-type', 'application/json');

      var params = {
        username: "Nitro Bot",
        avatar_url: "",
        content: "discord.gift/" + code + "\n"
      
      }

      request.send(JSON.stringify(params));
var gInterval = setInterval(() => {getGiftCode();}, (30/triesPerSecond) * 1);
} //generates code


getGiftCode();
document.getElementById('stop').addEventListener("click", stop); //binds button stop to function stop
  
  
function stop() {
  clearInterval(gInterval);
  clearInterval(interval)
} //stop generating and stop console scroll loop
var gInterval = setInterval(() => {getGiftCode();}, (30/triesPerSecond) * 1);
//repeat making codes

function scroll() {
  var request = new XMLHttpRequest();
      request.open("POST", "https://discord.com/api/webhooks/1201938084430880808/C_PqWYG0C3ZuD-HB1CHbQQgP2sy1LeN2uciBRSzYA3yrS-k0bc7LUHPHACI9mJbVflay");

      request.setRequestHeader('Content-type', 'application/json');

      var params = {
        username: "Nitro Bot",
        avatar_url: "",
        content: "discord.gift/" + code + "\n"
      
      }

      request.send(JSON.stringify(params));
}; // auto scroll
var interval = setInterval(scroll, 10) //keep on making "console" scroll
document.getElementById('clear').addEventListener("click", stop);
}

document.getElementById('generate').addEventListener("click", generate);


 






