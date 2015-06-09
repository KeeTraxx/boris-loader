angular.module('boris-loader', [])
    .controller('BorisController', [function () {
        console.log('ah sali');
    }])
    .directive('boris', function ($http, $window) {
        return {
            link: function ($scope) {
                console.log('ah sali');
                var c = $window.angular.callbacks.counter.toString(36);
                $window['angularcallbacks_' + c] = function (data) {
                    $window.angular.callbacks['_' + c](data);
                    delete $window['angularcallbacks_' + c];
                };

                $http.jsonp('http://boris.unibe.ch/cgi/exportview/divisions/DCD5A442BB9CE17DE0405C82790C4DE2/JSON/DCD5A442BB9CE17DE0405C82790C4DE2.js?callback=JSON_CALLBACK').success(function (data) {
                    $scope.data = data;
                }).error(function (err) {

                });
            },
            template: '<pre>{{data | json}}</pre>'
        }
    });

