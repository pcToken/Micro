module.exports._splitArray = function(input) {
    var output; 
    if (input && input.length > 0){
        output = input.split(";");
    }
    else{
        output = [];
    }
    return output;
}