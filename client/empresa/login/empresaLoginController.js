angular.module("mainApp").controller("empresaLoginController", empresaLoginController)
function empresaLoginController($routeParams, $location, empresaDataFactory, $http) {
    var vm = this;
    vm.empresa = $routeParams.idEmpresa;
    empresaDataFactory.existe(vm.empresa).then(function(response){
        if(!response) $location.path("/");
    });
    vm.ingresar = function() {
        
        if(vm.login && vm.clave) {
            console.log("FUNCION");
            var user = {
                login : vm.login,
                clave : vm.clave
            }
            $http.post('/api/empresa/'+ $routeParams.idEmpresa +'/empleado/login',user).then(function(response) {
                if(response.data){
//                    $window.sessionStorage.token = response.data.token;
//                    AuthFactory.isLoggedIn = true;
//                    var token = $window.sessionStorage.token;
//                    vm.loggedInUser = jwtHelper.decodeToken(token).username;
//                    console.log("user logged in : ", user.username);
                    console.log(response.data);
                }
            }).catch(function(err) {
                console.log("error loginController.login: ",err);
            });
        }
    }

}