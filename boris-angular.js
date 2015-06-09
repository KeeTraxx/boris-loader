angular.module('boris-loader', [])
    .directive('boris', function ($http, $window) {
        return {
            link: function ($scope, el, attrs) {
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

                    console.log($scope.years, $scope.year);


                }).error(function (err) {

                });

                $scope.setYear = function(year) {
                    $scope.year = year;
                }
            },
            template: '<ul><li ng-repeat="y in years | reverse"><a href="" ng-click="setYear(y)">[ {{y}} ]</a></li></ul>{{year}}' +
            '<ul><li data-type="{{publication.extended_type}}" ng-repeat="publication in publications = (data | project: project | year: year)" ng-include="publication.template"></li></ul>'
        }
    })
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
    .run(function ($templateCache) {
        $templateCache.put('conference_item_paper',
            '<span class="authors">{{publication.compact_creators || publication.compact_contributors}}</span> ' +
            '<span class="year">({{publication.year}})</span>. ' +
            '<span class="title">{{publication.title[0].text}}</span>. ' +
            '<span class="publication" ng-show="publication.publication">{{publication.publication}}</span><span ng-show="publication.publication">, </span>' +
            '<span class="volume" ng-show="publication.volume">{{publication.volume}}</span> ' +
            '<span class="number" ng-show="publication.number">({{publication.number}})</span> ' +
            '<span class="pagerange" ng-show="publication.pagerange">pp. {{publication.pagerange}}.</span> ' +
            '<a href="{{publication.uri}}">[&nbsp;link&nbsp;]</a>');

        $templateCache.put('article_contribution',
            '<span class="authors">{{publication.compact_creators || publication.compact_contributors}}</span> ' +
            '<span class="year">({{publication.year}})</span>. ' +
            '<span class="title">{{publication.title[0].text}}</span>. ' +
            '<span class="publication" ng-show="publication.publication">{{publication.publication}}</span><span ng-show="publication.publication">, </span>' +
            '<span class="volume" ng-show="publication.volume">{{publication.volume}}</span>' +
            '<span class="number" ng-show="publication.number">({{publication.number}})</span>' +
            '<span class="pagerange" ng-show="publication.pagerange">pp. {{publication.pagerange}}</span> ' +
            '<a href="{{publication.uri}}">[&nbsp;link&nbsp;]</a>');


        $templateCache.put('book_contribution',
            '<span class="authors">{{publication.compact_creators || publication.compact_contributors}}</span> ' +
            '<span class="year">({{publication.year}})</span>. ' +
            '<span class="title">{{publication.title[0].text}}</span>. ' +
            'In <span class="series">{{publication.series}}</span> ' +
            '<span class="place_of_pub" ng-show="publication.place_of_pub">{{publication.place_of_pub}}</span> ' +
            '<span class="publisher" ng-show="publication.publisher">{{publication.publisher}}</span> ' +
            '<a href="{{publication.uri}}">[&nbsp;link&nbsp;]</a>');

        $templateCache.put('book_ed_volume',
            '<span class="authors">{{publication.compact_creators || publication.compact_contributors}}</span> ' +
            '<span class="year">({{publication.year}})</span>. ' +
            '<span class="title">{{publication.title[0].text}}</span>. ' +
            '<span class="place_of_pub" ng-show="publication.place_of_pub">{{publication.place_of_pub}}</span> ' +
            '<span class="publisher" ng-show="publication.publisher">{{publication.publisher}}</span> ' +
            '<a href="{{publication.uri}}">[&nbsp;link&nbsp;]</a>');

        $templateCache.put('book_section_chapter',
            '<span class="authors">{{publication.compact_creators || publication.compact_contributors}}</span> ' +
            '<span class="year">({{publication.year}})</span>. ' +
            '<span class="title">{{publication.title[0].text}}</span>. ' +
            '<span ng-show="publication.editors.length > 0">In <span class="editors">{{publication.compact_editors}} Ed{{publication.editors.length > 1 ? \'s\':\'\'}}.</span>,</span> ' +
            '<span class="book_title">{{publication.book_title}}</span> ' +
            '<span class="pagerange" ng-show="publication.pagerange">pp. {{publication.pagerange}}</span> ' +
            '<span class="place_of_pub" ng-show="publication.place_of_pub">{{publication.place_of_pub}}</span> ' +
            '<span class="publisher" ng-show="publication.publisher">{{publication.publisher}}</span> ' +
            '<a href="{{publication.uri}}">[&nbsp;link&nbsp;]</a>');

        $templateCache.put('conference_speech',
            '<span class="authors">{{publication.compact_creators || publication.compact_contributors}}</span> ' +
            '<span class="year">({{publication.year}})</span>. ' +
            '<span class="title">{{publication.title[0].text}}</span>. ' +
            '<span class="event_title">{{publication.event_title}}</span> ' +
            '<span class="event_location" ng-show="publication.event_location">{{publication.event_location}}</span>. ' +
            '<a href="{{publication.uri}}">[&nbsp;link&nbsp;]</a>');


        $templateCache.put('report_report',
            '<span class="authors">{{publication.compact_creators || publication.compact_contributors}}</span> ' +
            '<span class="year">({{publication.year}})</span>. ' +
            '<span class="title">{{publication.title[0].text}}</span>. ' +
            '<span class="place_of_pub" ng-show="publication.place_of_pub">{{publication.place_of_pub}}</span> ' +
            '<span class="publisher" ng-show="publication.publisher">{{publication.publisher}}</span> ' +
            '<a href="{{publication.uri}}">[&nbsp;link&nbsp;]</a>');

        $templateCache.put('thesis_dissertation',
            '<span class="authors">{{publication.compact_creators || publication.compact_contributors}}</span> ' +
            '<span class="year">({{publication.year}})</span>. ' +
            '<span class="title">{{publication.title[0].text}}</span> ' +
            '(Doctoral dissertation). ' +
            '<span class="institution">{{publication.institution}}</span>. ' +
            '<a href="{{publication.uri}}">[&nbsp;link&nbsp;]</a>');

        $templateCache.put('magazine_article',
            '<span class="authors">{{publication.compact_creators || publication.compact_contributors}}</span> ' +
            '<span class="year">({{publication.year}})</span>. ' +
            '<span class="title">{{publication.title[0].text}}</span>. ' +
            '<span class="publication.publication" ng-show="publication.publication">{{publication.publication}}</span> ' +
            '<a href="{{publication.uri}}">[&nbsp;link&nbsp;]</a>');

        $templateCache.put('working_paper',
            '<span class="authors">{{publication.compact_creators || publication.compact_contributors}}</span> ' +
            '<span class="year">({{publication.year}})</span>. ' +
            '<span class="title">{{publication.title[0].text}}</span>. ' +
            'Working paper <span class="workingPaperNumber" ng-show="publication.volume">{{publication.volume}} </span>' +
            '<span class="publisher" ng-show="publication.publisher">, {{publication.publisher}}</span>. ' +
            '<a href="{{publication.uri}}">[&nbsp;link&nbsp;]</a>');


    });


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