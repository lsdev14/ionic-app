angular.module('controlePresenca.services')

.factory('Empresas',['$localStorage',function ($localStorage) {

    var empresas = [];

    return {
        all: function () {
            empresas = $localStorage.getObject('empresas');
            return empresas;
        },
        remove: function (empresa) {
            empresas = $localStorage.getObject('empresas');
            empresas.splice(empresas.indexOf(empresa),1);
            $localStorage.setObject('empresas',empresas);
        },
        get: function (empresaCodigo) {
            empresas = $localStorage.getObject('empresas');
            for (var i = 0;i < empresas.length;i++) {
                if (empresas[i].codigo == empresaCodigo) {
                    return empresas[i];
                }
            }
            return null;
        },
        set: function (empresa) {
            empresas = $localStorage.getObject('empresas');

            var updateEmpresa = -1;
            for (var i = 0;i < empresas.length;i++) {
                if (empresas[i].codigo == empresa.codigo) {
                    updateEmpresa = i;
                    break;
                }
            }

            if (updateEmpresa == -1) {
                empresas.push(empresa);
            }
            else {
                empresas[updateEmpresa] = empresa;
            }
            $localStorage.setObject('empresas',empresas);
        }
    };

}]);