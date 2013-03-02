/*globals Viva */
/*jslint sloppy: true vars: true white: true*/

/*namespace graphUI */

var linkOffsets = {}, // for multiple links store their offsets

    createMarker = function (id, fillColor) {
        return Viva.Graph.svg('marker')
               .attr('id', id)
               .attr('viewBox', "0 0 10 10")
               .attr('refX', "8")
               .attr('refY', "5")
               .attr('markerUnits', "strokeWidth")
               .attr('markerWidth', "10")
               .attr('markerHeight', "5")
               .attr('orient', "auto")
               .attr('style', "fill:" + fillColor);
    };

var geom = Viva.Graph.geom();

/* export createLinkMaker */
/**
 * Link maker is a factory method to build and manage links positions.
 * Links (edges) on this visualization are quite sophisticated:
 *  - They have arrows on their heads
 *  - Two links between same nodes are allowed.
 */
function createLinkMaker(svgRoot, graph) {
    var registeredColors = {},
        defs = svgRoot.append('defs'),

        linkOffsets = {}, // for multiple links store their offsets
        makeArrow = function (fillColorHex) {
            var defKey = 'id' + fillColorHex.slice(1), // remove leaing '#' character.
                marker;

            if (!registeredColors.hasOwnProperty(defKey)) {
                marker = createMarker(defKey, fillColorHex);
                defs.append(marker);
                marker.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');

                registeredColors[defKey] = true;
            }

            return Viva.Graph.svg('path')
                       .attr('stroke', fillColorHex)
                       .attr('stroke-width', '2')
                       .attr('marker-end', 'url(#' + defKey + ')');
        };
    return {
        createLink : function (link) {
            var to = graph.getNode(link.toId),
                from = graph.getNode(link.fromId),
                isComment = !!(to.data.comment || from.data.comment),
                ui,
                invariantKey;
            if (isComment) {
                // this is fake link to hold comments closer to
                // the related edge:
                ui = Viva.Graph.svg('g');
                ui.hidden = true;
            } else {
                if (link.data.isInprocess) {
                    ui = makeArrow('#58585A');
                } else {
                    ui = makeArrow('#ABABAC').attr('stroke-dasharray', '2,2');
                }
                invariantKey = link.fromId < link.toId ? link.fromId + link.toId : link.toId + link.fromId;
                if (linkOffsets.hasOwnProperty(invariantKey)) {
                    // links are going in opposite direction, thus
                    // setting both to 4 gives total of 8 points in distance
                    // between them
                    linkOffsets[invariantKey].offset = 4;
                    link.data.offset = 4;
                } else {
                    link.data.offset = 0;
                    linkOffsets[invariantKey] = link.data;
                }
            }
            ui.data = link;
            return ui;
        },

        placeLink : function (linkUI, fromPos, toPos) {
            if (linkUI.hidden) { return; }
            if (!linkUI.sizes) {
                var fromUI = graph.getNode(linkUI.data.fromId).ui,
                    toUI =  graph.getNode(linkUI.data.toId).ui;
                linkUI.sizes = {
                    from : { w : fromUI.sizeX / 2 + 4, h : fromUI.sizeY / 2 + 4 },
                    to : { w : toUI.sizeX / 2 + 4, h : toUI.sizeY / 2 + 4}
                };
            }
            var dx = fromPos.x - toPos.x,
                dy = fromPos.y - toPos.y,
                alpha = Math.atan2(dy, dx) - Math.PI / 2,
                offset = linkUI.data.data.offset,
                ox = Math.cos(alpha) * offset,
                oy = Math.sin(alpha) * offset,
                from = geom.intersectRect(
                    // rectangle:
                        fromPos.x - linkUI.sizes.from.w, // left
                        fromPos.y - linkUI.sizes.from.h, // top
                        fromPos.x + linkUI.sizes.from.w, // right
                        fromPos.y + linkUI.sizes.from.h, // bottom
                    // segment:
                        fromPos.x + ox, fromPos.y + oy, toPos.x + ox, toPos.y + oy)
                       || fromPos; // if no intersection found - return center of the node

            var to = geom.intersectRect(
                    // rectangle:
                        toPos.x - linkUI.sizes.to.w, // left
                        toPos.y - linkUI.sizes.to.h, // top
                        toPos.x + linkUI.sizes.to.w, // right
                        toPos.y + linkUI.sizes.to.h, // bottom
                    // segment:
                        toPos.x + ox, toPos.y + oy, fromPos.x + ox, fromPos.y + oy) 
                        || toPos; // if no intersection found - return center of the node
                        
            var data = 'M' + from.x + ',' + from.y +
                       'L' + to.x + ',' + to.y;
            
            linkUI.attr("d", data);
        }
    };
}