//counter code
var button = document.getElementById('counter');
var counter = 0;

button.onclick = function(){
    
    // Make a request to counter end point
    var request = new XMLHttpRequest();
    
    //Capture the response and store it in a variable
    request.onreadystatechange = function(){
      
      if(request.status == 200){
          //take some action
            var counter = request.responseText();
            var span = document.getElementById('count');
            span.innerHTML = counter.toString();      
      }
      //do nothing
        
    };
    
    //make a request 
    request.open('GET','http://suryachintu.imad.hasura-app.io/counter',true);
    request.send(null);
    
    
};