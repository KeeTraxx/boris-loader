angular.module('boris-loader', [])
    .controller('BorisController', [function(){
        console.log('ah sali');
    }])
    .directive('boris', function () {
        return {
            link: function() {
                console.log('ah sali');
            },
            templateUrl: 'boristemplate'
        }
    });

