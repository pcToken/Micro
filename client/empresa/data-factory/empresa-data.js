angular.module("mainApp").factory("empresaData",empresaData);

function empresaData($http){
    return{
        existe: existe
    }
    function existe(id){
        return $http.get("/api/empresa/"+id)
            .then(function(response){
            console.log('EMPRESA EXISTE');
            return true;
        }).catch(function(response){
            console.log('EMPRESA NO EXISTE');
            return false;
        });
    }
    function listo(response) {
        console.log("response complete: ",response);
        return response;
    }
    //function when error
    function falla(err) {
        console.log("err : " + err.statusText);
    }
    
}