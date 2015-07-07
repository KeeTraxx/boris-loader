angular.module('boris-translation', ['pascalprecht.translate'])
  .config(['$translateProvider', function ($translateProvider) {

    $translateProvider.useSanitizeValueStrategy('escape');

    $translateProvider.translations('en', {
      "conference_paper": 'Conference paper',
      "conference_abstract": 'Conference abstract',
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
      "article_contribution": 'Article contribution',
      "book_ed_volume": 'Book edition volume',
      "book_section_encyclopedia": 'Encyclopedia contribution'
    });

    $translateProvider.translations('de', {
      "conference_paper": 'Konferenzbeitrag',
      "conference_abstract": 'Konferenzauszug',
      "article_journal": 'Zeitschriftenartikel',
      "book_section_chapter": 'Buchbeitrag',
      "magazine_article": 'Zeitungs- oder Magazinartikel',
      "journal_series_series": 'Zeitschriftenreihe',
      "working_paper": 'Arbeitsbericht',
      "thesis_dissertation": 'Dissertation',
      "book_monograph": 'Buch',
      "book_textbook": 'Buch',
      "report_report": 'Bericht',
      "conference_item_speech": 'Konferenzvortrag',
      "book_section_contribution": 'Buchbeitrag',
      "article_contribution": 'Zeitschriftenartikel',
      "book_ed_volume": 'Buch',
      "book_section_encyclopedia": 'Buchbeitrag'
    });

    $translateProvider.preferredLanguage('en');
  }]);