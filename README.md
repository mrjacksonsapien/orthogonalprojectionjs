# 3D orthogonal projection in JS

I tried to create my own 3D matrix with the Javascript context2D API. Of course this projection is really basic and it is nothing compared to a real 3D engine. I did not set up any "camera" object with direction rays.
For now the only way to manipulate the angle of the orthogonal projection is to rotate the X, Y and Z axis on a 2D view (change the angle of those axis in 2D). As mentionned, I did not set up any ray casting or anything
at this level so of course there is no surface drawn with z-index layers. This whole project is just for fun and learning so I did not really make anything impressive. Basically the 3 virtual vectors I created
are just x and y offsets. I started this project for my own learning and deeper understanding of 3D projection.

Note: The rotation of the matrix or the elements can get a bit wacky and distorted since I did not really implement exact a precise calculations for how the projection should be when a significant rotation is set.

Here are a few things you can still do:

- Create a shape (cube/pyramid) and set its size and position and rotation
- Rotate the X Y and Z "virtual" axises of the matrix.
