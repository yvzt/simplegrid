// Import SimpleGrid class
import SimpleGrid from "./simplegrid.js";

/* 
  Example 1: 
    This example generates a grid and parses into an SVG.

*/

// Add settings
const settings = {
  geometry: { xmin: 100, ymin: 100, width: 500, height: 500 },
  boundingRectangle: {
    style: "fill:none; stroke:#000000; stroke-width:2",
  },
  origin: { type: "set", x: 350, y: 350 },
  axes: {
    stroke: "#FF0000",
    "stroke-width": 2,
  },
  majorLines: {
    configuration: {
      distance: 50,
      skipBoundary: true,
      skipOrigin: true,
    },
    attributes: {
      stroke: "#00FF00",
      "stroke-width": 1,
    },
  },
  minorLines: {
    configuration: {
      number: 4,
      distance: 50,
    },
    attributes: {
      stroke: "#0000FF",
      "stroke-width": 0.1,
      "stroke-dasharray": "4 1",
    },
  },
};

// Create grid
const aGrid = new SimpleGrid(settings.geometry);
aGrid.origin(settings.origin);

// Create svg
const svg = getNode("svg", { width: 700, height: 700 });

// Draw bounding rectangle
const boundingRectangle = getNode("rect", {
  ...aGrid.boundingRectangle(),
  ...settings.boundingRectangle,
});

// Draw axes in red
const axes = aGrid.axes();
for (const a in axes) {
  svg.append(
    getNode("line", {
      x1: axes[a][0],
      y1: axes[a][1],
      x2: axes[a][2],
      y2: axes[a][3],
      ...settings.axes,
    })
  );
}

// Draw major lines, skipping ends and origin
const majorLines = aGrid
  .majorLines({ ...settings.majorLines.configuration, direction: "x" })
  .concat(
    aGrid.majorLines({ ...settings.majorLines.configuration, direction: "y" })
  );
for (const a of majorLines) {
  svg.append(
    getNode("line", {
      x1: a[0],
      y1: a[1],
      x2: a[2],
      y2: a[3],
      ...settings.majorLines.attributes,
    })
  );
}

// Draw minor lines, 2 at each interval
const minorLines = aGrid
  .minorLines({ ...settings.minorLines.configuration, direction: "x" })
  .concat(aGrid.minorLines({ ...settings.minorLines.configuration, direction: "y" }));
for (const a of minorLines) {
  svg.append(
    getNode("line", {
      x1: a[0],
      y1: a[1],
      x2: a[2],
      y2: a[3],
      ...settings.minorLines.attributes,
    })
  );
}

// Append svg to the document
svg.append(boundingRectangle);
document.getElementById("container").append(svg);

/*
  Example 2: 
  This example uses SVGGROUP static function to generate a grid 
  through a settings2 object parsed into a SVG group. 
  Some transformation is applied to the returned group node 
  through its transform attribute.
*/
const svg2 = getNode("svg", { width: 700, height: 700 });
const gridGroup = SimpleGrid.svgGroup(settings);
gridGroup.setAttributeNS(null, "transform", "scale(0.5) rotate(-5)");
svg2.append(gridGroup);
document.getElementById("container2").append(svg2);

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
