/*jslint sloppy: true, plusplus: true */
/* namespace companiesModel */

var companies = [
        { name: 'oracle', revenue: 1, weight: 64  },
        { name: 'google', revenue: 1, weight: 61  },
        { name: 'apple', revenue: 1, weight: 80  },
        { name: 'htc', revenue: 1, weight: 27  },
        { name: 'elan', revenue: -1, weight: 18 },
        { name: 'motorola', revenue: -1, weight: 58 },
        { name: 'microsoft', revenue: 1, weight: 99  },
        { name: 'rim', revenue: 1, weight: 48  },
        { name: 'kodak', revenue: -1, weight: 38 },
        { name: 'sonyericsson', revenue: -1, weight: 35 },
        { name: 'samsung', revenue: 1, weight: 135 },
        { name: 'lg', revenue: 1, weight: 127 },
        { name: 'nokia', revenue: -1, weight: 93 },
        { name: 'qualcomm', revenue: -1, weight: 40 },
        { name: 'hitachi', revenue: -1, weight: 63 },
        { name: 'sharp', revenue: -1, weight: 66 }
    ],
    lawSuites = [
        { who: 'oracle', whom: 'google',  note: 'Illegal use\nof Java', inProcess: 1 },
        { who: 'google', whom: 'htc', note: 'Google is\nbacking\nHTC', inProcess: 1 },
        { who: 'apple', whom: 'htc', note: 'Over 20\nsoftware\npatents', inProcess: 1 },
        { who: 'elan', whom: 'apple', note: 'touch\nscreen\npatents', inProcess: 1 },
        { who: 'motorola', whom: 'apple', note: 'Over 18 patent\ninfringements', inProcess: 1 },
        { who: 'microsoft', whom: 'motorola', note: 'Over 9\npatents\ninc: email\ncontacts,\nmeeting\nscheduler', inProcess: 1 },
        { who: 'rim', whom: 'motorola', note: 'anti-competitive\npractices\n& patents', inProcess: 0 },
        { who: 'kodak', whom: 'apple', note: 'image previews,\ncomputer based\nimaging tasks', inProcess: 1 },
        { who: 'kodak', whom: 'rim', note: 'image previews,\ncomputer based\nimaging tasks', inProcess: 1 },
        { who: 'kodak', whom: 'sonyericsson', note: 'the creating\nof electronic\ncameras\nthat store\nimages\ndigitally', inProcess: 1 },
        { who: 'kodak', whom: 'samsung', note: 'image storage\nand movie previews', inProcess: 0 },
        { who: 'kodak', whom: 'lg', note: '?', inProcess: 0 },
        { who: 'sonyericsson', whom: 'kodak', note: 'Over the\nhandling of\ndigital images', inProcess: 1 },
        { who: 'nokia', whom: 'apple', note: '2g 3g & wifi\non the phones', inProcess: 1 },
        { who: 'nokia', whom: 'hitachi', note: 'LCD price\nfixing', inProcess: 1 },
        { who: 'nokia', whom: 'sharp', note: 'more LCD\nprice fixing', inProcess: 1 },
        { who: 'nokia', whom: 'lg', note: 'yep LCD\nprice fixing', inProcess: 1 },
        { who: 'nokia', whom: 'qualcomm', note: 'anti-competitive\npractices & patents\non mobile downloads', inProcess: 0 },
        { who: 'qualcomm', whom: 'nokia', note: '3G tech', inProcess: 0 },
        { who: 'apple', whom: 'nokia', note: 'wireless data,\nspeech coding\n& security', inProcess: 1 }
    ];

/* export fillGraph */
function fillGraph(graph) {
    var i, company, suit,
        addSuit = function (who, whom, comment, isInprocess) {
            var commentKey = who + whom;
            graph.addNode(commentKey, { comment: comment });
            graph.addLink(who, whom, { isInprocess : isInprocess, relaxed: 1});
            graph.addLink(who, commentKey, { relaxed: 0 });
            graph.addLink(commentKey, whom, { relaxed: 0 });
        };

    graph.beginUpdate();
    for (i = 0; i < companies.length; ++i) {
        company = companies[i];
        graph.addNode(company.name, company);
    }
    for (i = 0; i < lawSuites.length; ++i) {
        suit = lawSuites[i];
        addSuit(suit.who, suit.whom, suit.note, suit.inProcess);
    }
    graph.endUpdate();
}
