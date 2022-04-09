/*
  SIMPLEGRID : A simple horizontal 2D grid class
*/

class SimpleGrid {
  /* 
    CONSTRUCTOR:
    (xmin, ymin): Coordinate of the starting point.
    (width, height): Dimensions of the grid.
  */
  constructor(xmin, ymin, width, height) {
    this.xmin = xmin;
    this.ymin = ymin;
    this.width = width;
    this.height = height;
    this.xmax = this.xmin + this.width;
    this.ymax = this.ymin + this.height;
    this.originSet = false;
  }

  /* 
    BOUNDINGRECTANGLE:
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
    SETORIGIN:
      Sets the origin to (x,y) given as an object with keys x & y.
      
      Input: 
        origin: Object {x: ____, y:____}

  */
  setOrigin(origin) {
    if (origin.hasOwnProperty("x") && origin.hasOwnProperty("y")) {
      this.originSet = true;
      this.origin = origin;
    }
  }

  /* 
    ANCHORORIGIN:
      Anchors the origin to (x,y) anchors given as an object with keys x & y.
      anchor are the normalized values with respect to width and height
      along x and y respectively.
      e.g. {x:0.5, y:0.5} sets the origin at the midpoint of the grid.
      Input: 
        origin: Object {x: ____, y:____}
  */
  anchorOrigin(origin) {
    if (origin.hasOwnProperty("x") && origin.hasOwnProperty("y")) {
      this.originSet = true;
      this.origin = {
        x: this.xmin + origin.x * this.width,
        y: this.ymin + origin.y * this.height,
      };
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
  getAxes() {
    if (this.originSet) {
      return [
        [this.xmin, this.origin.y, this.xmax, this.origin.y],
        [this.origin.x, this.ymin, this.origin.x, this.ymax],
      ];
    } else {
      return null;
    }
  }

  /*
    GETMAJORS:
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
  getMajors(distance, skipBoundary, skipOrigin, direction = "x") {
    const xmajor = [];
    let x = direction === "x" ? this.xmin : this.ymin;
    let rshift = 0;
    if (skipBoundary) {
      rshift = -1;
    } else {
      xmajor.push(x);
    }
    for (
      let i = 0;
      i < (direction === "x" ? this.width : this.height) / distance + 10;
      i++
    ) {
      x += distance;
      if (x > (direction === "x" ? this.xmax : this.ymax) + rshift) break;
      if (this.originSet) {
        if (
          Math.abs(x - (direction === "x" ? this.origin.x : this.origin.y)) <
            1 &&
          skipOrigin
        ) {
          continue;
        }
      }
      xmajor.push(x);
    }
    return xmajor;
  }

  /*
    GETMINORS:
      Creates and array of the locations minor lines that are
      evenly spaced between adjacent major lines at a specified number.
      Input: 
        number: number of minor lines to be located on an interval
        between two adjacent major lines. 
        distance: distance between adjacent major lines. 
        skipBoundary: skips the boundaries if true.
        direction: (default is x) direction of the values to be computed. 
  */
  getMinors(number, distance, direction = "x") {
    const xmajor = this.getMajors(distance, false, false, direction);
    const xminor = [];
    const dx = distance / (number + 1);
    for (let i = 0; i < xmajor.length - 1; i++) {
      for (let j = 0; j < number; j++) {
        xminor.push(xmajor[i] + (j + 1) * dx);
      }
    }
    return xminor;
  }

  /*
    GETMAJORLINES:
      End points of major lines whose locations are determined by 
      getMajors function.
      Input: 
        distance: distance between adjacent major lines. 
        skipBoundary: skips the boundaries if true.
        skipOrigin: skips the major line passing through the origin if 
        a value is computed in the neighborhood of the origin.
        direction: (default is x) direction of the values to be computed. 
  */
  getMajorLines(distance, skipBoundary, skipOrigin, direction = "x") {
    const majors = this.getMajors(
      distance,
      skipBoundary,
      skipOrigin,
      direction
    );
    const lines = [];
    for (let i = 0; i < majors.length; i++) {
      if (direction === "x") {
        lines.push([majors[i], this.ymin, majors[i], this.ymax]);
      } else if (direction === "y") {
        lines.push([this.xmin, majors[i], this.xmax, majors[i]]);
      }
    }
    return lines;
  }

  /*
    GETMINORLINES:
      End points of minor lines whose locations are determined by 
      getMinors function.
      Input: 
        number: number of minor lines to be located on an interval      
        distance: distance between adjacent major lines. 
        direction: (default is x) direction of the values to be computed. 
  */
  getMinorLines(number, distance, direction = "x") {
    const minors = this.getMinors(number, distance, direction);
    const lines = [];
    for (let i = 0; i < minors.length; i++) {
      if (direction === "x") {
        lines.push([minors[i], this.ymin, minors[i], this.ymax]);
      } else if (direction === "y") {
        lines.push([this.xmin, minors[i], this.xmax, minors[i]]);
      }
    }
    return lines;
  }
}

export default SimpleGrid;
