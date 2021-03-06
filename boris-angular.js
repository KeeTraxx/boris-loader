angular.module('boris-loader', ['boris-tpl', 'boris-translation'])
    .directive('boris', ['$http', '$window', '$filter', '$translate', function ($http, $window, $filter, $translate) {
        return {
            link: function ($scope, el, attrs) {

                if (document.querySelector('header span.product')) {
                    // ZMS detected...
                    return;
                }

                // Language autodetection
                var langElement = document.querySelector('#nav-lang li a.active');

                if (langElement) {
                    $translate.use(langElement.innerHTML.toLowerCase());
                }

                // inject CSS
                angular.element(document.querySelector('head'))
                    .append('<link rel="stylesheet" href="//keetraxx.github.io/boris-loader/boris.css" type="text/css" />');

                var c = $window.angular.callbacks.counter.toString(36);
                $window['angularcallbacks_' + c] = function (data) {
                    $window.angular.callbacks['_' + c](data);
                    delete $window['angularcallbacks_' + c];
                };

                var template = attrs.hasOwnProperty('template') ? attrs.template : 'default';

                console.log(template);

                var url = attrs.boris + '?callback=JSON_CALLBACK';

                $scope.project = attrs['project'];

                $http.jsonp(url).success(function (data) {
                    $scope.data = _.map(data, function (d) {
                        d.subtype = d[d.type.replace('_item', '') + '_type'] || '';
                        if (d.type == 'conference_item') {
                          d.type = 'conference';
                        }
                        d.extended_type = _.compact([d.type, d.subtype]).join('_');
                        if (d.extended_type == 'conference_abstract') {
                          d.extended_type = 'conference_paper';
                        } else if (d.extended_type == 'book_monograph') {
                          d.extended_type = 'book_textbook';
                        }
                        d.template = templateMappings(d);
                        d.year = String(d.date).match(/1|2\d{3}/)[0];

                        d.compact_contributors = compactNames(_.filter(d.contributors, function(d){return d.type != 'ADVISOR'})).join(', ');
                        d.compact_editors = compactNames(d.editors).join(', ');
                        d.compact_creators = compactNames(d.creators).join(', ');
                        return d;
                    });

                    $scope.years = _.uniq(_.pluck($scope.data, 'year')).sort();

                    $scope.year = $scope.years[$scope.years.length - 1];
                }).error(function (err) {

                });

                $scope.setYear = function (year) {
                    $scope.year = year;
                };

                $scope.getPublications = function () {
                    if ($scope.project != $scope.oldProject || $scope.year != $scope.oldYear) {
                        var results = $filter('project')($scope.data, $scope.project);

                        if (template == 'default') {
                            $scope.years = _.uniq(_.pluck(results, 'year')).sort();
                            if ($scope.years.indexOf($scope.year) < 0) {
                                $scope.year = $scope.years[$scope.years.length - 1];
                            }
                            results = $filter('year')(results, $scope.year);
                        }

                        $scope.filtered = $filter('groupBy')(results, 'extended_type');
                        $scope.oldProject = $scope.project;
                        $scope.oldYear = $scope.year;
                    }
                    return $scope.filtered;
                };

            },
            templateUrl: function (el, attrs) {
                return attrs.hasOwnProperty('template') ? attrs.template : 'default';
            }
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
    .filter('groupBy', [function () {
        return function (array, field) {
            return _.groupBy(array, function (d) {
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
        case "article_review":
            return "article_contribution";
        case "book_ed_volume":
        case "book_monograph":
        case "book_textbook":
        case "journal_series_series":
        case "journal_series_journal":
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