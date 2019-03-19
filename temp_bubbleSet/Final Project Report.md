## Final Project Report

###Jacob Lin, Xander Fang

#### Goal and Approach

​	Our goal of the final project is to build a visualization tool for studying howdifferent countries' achievements have changed over the last 100 years. To achieve this goal, we found a dataset that contains all records of medal winners in all Olympic games and select the 50 countries that win most medals in each game. We draw bubble set contours for these fifty countries to see what continent they are from and how many atheletes from each country participate in an Olympic Game and how many of them won a medal for the country. We have a slide bar at the bottom of our graph for users to select an Olympic Game to analysis and a button to show the changes over years.

#### Experience

​	Our experience of this project has been smooth for the most part. Most part is straight forward but building virtual edge between each node is quite hard. 

#### Implementation

#### Difference

​	While the paper provides examples of bubble set contours over multiple graph types, we only implement the bubble set contour over a scatterplot. We believe that the bubble set contour makes more sense over a scatterplot than other graphs and we can implement more interactions with the scatterplot while other graphs has limitations of building interactions. The paper decribes the algorithm for generating a contour over square datapoints, but the scatterplot with bubble contour in the paper is one with circular data points. The algorithm describes how the contour can go through each of the vertices of the square. We believe the circular version is based on squares too but the squares are invisible and only circles can be seen by users. For our project we simply draw squares on the scatterplot because it makes the overall logic much easier and squares and circles on a scatterplot does not make that much difference. 

#### Dataset

​	Our project uses a dataset that contains records of participants for each Olympic Game. To transform the dataset for our project, we aggregate all records by country and year. Because there are so many countries in Olympic Games in recent years, we only select the top fifty for our visualization tool. Another reason doing so is that countries with minimal achievements in Olympic Games always stack together in the scatterplot and creates difficulties for generating the bubble set contour. We also don't want to deal with cases that a country is split into two countries or a territory becomes independent and is counted as separate country in another game. The pool of the top fifty countries is fairly stable and consistant and therefore is the data we use for this visualization

#### Case Study

#### Strength and Limitations

​	The bubble set contour is very powerful in showing spatial information about data points because it shows where a category of data points span in the gobal space and where they don't. Tradional ways of showing this is using either color or shapes but they are small channels that associated with each data point and users need to imagine such a contour by themselves by looking at these spcialy disconnected points. The buble set contour explicitly draws one shape on the graph indicating the category of data which is more straightforward for users and skip the imagination step.

​	However, during the implementation, we also find some weakness of the bubble set contour. We find that the algorithm is extremely slow if data points are very close to each other. The contour tries to find a vertual edge to connect two data points but fail to find a relatively easy path. If blocked by multiple nodes from other categories, the contour tries to find a non-overlapping path and the calculation cost too much computing power from the browser. 