// Import SimpleGrid class
import SimpleGrid from "./simplegrid.js";

// Add settings
const settings = {
  boundingRectangle: {
    geometry: { xmin: 100, ymin: 100, width: 500, height: 500 },
    style: "fill:none; stroke:#000000; stroke-width:2"
  },
  axes: {
    stroke:"#FF0000",
    "stroke-width":2,
  },
  majorLines:{
    stroke:"#00FF00",
    "stroke-width":1,
  },
  minorLines:{
    stroke:"#0000FF",
    "stroke-width":0.1,
  }  
};

// Create grid
const aGrid = new SimpleGrid(...Object.values(settings.boundingRectangle.geometry));
aGrid.setOrigin({ x: 350, y: 350 });

// Create svg
const svg = getNode("svg", { width: 700, height: 700 });

// Draw bounding rectangle
const boundingRectangle = getNode("rect", {
  ...aGrid.getBoundingRectangle(),
  style: settings.boundingRectangle.style,
});

// Draw axes in red
const axes = aGrid.getAxes();
for (const a of axes){
  svg.append(getNode("line", {x1: a[0], y1: a[1], x2: a[2], y2: a[3],...settings.axes}));
}

// Draw major lines, skipping ends and origin
const majorLines = aGrid.getMajorLines(50, true, true).concat(aGrid.getMajorLines(50, true, true, "y"));
for (const a of majorLines){
  svg.append(getNode("line", {x1: a[0], y1: a[1], x2: a[2], y2: a[3],...settings.majorLines}));
}

// Draw minor lines, 2 at each interval
const minorLines = aGrid.getMinorLines(4,50).concat(aGrid.getMinorLines(4,50,"y"));
for (const a of minorLines){
  svg.append(getNode("line", {x1: a[0], y1: a[1], x2: a[2], y2: a[3],...settings.minorLines}));
}

// Append svg to the document
svg.append(boundingRectangle);
document.getElementById("container").append(svg);

/*
  GETNODE
  Creates an svg node with attributes provided. 
  Input: 
  n: Name of the node, string , e.g. "svg", "g", "path", ...
  v: Attributes object, e.g. {width:100, height:100, style:"fill:none"}
  Output: 
  svg node object.
*/
function getNode(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v)
    n.setAttributeNS(
      null,
      p.replace(/[A-Z]/g, function (m, p, o, s) {
        return "-" + m.toLowerCase();
      }),
      v[p]
    );
  return n;
}
