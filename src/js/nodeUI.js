/*global Viva, svgOps*/
/*jslint sloppy: true vars:true*/

/* namespace graphUI */
/* import 'svgOperations.js' */

function getLogoUI(company) {
    var ui = Viva.Graph.svg('g'),
        fillColor = company.revenue > 0 ? 'rgb(88,88,90)' : 'rgb(193,39,45)',
        rect = Viva.Graph.svg('rect')
                .attr('rx', 10)
                .attr('ry', 10)
                .attr('width', company.weight)
                .attr('height', company.weight)
                .attr('style', 'fill:' + fillColor),
        logo = svgOps.getSvgLogo(company.name, company.weight);

    ui.append(rect);
    if (logo) {
        ui.appendChild(logo);
    }
    ui.sizeY = ui.sizeX = company.weight;

    return ui;
}

function getEdgeCommentUI(commentText) {
    var ui = Viva.Graph.svg('g'),
        svgText = svgOps.convertToSvgText(commentText),
        rect = Viva.Graph.svg('rect')
                .attr('rx', 10)
                .attr('ry', 10)
                .attr('width', 0)
                .attr('height', 0)
                .attr('style', 'fill: rgba(255,255,255,0.7);stroke-width:1;stroke:rgb(174,174,174)');
    ui.rect = rect;
    ui.append(rect);
    ui.appendChild(svgText);

    return ui;
}

/* export buildNodeUI */
/**
 * Constructs SVG UI for a given node. A node type is determined by its 'data' attribute
 * Currently there are only two types: an edge comment and a company logo.
 */
function buildNodeUI(node) {
    var data = node.data;
    if (data.weight) {
        return getLogoUI(data);
    }
    if (data.comment) {
        return getEdgeCommentUI(data.comment);
    }
}

/* export placeNode */
/** 
 * A simple callback to update node's position
 */
function placeNode(nodeUI, pos) {
    if (typeof nodeUI.sizeX === 'undefined') {
        var bbox = nodeUI.getBBox();
        nodeUI.sizeX = bbox.width;
        nodeUI.sizeY = bbox.height;
        nodeUI.rect.attr('width', bbox.width + 6).attr('height', bbox.height + 3);
    }

    nodeUI.attr('transform',
                'translate(' +
                      (pos.x - nodeUI.sizeX / 2) + ',' + (pos.y - nodeUI.sizeY / 2) +
                ')');
}