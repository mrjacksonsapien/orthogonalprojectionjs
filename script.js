const Viewport = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 700;
    this.canvas.height = 700;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  }
}

Viewport.start();
ctx = Viewport.context;
ctx.translate(Viewport.canvas.width/2, Viewport.canvas.height/2);
ctx.save();


function LineDrawer(x1, y1, x2, y2, width, color, angle) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.width = width;
  this.color = color;
  this.angle = angle * Math.PI / 180;

  ctx.save();
  ctx.rotate(this.angle);
  ctx.beginPath();
  ctx.moveTo(this.x1, this.y1);
  ctx.lineTo(this.x2, this.y2);
  ctx.lineWidth = this.width;
  ctx.strokeStyle = this.color;
  ctx.stroke();
  ctx.restore();
}

// Virtual matrix methods and objects

// Virtual axis (VX, VY, VZ - 3D)
const VXAxis = new LineDrawer(
  Viewport.canvas.width / 2, 
  0,
  -Viewport.canvas.width / 2,
  0,
  1,
  "rgba(255, 0, 0, 0.4)",
  30
);

const VYAxis = new LineDrawer(
  Viewport.canvas.width / 2, 
  0,
  -Viewport.canvas.width / 2,
  0,
  1,
  "rgba(0, 255, 0, 0.4)",
  90
);

const VZAxis = new LineDrawer(
  Viewport.canvas.width / 2, 
  0,
  -Viewport.canvas.width / 2,
  0,
  1,
  "rgba(0, 0, 255, 0.4)",
  -30
);


function Vertex(x, y, z, visible) {

  // Origin in 2D
  this.Xorigin = 0;
  this.Yorigin = 0;

  // Calculate X and Y offsets based on the given angle
  var xx_offset = x * Math.cos(-VXAxis.angle);
  var xy_offset = x * Math.sin(-VXAxis.angle);
  var yx_offset = y * Math.cos(-VYAxis.angle);
  var yy_offset = y * Math.sin(-VYAxis.angle);
  var zx_offset = z * Math.cos(-VZAxis.angle);
  var zy_offset = z * Math.sin(-VZAxis.angle);

  // Position vertex in 2D
  this.x = this.Xorigin + xx_offset - yx_offset + zx_offset;
  this.y = this.Yorigin - xy_offset + yy_offset - zy_offset;

  this.visible = visible;

  // Show point toggle
  if (this.visible == true) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.strokeStyle = "rgba(1, 1, 1, 0)";
    ctx.stroke();
  }
}
  
function linkVertices(points, edges) {
  for (let i = 0; i < edges.length; i++) {
    const [index1, index2] = edges[i];
    const point1 = points[index1];
    const point2 = points[index2];
    new LineDrawer(point1.x, point1.y, point2.x, point2.y, 1, "rgba(0, 0, 0, 0.5)", 0);
  }
}


function ShapeTemplate(shape, width, heigth, depth, x, y, z, rotateX, rotateY, rotateZ, visiblevertices) {

  var originalXRotation = VXAxis.angle;
  var originalYRotation = VYAxis.angle;
  var originalZRotation = VZAxis.angle;

  this.XRotation = rotateX;
  this.YRotation = rotateY;
  this.ZRotation = rotateZ;

  VXAxis.angle = VXAxis.angle + (this.YRotation * Math.PI / 180) + (this.ZRotation * Math.PI / 180);
  VYAxis.angle = VYAxis.angle + (this.XRotation * Math.PI / 180) + (this.ZRotation * Math.PI / 180);
  VZAxis.angle = VZAxis.angle + (this.XRotation * Math.PI / 180) + (this.YRotation * Math.PI / 180);

  // Size
  this.shape = shape;
  this.width = width;
  this.height = heigth;
  this.depth = depth;
  this.visiblevertices = visiblevertices;
  
  // Position
  this.x = x;
  this.y = y;
  this.z = z;


  // Premade shapes
  if (this.shape.toLowerCase() == "cube") {
    const point1 = new Vertex(this.x, this.y, this.z, visiblevertices);
    const point2 = new Vertex(this.x, this.y, this.z + this.depth, visiblevertices);
    const point3 = new Vertex(this.x + this.width, this.y, this.z + this.depth, visiblevertices);
    const point4 = new Vertex(this.x + this.width, this.y, this.z, visiblevertices);
    const point5 = new Vertex(this.x, this.y + this.height, this.z, visiblevertices);
    const point6 = new Vertex(this.x, this.y + this.height, this.z + this.depth, visiblevertices);
    const point7 = new Vertex(this.x + this.width, this.y + this.height, this.z, visiblevertices);
    const point8 = new Vertex(this.x + this.width, this.y + this.height, this.z + this.depth, visiblevertices);


    const vertices = [point1, point2, point3, point4, point5, point6, point7, point8];

    const edges = [    
      [0, 1],
      [0, 3],
      [0, 4],
      [1, 2],
      [1, 5],
      [2, 3],
      [2, 7],
      [3, 6],
      [5, 4],
      [5, 7],
      [6, 4],
      [6, 7]
    ];

    linkVertices(vertices, edges);
  }

  if (this.shape.toLowerCase() == "pyramid") {
    const point1 = new Vertex(this.x, this.y, this.z, visiblevertices);
    const point2 = new Vertex(this.x + this.width, this.y, this.z, visiblevertices);
    const point3 = new Vertex(this.x, this.y, this.z + this.depth, visiblevertices);
    const point4 = new Vertex(this.x + this.width, this.y, this.z + this.depth, visiblevertices);
    const point5 = new Vertex(this.x + this.width / 2, this.y + this.height, this.z + this.depth / 2, visiblevertices);

    const vertices = [point1, point2, point3, point4, point5];

    const edges = [
      [0, 1],
      [0, 2],
      [0, 4],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
      [3, 4]
    ]

    linkVertices(vertices, edges);
  }

  VXAxis.angle = originalXRotation;
  VYAxis.angle = originalYRotation;
  VZAxis.angle = originalZRotation;
}


///////////////////////////////////////////////

var mycube = new ShapeTemplate(
  "cube",
  // Size (X, Y, Z) 
  100, 
  100, 
  100,
  // Position (X, Y, Z) 
  0, 
  0, 
  0, 
  // Rotation (X, Y, Z)
  0,
  0,
  0, 
  false
);
