//counter code
var button = document.getElementById('counter');
var counter = 0;

button.onclick = function(){
    
    // Make a request to counter end point
    
    //Capture the response and store it in a variable
    
    //Render the variable in correct span
    var span = document.getElementById('count');
    
    counter = counter + 1 ;
    
    span.innerHTML = counter.toString();
    
    
};