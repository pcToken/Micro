angular.module("mainApp").factory("empresaDataFactory",empresaDataFactory);

function empresaDataFactory($http){
    return{
        existe: existe
    }
    function existe(id){
        return $http.get("/api/empresa/"+id).then(function(response){return true;}).catch(function(response){return false;});
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