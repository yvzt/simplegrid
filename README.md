# SimpleGrid - A very basic two-dimensional grid with rectangular coordinates

simplegrid is a basic two-dimensional grid implementation using rectangular coordinates. A SimpleGrid object can be instantiated by passing the coordinate of the corner with minimum x and y values, say (x_min, y_min), the width and height of the rectangle. 

Using setOrigin / anchorOrigin it is possible to set an origin point through which x and y axis lines are assumed to pass. getAxes function returns the start and end point coordinates of the horizontal and veritical axis lines recpectively.

One can either get the coordinates of major and minor lines (getMajors/getMinors) in a direction in dependently or end points of these lines in the size of the grid packed in an array as arrays of four elements. (getMajorLines, getMinorLines)

Major lines are laid out through the domain of the grid with a separation distance specified. It is possible to skip borders of the domain and origin if a major line is sufficiently close to these locations. 

Specified number of minor lines are placed evenly between adjacent major lines.

It is also possible to obtain the bounding rectangle of the domain.

### Example: 

To create a grid that starts from (100,100) with a width of 500 and height of 500 units, 

```const aGrid = new Simplegrid(100,100,500,500);```

To set an origin at the geometric center of this rectangle, 

```aGrid.setOrigin({x:350, y:350}); ```

or

```aGrid.anchorOrigin({x:0.5, y:0.5});```

To get the bounding rectangle: 

```aGrid.getBoundingRectangle();```

To get major lines along x separated by 50 units by skipping the boundaries and origin,

```aGrid.getMajorLines(50,true,true);```

To get major lines along y separated by 50 units by skipping the boundaries and origin,

```aGrid.getMajorLines(50,true,true,"y");```

To get 4 minor lines along x (divides the distance between adjacent major lines 5) between two adjacent grid lines separated by 50 units. 

```aGrid.getMinorLines(4,50);```

To get 4 minor lines along y (divides the distance between adjacent major lines 5) between two adjacent grid lines separated by 50 units. 

```aGrid.getMinorLines(4,50, "y");```

In the *test_simplegrid.js* example grid is used to create the following svg.

![Example grid used to create an SVG](./assets/images/example_grid.png?raw=true "Example grid")