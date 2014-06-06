$(document).ready(function(){
    $('[data-boris]').text('Loading from BORIS...');
    $('[data-boris]').iwiboris();
});
$.getScript( '//peter.unibe.ch/boris/underscore-min.js' );
//$.getScript( '//peter.unibe.ch/boris/underscore.string.min.js' );
$.fn.exists = function(){return this.length > 0;};

function compactNames(names) {
    return _.compact(_.map(names, function(d) {
        if ( d.disp_name && d.disp_name.family ) {
            return d.disp_name.family+ ( d.disp_name.given ? ', ' + d.disp_name.given[0]+'.' : '' ) ;
        } else if(d.name && d.name.family ) {
            return d.name.family + ( d.name.given ? ', ' + d.name.given[0]+'.' : '' ) ;
        }
    } ) );
}

$.fn.iwiboris = function(){

    $('head').append('<link rel="stylesheet" href="//peter.unibe.ch/boris/boris.css" type="text/css" />');
	var $el = $(this);

    var borisurl = $el.attr('data-boris');
    var $ul = $('<ul/>');
	$.getJSON(borisurl+'?callback=?',function(data){
        $('[data-boris]').text('');
        $el.addClass('boris');

        var borisfilter = $el.attr('data-boris-filter') ? new RegExp($el.attr('data-boris-filter'), 'i') : null;
        $el.append($ul);
        data.sort(dynamicSort('-date'));
	    $.each(data,function(i,publication){

            if ( publication.type == "conference_item") {
                publication.type = "conference";
            }

            publication.extended_type = publication.type +'_' + publication[publication.type+'_type'];
            if ( borisfilter && !publication.extended_type.match(borisfilter) ) {
                return;
            }

            console.log(publication.extended_type);


            publication.compact_contributors = compactNames(publication.contributors).join(', ');
            publication.compact_editors = compactNames(publication.editors).join(', ');
            publication.compact_creators = compactNames(publication.creators).join(', ');

            publication.year = String(publication.date).match(/2\d{3}/)[0];
            var currentYear = new Date().getFullYear();
            publication.yeargroup = publication.year > currentYear - 10 ? publication.year :  '-' + (currentYear - 10);


            var $li = $('<li/>');
            $li.attr('data-year', publication.yeargroup);
            $li.attr('data-extended_type', publication.extended_type);
            var html = '';
            switch(publication.extended_type) {
                case "article_contribution":
                case "article_journal":
                    html += _.string.sprintf( '<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. <span class="publication">%s</span> <span class="volume">%s</span> <span class="number">%s</span> <span class="pagerange">%s</span> <a href="%s">[&nbsp;link&nbsp;]</a>',
                        publication.compact_creators,
                        publication.year,
                        publication.title[0].text,
                        publication.publication+', ',
                        publication.volume ? publication.volume : '',
                        publication.number ? '('+publication.number+'), ' : ', ',
                        publication.pagerange,
                        publication.uri
                );
                    break;
                case "book_contribution":
                    html += _.string.sprintf( '<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. In <span class="series">%s</span> <span class="place_of_pub">%s</span><span class="publisher">%s</span> <a href="%s">[&nbsp;link&nbsp;]</a>',
                        publication.compact_creators,
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
                    html += _.string.sprintf( '<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. <span class="place_of_pub">%s</span><span class="publisher">%s</span> <a href="%s">[&nbsp;link&nbsp;]</a>',
                        publication.compact_creators,
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
                    html += _.string.sprintf( '<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. In <span class="editors">%s</span>, <span class="book_title">%s</span> <span class="pagerange">%s</span> <span class="place_of_pub">%s</span><span class="publisher">%s</span>. <a href="%s">[&nbsp;link&nbsp;]</a>',
                        publication.compact_creators,
                        publication.year,
                        publication.title[0].text,
                        publication.compact_editors.length > 0 ? publication.compact_editors + (publication.editors.length > 1 ? ' (Eds.)' : ' (Ed.)') : '',
                        publication.book_title,
                        publication.pagerange ? '(pp. '+ publication.pagerange + ').' : '',
                        publication.place_of_pub ? publication.place_of_pub + ': ' : '',
                        publication.publisher,
                        publication.uri
                    );
                    break;
                case "conference_speech":
                case "conference_paper":
                case "conference_abstract":
                    console.log(publication);
                    html += _.string.sprintf( '<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. <span class="event_title">%s</span>, <span class="event_location">%s</span>. <a href="%s">[&nbsp;link&nbsp;]</a>',
                        publication.compact_creators,
                        publication.year,
                        publication.title[0].text,
                        publication.event_title,
                        publication.event_location,
                        publication.uri
                    );
                    break;
                case "report_report":
                    html += _.string.sprintf( '<span class="authors">%s</span> (<span class="year">%s</span>). <span class="title">%s</span>. <span class="place_of_pub">%s</span><span class="publisher">%s</span> <a href="%s">[&nbsp;link&nbsp;]</a>',
                        publication.compact_creators,
                        publication.year,
                        publication.title[0].text,
                        publication.place_of_pub ? publication.place_of_pub + ': ' : '',
                        publication.publisher,
                        publication.uri
                    );
                    break;
		default:
		    console.log(publication.extended_type,'not supported yet...?',publication);
		break;
            }

            $li.html(html);

            /*

            $li.append('<span class="authors">'+contributors.join(', ')+'</span>');

            var year = String(publication.date).match(/2\d{3}/)[0];
            $li.append('<span class="year" data-year="'+(  )+'"> ('+year+')</span>. ');
            $li.append('<span class="title">'+publication.title[0].text+'</span>. ');

            if (publication.type.match(/book/) ) {
                var editors = [];
                if (publication.type == "book_section") {
                    $.each( publication.editors, function(i, editor){
                        if ( editor.name.family != null ) {
                            editors.push(editor.name.family+', ' + ( editor.name.given ? editor.name.given[0] : '' ) +'.');
                        }
                    });
                    $li.append('In <span title="book_editors">'+editors.join(', ')+' (Eds.) </span>, ');
                    $li.append('<span title="book_title">'+publication.book_title+'</span>, ');

                    publication.pagerange ? $li.append('<span title="pagerange">(pp. '+publication.pagerange+')</span>. ') : '';
                }
                publication.place_of_pub ? $li.append('<span title="place_of_pub">'+publication.place_of_pub+'</span>: ') : '';
                publication.publisher ? $li.append('<span title="place_of_pub">'+publication.publisher+'</span>. ') : '';

            } else {
                publication.event_title ? $li.append('<span title="event_title">'+publication.event_title+'</span>') : '';

                if ( publication.type.match(/conference_item|report/) ) {
                    publication.event_title && $li.append('. ');
                } else {
                    publication.event_title && $li.append(', ');
                }

                publication.publication ? $li.append(', <span title="publication">'+publication.publication+'</span>') : '';
                publication.volume ? $li.append(', <span title="volume">'+publication.volume+'</span> ') : '';
                publication.number ? $li.append('<span title="number">('+publication.number+')</span>') : '';

                publication.pagerange ? $li.append(', <span title="pagerange">('+publication.pagerange+')</span>. ') : '';
            }

            var $a = $('<a/>');
            $a.attr('href',publication.uri);
            $a.text('[link] ');
            $li.append($a);

            console.log(publication);
            */
            $ul.append($li);
	    });

        tree = {};

        _.map(data, function(d){
            tree[d.extended_type] = tree[d.extended_type] || [];
            tree[d.extended_type].push(d);
        });

        console.log( _.uniq(_.pluck(data, 'extended_type')).sort());

        //var years = [];
        $ul = $('<ul class="yearnav"/>');
        _.map(_.compact( _.uniq( _.pluck(data, 'yeargroup')) ).sort(), function(d){
            $ul.prepend('<li data-show="'+d+'"><a href="#">[ '+d+' ]</a></li>');
        });

        $el.prepend($ul);

        $('.yearnav li').click(function(ev){
            ev.preventDefault();
            var year = $(this).attr('data-show');
            $('[data-year]').hide();
            $('[data-year="'+year+'"]').show();
        }).first().click();

	});
};

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}