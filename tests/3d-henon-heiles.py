# example from geeksforgeeks
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from matplotlib.tri import Triangulation
from scipy.integrate import solve_ivp
import json


def henon_heiles(t, y):
    # system defined by following differential equations
    x, x_dot, y, y_dot, z, z_dot = y
    x_dotdot = -x - 2*x*y
    y_dotdot = -y - (x ** 2 - y ** 2)
    z_dotdot = -0.1*z
    return [x_dot, x_dotdot, y_dot, y_dotdot, z_dot, z_dotdot]

def orbital_shape(x, y, z):
    # define a 3D orbital shape function
    r = np.sqrt(x ** 2 + y ** 2 + z ** 2)
    return np.exp(-r**2)


# set initial conditions and time interval
t = np.linspace(0, 20, 1000)
y0 = [0.5, 0, 0.2, -0.7, 0, 0.1]

# numerical solver solves the system of equations
sol = solve_ivp(henon_heiles, [0, 20], y0, t_eval=t)

# create surface to scatter points over
# define x, y, and z arrays for the orbital surface
x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)
X, Y = np.meshgrid(x, y)
Z = np.zeros((100, 100))  # initialize 2D array for Z values
for i in range(len(x)):
    for j in range(len(y)):
        Z[i, j] = sol.y[5][-1]

# evaluate the orbital shape function over the 3D grid
V = orbital_shape(X, Y, Z)

# plot the solution 
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# plot the surface
ax.plot_surface(X, Y, Z[:, :], cmap='cool', alpha=0.8)

# define x, y, and z arrays for the points
x_points = np.random.uniform(-5, 5, 100)
y_points = np.random.uniform(-5, 5, 100)
z_points = np.sin(np.sqrt(x_points**2 + y_points**2))

# plotting surface to bind henon-heiles to
#ax.plot_surface(X, Y, Z, cmap='cool', alpha=0.8, facecolors=plt.cm.viridis(V))
ax.plot(x_points, y_points, z_points, c='red')
# plotting henon-heiles solution
ax.scatter(sol.y[0], sol.y[2], sol.y[5], c=sol.t, cmap='cool', alpha=0.3)

ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('Z')

# plt.savefig('C:\\Users\\mccal\\Documents\\CCI\\big-data\\big-sea-data\\img\\3d-hh-orbit2.png')
# print('graphics saved successfully!')
# plt.show(block = True)
# plt.close()

# exporting data in json format (as a .js file) so it can be used as a variable in a separate .js sketch
graph = {
    'points': [ {"x_points": "x_points"}, 
                {"y_points": "y_points"},
                {"z_points": "z_points"} 
    ]       
}

# solution found at: https://stackoverflow.com/questions/32284317/send-python-information-to-a-javascript-file by Michael Laszlo, 2015
with open('graph.js', 'w') as out_file:
    out_file.write('var graph = %s;' % json.dumps(graph))

# read data from javascript file
with open('../addons/creature.js', 'r') as in_file:
    contents = in_file.read()

# prepend new variable to its contents and write everything back into the file
with open('new_creature.js', 'w') as out_file:
    out_file.write('var graph = %s; \n' % json.dumps(graph) + contents)
