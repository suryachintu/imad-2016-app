//counter code
var button = document.getElementById('counter');
button.onclick = function(){
    
    // Make a request to counter end point
    var request = new XMLHttpRequest();
    
    //Capture the response and store it in a variable
    request.onreadystatechange = function(){
      
      if(request.readyState === XMLHttpRequest.DONE){
          //Take action
          if(request.status === 200){
              //take some action
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();      
          }
      }
        
    };
    
    //make a request 
    request.open('GET','http://suryachintu.imad.hasura-app.io/counter',true);
    request.send(null);
    
    
};

//Submit name
var nameInput = document.getElementById('name');
var name = nameInput.value;
var submit = document.getElementById('submit_btn');
submit.onclick = function(){
    //Make a request to the server and send name
    
    //capture a list of names and renser it as names
    var names = ['name1','name2','name3'];
    
    var list = '';
    
    for(var i=0 ; i<names.length;i++){
        list+= '<li>' + names[i] + '</li>';  
    }
    
    var ul = document.getElementById('namelist');
    ul.innerHTML = list;
    
};