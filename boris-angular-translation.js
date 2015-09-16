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
      "thesis_dissertation": 'Dissertation',
      "book_monograph": 'Monograph',
      "book_textbook": 'Textbook',
      "report_report": 'Report',
      "conference_speech": 'Conference speech',
      "book_section_contribution": 'Book section contribution',
      "book_contribution": 'Book contribution',
      "article_contribution": 'Article contribution',
      "book_ed_volume": 'Book edition volume',
      "book_section_encyclopedia": 'Encyclopedia contribution',
      "article_review": "Article review",
      "journal_series_journal": "Journal series"
    });

    $translateProvider.translations('de', {
      "conference_paper": 'Konferenzbeitrag',
      "conference_abstract": 'Konferenzkurzbeitrag',
      "article_journal": 'Zeitschriftenartikel',
      "book_section_chapter": 'Buchkapitel',
      "magazine_article": 'Zeitungs- oder Magazinartikel',
      "journal_series_series": 'Zeitschriftenreihe',
      "working_paper": 'Arbeitsbericht',
      "thesis_dissertation": 'Dissertation',
      "book_monograph": 'Monographie',
      "book_textbook": 'Buch',
      "report_report": 'Bericht',
      "conference_speech": 'Konferenzvortrag',
      "book_section_contribution": 'Buchkapitelbeitrag',
      "book_contribution": 'Buchbeitrag',
      "article_contribution": 'Zeitschriftenbeitrag',
      "book_ed_volume": 'Sammelband',
      "book_section_encyclopedia": 'Encyclopedia contribution',
      "article_review": "Rezension",
      "journal_series_journal": "Zeitschriftenserie"
    });

    $translateProvider.preferredLanguage('en');
  }]);