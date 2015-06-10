angular.module('boris-tpl',[]).run(function ($templateCache) {
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