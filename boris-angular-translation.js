angular.module('boris-translation', ['pascalprecht.translate'])
    .config(['$translateProvider', function ($translateProvider) {

        $translateProvider.useSanitizeValueStrategy('escape');

        $translateProvider.translations('en', {
            "conference_item_paper" : 'Conference paper',
            "conference_item_abstract": 'Conference abstract',
            "article_journal": 'Journal article',
            "book_section_chapter": 'Book chapter',
            "magazine_article": 'Magazine article',
            "journal_series_series": 'Journal series',
            "working_paper": 'Working paper',
            "thesis_dissertation": 'Dissertation or thesis',
            "book_monograph": 'Book monograph',
            "book_textbook": 'Book textbook',
            "report_report": 'Report',
            "conference_item_speech": 'Conference speech',
            "book_section_contribution": 'Book section contribution',
            "book_contribution": 'Book contribution',
            "article_contribution": 'Article contribution',
            "book_ed_volume": 'Book edition volume',
            "book_section_encyclopedia": 'Encyclopedia contribution'
        });

        $translateProvider.preferredLanguage('en');
    }]);