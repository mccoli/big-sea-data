# example from geeksforgeeks https://www.geeksforgeeks.org/three-dimensional-plotting-in-python-using-matplotlib/
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from matplotlib.tri import Triangulation

def f(x, y):
    return np.sin(np.sqrt(x ** 2 + y ** 2))

# returning evenly spaced numbers between -6 and 6 for 30 samples
x = np.linspace(-6, 6, 30)
y = np.linspace(-6, 6, 30)

# returns the matrices from the x,y coordinates created
X, Y = np.meshgrid(x, y)
Z = f(X, Y)

# creates unstructured triangle grid from the X, Y matrices which are being turned into 1D arrays
tri = Triangulation(X.ravel(), Y.ravel())

fig = plt.figure(figsize=(10, 8))

# adding a 1x1 grid to initialise the figure as 3d
ax = fig.add_subplot(111, projection='3d')

# created 3d triangular plot with tri as the triangles, 1D Z values on the Z axis, which color map to use, and color on the triangle edges
ax.plot_trisurf(tri, Z.ravel(), cmap='cool', edgecolor='none', alpha=0.6)

ax.set_title('Surface Triangulation Plot of f(x, y) =\
                sin(sqrt(x^2 + y^2))', fontsize=14)

ax.set_xlabel('x', fontsize=12)
ax.set_ylabel('y', fontsize=12)
ax.set_zlabel('z', fontsize=12)

plt.savefig('C:\\Users\\mccal\\Documents\\CCI\\big-data\\big-sea-data\\img\\surface-triangulation.png')
print('graphics saved successfully!')
plt.show(block = True)
plt.close()