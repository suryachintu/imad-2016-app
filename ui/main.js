
//Submit username password
var submit = document.getElementById('submit');
submit.onclick = function(){
    //Make a request to the server and send name
    
    var request = new XMLHttpRequest();
    
    //Capture the response and store it in a variable
    request.onreadystatechange = function(){
      
      if(request.readyState === XMLHttpRequest.DONE){
          //Take action
          if(request.status === 200){
            console.log("user logged in");
            alert("Successfully logged in ");
          }
          else if(request.status === 403)
          {
            alert("invalid credentials");
          }
          else if(request.status === 500)
          {
            alert("Something went wrong");
          }
          
      }
        
    };
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username + password);
    //make a request 
    request.setHeaderType('Content-Type','application/json');
    request.open('POST','http://suryachintu.imad.hasura-app.io/login',true);
    request.send(JSON.stringify({"username":username,"password":password}));
    
};