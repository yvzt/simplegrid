# simplegrid

simplegrid is a basic two-dimensional grid implementation using rectangular coordinates. A simplegrid object can be instantiated by passing the coordinate of the corner with minimum x and y values, say (x_min, y_min), the width and height of the rectangle. 

Using setOrigin / anchorOrigin it is possible to set an origin point through which x and y axis lines are assumed to pass. getAxes function returns the start and end point coordinates of the horizontal and veritical axis lines recpectively.

One can either get the coordinates of major and minor lines (getMajors/getMinors) in a direction in dependently or end points of these lines in the size of the grid packed in an array as arrays of four elements. (getMajorLines, getMinorLines)

Major lines are laid out through the domain of the grid with a separation distance specified. It is possible to skip borders of the domain and origin if a major line is sufficiently close to these locations. 

Specified number of minor lines are placed evenly between adjacent major lines.

It is also poissible to obtain the bounding rectangle of the domain.