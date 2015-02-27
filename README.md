boris-loader
============

Display from publication database BORIS

Usage
-----
Include this HTML javascript snippet somewhere onto your page.
    <dtml-let html="readhtml2('http://cdn.rawgit.com/keetraxx/boris-loader/zms3/boris-dev.html')"><dtml-var html></dtml-var></dtml-let>
    <div data-boris="//boris.unibe.ch/cgi/exportview/divisions/DCD5A442BB9CE17DE0405C82790C4DE2/JSON/DCD5A442BB9CE17DE0405C82790C4DE2.js"></div>

Point the `data-boris` attribute to your publications (in json).

Important Information
---------------------
You need to insert the snipped in HTML mode!

![alt tag](//raw.github.com/keetraxx/boris-loader/zms3/help.png)
