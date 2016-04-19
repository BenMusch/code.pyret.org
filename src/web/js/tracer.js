/* A simple call-graph viewer. */
/* Licensed under GPL3 */
/* Derivative of: https://bl.ocks.org/mbostock/4339083 */
/* Justin Pombrio (2016) */

"use strict";

var MARGIN = {top: 20, right: 120, bottom: 20, left: 120};
var WIDTH = 960 - MARGIN.right - MARGIN.left;
var HEIGHT = 800 - MARGIN.top - MARGIN.bottom;
var DURATION = 750;

var ROOT;
var NEXT_ID = 0;
var SVG;

var TREE_LAYOUT = d3.layout.tree()
    .nodeSize([20, 20])
    .separation(function(a, b) { return 1; });

var DIAGONAL = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

function load_log() {
    return LOG;
}

function init() {

    function log_to_tree(root, log) {
        var tree = root;
        
        function inject_child(child) {
            child._parent = tree;
            if (tree.children) {
                tree.children.push(child);
            } else {
                tree.children = [child];
            }
            tree = child;
        }

        function withdraw_to_parent() {
            var parent = tree._parent;
            delete tree._parent;
            tree = parent;
        }
        
        log.forEach(function(event) {
            if (event.type == "CALL") {
                var label = event.func + "(" + event.args.join(", ") + ")";
                inject_child({"call_string": label});
            } else if (event.type == "RETURN") {
                tree.label = tree.call_string +
                    " -> " + event.value + "(" + event.id + ")"
                delete tree.call_string;
                withdraw_to_parent();
            } else if (event.type == "ENTER") {
                inject_child({"label": event.loc});
            } else if (event.type == "EXIT") {
                withdraw_to_parent();
            } else {
                throw "Tracer: invalid tracing log";
            }
        });
        return root;
    }

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }
    
    
    var log = load_log();
    ROOT = log_to_tree({label: "Program"}, log);

    SVG = d3.select("body").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g");

    ROOT.x0 = HEIGHT / 2;
    ROOT.y0 = 0;
    update(ROOT);
    
    var offset = Math.round(SVG.node().getBBox().y);
    SVG.attr("transform", "translate(" +
             MARGIN.left + "," +
             (MARGIN.top + offset) + ")");
            
    //  ROOT.children.forEach(collapse);
};

init();

function update(source) {

    // Compute the new tree layout.
    var nodes = TREE_LAYOUT.nodes(ROOT).reverse(),
        links = TREE_LAYOUT.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = SVG.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++NEXT_ID); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click);

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
        .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .text(function(d) { return d.label; })
        .style("font-family", "Monospace")
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(DURATION)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(DURATION)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = SVG.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return DIAGONAL({source: o, target: o});
        });

    // Transition links to their new position.
    link.transition()
        .duration(DURATION)
        .attr("d", DIAGONAL);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(DURATION)
        .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return DIAGONAL({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}
