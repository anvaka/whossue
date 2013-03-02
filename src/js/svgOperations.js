/* namespace svgOps */
/* import 'logos.js' */

/*global DOMParser, alert */
/*global data */
/*jslint sloppy: true plusplus: true */

var namespace = 'xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"';

function parseSvgText(svgText) {
    var parser = new DOMParser();

    try {
        return parser.parseFromString(svgText, "text/xml").documentElement;
    } catch (e) {
        alert('cannot parse svg text: ' + svgText);
        throw e;
    }
}

/* export getSvgLogo */
/**
 * For a given company name gets an SVG logo. If the company name is not known
 * an undefined value is returned.
 */
function getSvgLogo(name, size) {
    var logoDetails = data.getLogoDetails(name, size);
    if (logoDetails) {
        return parseSvgText(['<g ' + namespace + ' transform="',
                'scale(' + logoDetails.scale + ') ',
                'translate(' + logoDetails.tx + ',' + logoDetails.ty + ')">',
                '<path style="fill:#ffffff;fill-rule:evenodd" d="' + logoDetails.d + '"/>',
                '</g>'
                ].join('')
            );
    }
}

/* export convertToSvgText */
/**
 * Transforms plain text with new lines (\n) into multilined SVG text 
 */
function convertToSvgText(text) {
    var textContent = text.replace('&', '&amp;').split('\n'),
        svgContent = [],
        increment = 11,
        i;
    svgContent.push('<g ' + namespace + '>');
    svgContent.push('<text x="0" y="0" style="font-size:8pt;">');
    for (i = 0; i < textContent.length; ++i) {
        svgContent.push('<tspan x="6" y="' +  (i + 1) * increment + '">' + textContent[i] + '</tspan>');
    }
    svgContent.push('</text>');
    svgContent.push('</g>');

    return parseSvgText(svgContent.join(''));
}