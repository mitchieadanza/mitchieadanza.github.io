$(document).ready(function () {
    // create family tree
    var chart_config = {
        chart: {
            container: "#family-tree",
            rootOrientation: "NORTH",
            nodeAlign: "TOP",

            padding: 40,
            scrollbar: "resize",
            siblingSeparation: 15,

            connectors: {
                type: "step",
                style: {
                    "stroke-width": 2,
                    "stroke": "#8e8c84"
                }
            },

            node: {
                collapsable: true
            },

            animation: {
                nodeAnimation: "easeOutBounce",
                connectorsAnimation: "bounce",
                nodeSpeed: 750,
                connectorsSpeed: 500
            }
        },
        nodeStructure: rootNode
    };

    tree = new Treant(chart_config, dynamicZoom);

    // enable drag scrolling
    dragScroll();
})

function dynamicZoom() {
    window_width = $(window).width();
    tree_width = $(".chart").outerWidth();
    $("body").css("zoom", window_width / tree_width);
}
