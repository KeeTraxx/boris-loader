angular.module('boris-loader', ['boris-tpl','boris-translation'])
    .directive('boris', ['$http', '$window', '$filter', function ($http, $window, $filter) {
        return {
            link: function ($scope, el, attrs) {

                // inject CSS
                angular.element(document.querySelector('head'))
                    .append('<link rel="stylesheet" href="//' + (window.borisdev ? '' : 'cdn.') + 'rawgit.com/keetraxx/boris-loader/zms3/boris.css" type="text/css" />');

                var c = $window.angular.callbacks.counter.toString(36);
                $window['angularcallbacks_' + c] = function (data) {
                    $window.angular.callbacks['_' + c](data);
                    delete $window['angularcallbacks_' + c];
                };

                var url = attrs.boris + '?callback=JSON_CALLBACK';

                $scope.project = attrs['boris-project'];

                $http.jsonp(url).success(function (data) {
                    $scope.data = _.map(data, function (d) {
                        d.subtype = d[d.type.replace('_item', '') + '_type'] || '';
                        d.extended_type = _.compact([d.type, d.subtype]).join('_');
                        d.template = templateMappings(d);
                        d.year = String(d.date).match(/1|2\d{3}/)[0];

                        d.compact_contributors = compactNames(d.contributors).join(', ');
                        d.compact_editors = compactNames(d.editors).join(', ');
                        d.compact_creators = compactNames(d.creators).join(', ');
                        return d;
                    });

                    $scope.years = _.uniq(_.pluck($scope.data, 'year')).sort();

                    $scope.year = $scope.years[$scope.years.length - 1];
                }).error(function (err) {

                });

                $scope.setYear = function(year) {
                    $scope.year = year;
                };

                $scope.getPublications = function() {
                    if ( $scope.project != $scope.oldProject || $scope.year != $scope.oldYear ) {
                        var results = $filter('project')($scope.data, $scope.project);
                        results = $filter('year')(results, $scope.year);
                        $scope.filtered = $filter('groupBy')(results, 'extended_type');
                        $scope.oldProject = $scope.project;
                        $scope.oldYear = $scope.year;
                    }
                    return $scope.filtered;
                };

            },
            template: '<ul class="yearnav inline"><li class="yearnav" ng-repeat="y in years | reverse"><a href="" ng-click="setYear(y)">[ {{y}} ]</a></li></ul>' +
            '<br style="clear:both" />' +
            '<ul class="publications">' +
            //'<li ng-repeat="(extended_type,publications) in byType = (data | project: project | year: year | groupBy: \'extended_type\')">' +
            '<li ng-repeat="(extended_type,publications) in getPublications()">' +
            '<h5>{{extended_type | translate}} ({{publications.length}})</h5>' +
            '<ul>' +
            '<li ng-repeat="publication in publications" ng-include="publication.template"></li>' +
            '</ul>' +
            '<hr class="boris">' +
            '</li>' +
            '</ul>'
        }
    }])
    .filter('project', [function () {
        return function (input, id) {
            if (!id) {
                return input;
            }
            return _.filter(input, function (d) {
                return _.find(d.projects, function (d) {
                    return d.id == id || d.title.indexOf(id) > -1;
                })
            })
        }
    }])
    .filter('year', [function () {
        return function (publications, year) {
            return _.filter(publications, function (d) {
                return year == d.year;
            });
        }
    }])
    .filter('reverse', [function () {
        return function (items) {
            if (items) {
                return items.slice().reverse();
            }
        };
    }])
    .filter('groupBy',[function(){
        return function (array, field) {
            return _.groupBy(array, function(d){
                return d[field];
            });
        }
    }]);

function compactNames(names) {
    return _.compact(_.map(names, function (d) {
        if (d.disp_name && d.disp_name.family) {
            return d.disp_name.family + ( d.disp_name.given ? ', ' + d.disp_name.given[0] + '.' : '' );
        } else if (d.name && d.name.family) {
            return d.name.family + ( d.name.given ? ', ' + d.name.given[0] + '.' : '' );
        }
    }));
}

function templateMappings(publication) {
    switch (publication.extended_type) {
        case "article_contribution":
        case "article_journal":
            return "article_contribution";
        case "book_ed_volume":
        case "book_monograph":
        case "book_textbook":
        case "journal_series_series":
            return 'book_ed_volume';
        case "book_section_chapter":
        case "book_section_contribution":
        case "book_section_encyclopedia":
            return 'book_section_chapter';
        case "conference_speech":
        case "conference_paper":
        case "conference_abstract":
        case "conference_item_abstract":
        case "conference_item_speech":
        case "conference":
            return 'conference_speech';
        default:
            return publication.extended_type;
    }
}