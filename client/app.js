//set module 
angular.module("mainApp",['ngRoute']).config(config);

function config($routeProvider){
    $routeProvider
        .when("/",{
            template: "<h1>MAIN</h1>"
        })
        .when("/:idEmpresa/login",{
            controller: empresaLoginController,
            templateUrl: "empresa/login/empresaLogin.html",
            controllerAs: "vm"
        });
}