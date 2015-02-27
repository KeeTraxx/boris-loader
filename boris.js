$(document).ready(function () {

    $('head').append('<link rel="stylesheet" href="//keetraxx.github.io/boris-loader/boris.css" type="text/css" />');

    $.fn.iwiboris = function (callback) {
        return this.each(function(){
            var $el = $(this);

            var borisurl = $el.attr('data-boris');
            var $ul = $('<ul/>');
            $.getJSON(borisurl + '?callback=?', function (data) {
                $el.text('');
                $el.addClass('boris');
                $el.append($ul);
                data = _.sortBy(data, function(d){
                    return d.date;
                });

                _.map(data, function(publication) {
                    if (publication.type == "conference_item") {
                        publication.type = "conference";
                    }
                    publication.extended_type = publication.type + '_' + publication[publication.type + '_type'];
                    return publication;
                });

                // filter by type
                var borisfilter = $el.attr('data-boris-filter') ? new RegExp($el.attr('data-boris-filter'), 'i') : null;

                if (borisfilter) {
                    data = _.filter(data, function(publication){
                        return publication.extended_type.match(borisfilter);
                    });
                }

                // filter by project
                var projectfilter = $el.attr('data-boris-project') ? $el.attr('data-boris-project' ) : null;

                if (projectfilter) {
                    data = _.filter(data, function(publication) {
                        return _.find( publication.projects, function(project){
                            return project.id == parseInt( projectfilter );
                        });
                    })
                }

                $.each(data, function (i, publication) {

                    publication.compact_contributors = compactNames(publication.contributors).join(', ');
                    publication.compact_editors = compactNames(publication.editors).join(', ');
                    publication.compact_creators = compactNames(publication.creators).join(', ');

                    publication.year = String(publication.date).match(/2\d{3}/)[0];
                    var currentYear = new Date().getFullYear();
                    publication.yeargroup = publication.year > currentYear - 10 ? publication.year : '-' + (currentYear - 10);


                    var $li = $('<li/>');
                    $li.attr('data-year', publication.yeargroup);
                    $li.attr('data-extended_type', publication.extended_type);
                    var html = '';
                    switch (publication.extended_type) {
                        case "article_contribution":
                        case "article_journal":
                            html += _.string.sprintf('<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. <span class="publication">%s</span><span class="volume">%s</span><span class="number">%s</span><span class="pagerange">%s</span> <a href="%s">[&nbsp;link&nbsp;]</a>',
                                publication.compact_creators ? publication.compact_creators : publication.compact_contributors,
                                publication.year,
                                publication.title[0].text,
                                publication.publication + ', ',
                                publication.volume ? ' ' + publication.volume : '',
                                publication.number ? ' (' + publication.number + ')' : '',
                                publication.pagerange ? ', pp. ' + publication.pagerange + '.' : '.',
                                publication.uri
                            );
                            break;
                        case "book_contribution":
                            html += _.string.sprintf('<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. In <span class="series">%s</span> <span class="place_of_pub">%s</span><span class="publisher">%s</span> <a href="%s">[&nbsp;link&nbsp;]</a>',
                                publication.compact_creators ? publication.compact_creators : publication.compact_contributors,
                                publication.year,
                                publication.title[0].text,
                                publication.series,
                                publication.place_of_pub ? publication.place_of_pub + ': ' : '',
                                publication.publisher,
                                publication.uri
                            );
                            break;
                        case "book_ed_volume":
                        case "book_monograph":
                        case "book_textbook":
                        case "journal_series_series":
                            html += _.string.sprintf('<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. <span class="place_of_pub">%s</span><span class="publisher">%s</span> <a href="%s">[&nbsp;link&nbsp;]</a>',
                                publication.compact_creators ? publication.compact_creators : publication.compact_contributors,
                                publication.year,
                                publication.title[0].text,
                                publication.place_of_pub ? publication.place_of_pub + ': ' : '',
                                publication.publisher,
                                publication.uri
                            );
                            break;
                        case "book_section_chapter":
                        case "book_section_contribution":
                        case "book_section_encyclopedia":
                            html += _.string.sprintf('<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. In <span class="editors">%s</span>, <span class="book_title">%s</span> <span class="pagerange">%s</span> <span class="place_of_pub">%s</span><span class="publisher">%s</span>. <a href="%s">[&nbsp;link&nbsp;]</a>',
                                publication.compact_creators ? publication.compact_creators : publication.compact_contributors,
                                publication.year,
                                publication.title[0].text,
                                publication.compact_editors.length > 0 ? publication.compact_editors + (publication.editors.length > 1 ? ' (Eds.)' : ' (Ed.)') : '',
                                publication.book_title,
                                publication.pagerange ? '(pp. ' + publication.pagerange + ').' : '',
                                publication.place_of_pub ? publication.place_of_pub + ': ' : '',
                                publication.publisher,
                                publication.uri
                            );
                            break;
                        case "conference_speech":
                        case "conference_paper":
                        case "conference_abstract":
                        case "conference_undefined":
                            html += _.string.sprintf('<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. <span class="event_title">%s</span><span class="event_location">%s</span>. <a href="%s">[&nbsp;link&nbsp;]</a>',
                                publication.compact_creators ? publication.compact_creators : publication.compact_contributors,
                                publication.year,
                                publication.title[0].text,
                                publication.event_title,
                                publication.event_location ? ', ' + publication.event_location: '',
                                publication.uri
                            );
                            break;
                        case "report_report":
                            html += _.string.sprintf('<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. <span class="place_of_pub">%s</span><span class="publisher">%s</span> <a href="%s">[&nbsp;link&nbsp;]</a>',
                                publication.compact_creators ? publication.compact_creators : publication.compact_contributors,
                                publication.year,
                                publication.title[0].text,
                                publication.place_of_pub ? publication.place_of_pub + ': ' : '',
                                publication.publisher,
                                publication.uri
                            );
                            break;
                        case "thesis_dissertation":
                            html += _.string.sprintf('<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span> (Doctoral dissertation). <span class="institution">%s</span>. <a href="%s">[&nbsp;link&nbsp;]</a>',
                                publication.compact_creators ? publication.compact_creators : publication.compact_contributors,
                                publication.year,
                                publication.title[0].text,
                                publication.institution,
                                publication.uri
                            );
                            break;
                        case "magazine_article_undefined":
                            html += _.string.sprintf('<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. <span class="publication">%s</span>. <a href="%s">[&nbsp;link&nbsp;]</a>',
                                publication.compact_creators ? publication.compact_creators : publication.compact_contributors,
                                publication.year,
                                publication.title[0].text,
                                publication.publication,
                                publication.uri
                            );
                            break;
                        case "working_paper_undefined":
                            html += _.string.sprintf('<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. Working paper<span class="workingPaperNumber">%s</span><span class="publisher">%s</span>. <a href="%s">[&nbsp;link&nbsp;]</a>',
                                publication.compact_creators ? publication.compact_creators : publication.compact_contributors,
                                publication.year,
                                publication.title[0].text,
                                publication.volume ? ' No. ' + publication.volume : '',
                                publication.publisher ? ', ' + publication.publisher : '',
                                publication.uri
                            );
                            break;
                        default:
                            console.log(publication.extended_type, 'not supported yet...?', publication);
                            break;
                    }

                    $li.html(html);
                    $ul.append($li);
                });

                tree = {};

                _.map(data, function (d) {
                    tree[d.extended_type] = tree[d.extended_type] || [];
                    tree[d.extended_type].push(d);
                });

                console.log(_.uniq(_.pluck(data, 'extended_type')).sort());

                $ul = $('<ul class="yearnav"/>');
                _.map(_.compact(_.uniq(_.pluck(data, 'yeargroup'))).sort().reverse(), function (d) {
                    var $li = $('<li class="yearnav" data-show="' + d + '"><a href="#">[ ' + d + ' ]</a></li>');
                    $li.click(function (ev) {
                        ev.preventDefault();
                        var year = $(this).attr('data-show');
                        $el.find('[data-year]').hide();
                        $el.find('[data-year="' + year + '"]').show();
                    });
                    //$ul.prepend($li);
                    $('ul.level-2.open').addClass('.yearnav').append($li);
                });

                //$el.prepend($ul);

                //$('ul.level-2.open').append($ul);

                $('ul.level-2.open li.yearnav').first().click();
                if ( callback ) {
                    callback(null, data);
                }
            });
        });

    };


    // Set initial text
    $('[data-boris]').text('Loading from BORIS...');
    $('[data-boris]').iwiboris();
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
