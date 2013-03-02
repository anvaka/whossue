/*global Viva, graphUI, companiesModel*/
/*jslint sloppy: true vars: true*/

/* namespace whossue */
/* import 'nodeUI.js' */
/* import 'linkUI.js' */
/* import 'companiesModel.js' */

/* export run */
/**
 * Entry point to the visualization. Initializes vivagraph and fills in the data.
 */
function run() {
    var graph = Viva.Graph.graph(),
        graphics = Viva.Graph.View.svgGraphics(),
        layout = Viva.Graph.Layout.forceDirected(graph, {
            springLength : 80,
            springCoeff : 0.0002,
            dragCoeff : 0.02,
            gravity : -1.2
        }),
        renderer = Viva.Graph.View.renderer(graph, {
            graphics : graphics,
            layout : layout,
            prerender: 0
        });

    // Run the renderer first, to initialize physicial forces.
    renderer.run();

    // Now setup nodes/edges appearance
    var linkMaker = graphUI.createLinkMaker(graphics.getSvgRoot(), graph);
    graphics.link(linkMaker.createLink).placeLink(linkMaker.placeLink);
    graphics.node(graphUI.buildNodeUI).placeNode(graphUI.placeNode);

    companiesModel.fillGraph(graph);

    graph.forEachLink(function (link) {
        if (link.data.relaxed) {
            link.force_directed_spring.coeff = 0.000003;
        }
    });
}

global.whossue = whossue;