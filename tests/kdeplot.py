import seaborn as sns
import pandas
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

geyser = sns.load_dataset("geyser")
sns.kdeplot(data=geyser, x="waiting", y="duration", fill=True, levels=100, thresh=0, cmap=sns.color_palette("Paired", as_cmap=True))

plt.show()