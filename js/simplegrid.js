/*
  SIMPLEGRID : A simple horizontal 2D grid class
*/

class SimpleGrid {
  /* 
    CONSTRUCTOR:
      xmin: x-component of the starting point,
      ymin: y-component of the starting point,
      width: width of the grid,
      height: height of the grid
  */
  constructor(settings = { xmin: 0, ymin: 0, width: 100, height: 100 }) {
    this.xmin = settings.xmin;
    this.ymin = settings.ymin;
    this.width = settings.width;
    this.height = settings.height;
    this.xmax = this.xmin + this.width;
    this.ymax = this.ymin + this.height;
    this.originSet = false;
  }

  /* 
    GETBOUNDINGRECTANGLE:
      Returns the bounding rectangle
      Output: 
        Object {x: ___, y: ___, width: ____, height: ____}
  */
  boundingRectangle() {
    return {
      x: this.xmin,
      y: this.ymin,
      width: this.width,
      height: this.height,
    };
  }

  /* 
    ORIGIN:
      Sets the origin to (x,y) given as an object with keys x & y according to
      type given with the key "type"

      type = "set", sets the origin to x & y defined. 
      type = "anchor", sets the origin according to proportions given by x & y. 
      e.g. x: 0.5 means midpoint in x. 
      
      Input: 
        origin: Object {type: "set"/"anchor", x: ____, y:____}

  */
  origin(origin) {
    if (origin.hasOwnProperty("type")) {
      if (origin.type === "set") {
        if (origin.hasOwnProperty("x") && origin.hasOwnProperty("y")) {
          this.originSet = true;
          this.origin = { x: origin.x, y: origin.y };
        }
      } else if (origin.type === "anchor") {
        if (origin.hasOwnProperty("x") && origin.hasOwnProperty("y")) {
          this.originSet = true;
          this.origin = {
            x: this.xmin + origin.x * this.width,
            y: this.ymin + origin.y * this.height,
          };
        }
      }
    }
  }

  /* 
    GETAXES:
      Returns the end point coordinates of the axes if the origin is set.
    Output: 
      If the origin is set with setOrigin or anchorOrigin methods. 
        [horizontal axis end coordinates, vertical axis end coordinates]
        and each of the end coordinates arrays have four elements in the 
        form [x_start, y_start, x_end, y_end]
      else, 
        null
  */
  axes() {
    if (this.originSet) {
      return {
        x: [this.xmin, this.origin.y, this.xmax, this.origin.y],
        y: [this.origin.x, this.ymin, this.origin.x, this.ymax],
      };
    } else {
      return null;
    }
  }

  /*
    MAJORS:
      Creates and array of values inside the bounding rectangle if "x"
      or "y" direction separated by a distance value. Starts computing
      values from one end to the other end in the desired direction and 
      can skip values at the ends and axes passing through the origin 
      if a value at these locations are computed.
      Input: 
        distance: distance between adjacent major lines. 
        skipBoundary: skips the boundaries if true.
        skipOrigin: skips the major line passing through the origin if 
        a value is computed in the neighborhood of the origin.
        direction: (default is x) direction of the values to be computed. 
  */
  majors(
    settings = {
      distance: 10,
      skipBoundary: false,
      skipOrigin: false,
      direction: "x",
    }
  ) {
    const xmajor = [];
    let x = settings.direction === "x" ? this.xmin : this.ymin;
    let rshift = 0;
    if (settings.skipBoundary) {
      rshift = -1;
    } else {
      xmajor.push(x);
    }
    for (
      let i = 0;
      i <
      (settings.direction === "x" ? this.width : this.height) / settings.distance + 10;
      i++
    ) {
      x += settings.distance;
      if (x > (settings.direction === "x" ? this.xmax : this.ymax) + rshift)
        break;
      if (this.originSet) {
        if (
          Math.abs(
            x - (settings.direction === "x" ? this.origin.x : this.origin.y)
          ) < 1 &&
          settings.skipOrigin
        ) {
          continue;
        }
      }
      xmajor.push(x);
    }
    return xmajor;
  }

  /*
    MINORS:
      Creates and array of the locations minor lines that are
      evenly spaced between adjacent major lines at a specified number.
      Input: 
        number: number of minor lines to be located on an interval
        between two adjacent major lines. 
        distance: distance between adjacent major lines. 
        skipBoundary: skips the boundaries if true.
        direction: (default is x) direction of the values to be computed. 
  */
  minors(settings = { number: 1, distance: 10, direction: "x" }) {
    const xmajor = this.majors({
      distance: settings.distance,
      skipBoundary: false,
      skipOrigin: false,
      direction: settings.direction,
    });
    const xminor = [];
    const dx = settings.distance / (settings.number + 1);
    for (let i = 0; i < xmajor.length - 1; i++) {
      for (let j = 0; j < settings.number; j++) {
        xminor.push(xmajor[i] + (j + 1) * dx);
      }
    }
    return xminor;
  }

  /*
    MAJORLINES:
      End points of major lines whose locations are determined by 
      getMajors function.
      Input: 
        distance: distance between adjacent major lines. 
        skipBoundary: skips the boundaries if true.
        skipOrigin: skips the major line passing through the origin if 
        a value is computed in the neighborhood of the origin.
        direction: (default is x) direction of the values to be computed. 
  */
  majorLines(
    settings = {
      distance: 10,
      skipBoundary: false,
      skipOrigin: false,
      direction: "x",
    }
  ) {
    const majors = this.majors({
      distance: settings.distance,
      skipBoundary: settings.skipBoundary,
      skipOrigin: settings.skipOrigin,
      direction: settings.direction,
    });
    const lines = [];
    for (let i = 0; i < majors.length; i++) {
      if (settings.direction === "x") {
        lines.push([majors[i], this.ymin, majors[i], this.ymax]);
      } else if (settings.direction === "y") {
        lines.push([this.xmin, majors[i], this.xmax, majors[i]]);
      }
    }
    return lines;
  }

  /*
    MINORLINES:
      End points of minor lines whose locations are determined by 
      getMinors function.
      Input: 
        number: number of minor lines to be located on an interval      
        distance: distance between adjacent major lines. 
        direction: (default is x) direction of the values to be computed. 
  */
  minorLines(settings = { number: 1, distance: 10, direction: "x" }) {
    const minors = this.minors({
      number: settings.number,
      distance: settings.distance,
      direction: settings.direction,
    });
    const lines = [];
    for (let i = 0; i < minors.length; i++) {
      if (settings.direction === "x") {
        lines.push([minors[i], this.ymin, minors[i], this.ymax]);
      } else if (settings.direction === "y") {
        lines.push([this.xmin, minors[i], this.xmax, minors[i]]);
      }
    }
    return lines;
  }
  /*
    SVGGROUP
    Returns a grid parsed in an SVG group according to input.
  */
  static svgGroup(
    settings = {
      geometry: { x: 0, y: 0, width: 100, height: 100 },
      majorLines: {
        configuration: {
          distance: 10,
          skipBoundary: false,
          skipOrigin: false,
        },
        attributes: {
          stroke: "#00FF00",
          "stroke-width": 1,
        },
      },
    }
  ) {
    let g = null;
    if (settings.hasOwnProperty("groupAttributes")) {
      g = getNode("g", settings.groupAttributes);
    } else {
      g = getNode("g");
    }
    const grid = new SimpleGrid(settings.geometry);
    if (settings.hasOwnProperty("boundingRectangle"))
      g.append(
        getNode("rect", { ...grid.boundingRectangle(), ...settings.boundingRectangle })
      );
    if (settings.hasOwnProperty("origin")) grid.origin(settings.origin);
    if (grid.originSet) {
      if (settings.hasOwnProperty("axes")) {
        const axes = grid.axes();
        for (const a in axes) {
          g.append(
            getNode("line", {
              x1: axes[a][0],
              y1: axes[a][1],
              x2: axes[a][2],
              y2: axes[a][3],
              ...settings.axes,
            })
          );
        }
      }
    }
    if (settings.hasOwnProperty("majorLines")) {
      for (const a of grid
        .majorLines({...settings.majorLines.configuration, direction:"x"})
        .concat(grid.majorLines({...settings.majorLines.configuration, direction:"y"}))) {
        g.append(
          getNode("line", {
            x1: a[0],
            y1: a[1],
            x2: a[2],
            y2: a[3],
            ...settings.majorLines.attributes,
          })
        );
      }
    }
    if (settings.hasOwnProperty("minorLines")) {
      for (const a of grid
        .minorLines({...settings.minorLines.configuration, direction:"x"})
        .concat(grid.minorLines({...settings.minorLines.configuration, direction:"y"}))) {
        g.append(
          getNode("line", {
            x1: a[0],
            y1: a[1],
            x2: a[2],
            y2: a[3],
            ...settings.minorLines.attributes,
          })
        );
      }
    }
    return g;
  }
}

// Globals
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

export default SimpleGrid;
