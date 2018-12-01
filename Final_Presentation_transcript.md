# INF 554 PRESENTATION_TRANSCRIPT

## Slide 1. introduction
Introducing ourselves

## Slide 2. DESCRIPTION ABOUT PROJECT (PROBELM)

Planning travel is hard. Sometimes we have a place in mind but don't know the right time to visit it. Sometimes we know when we have to plan a holiday but no proper destination in mind. How do we solve this problem ? How do we know a best vacation destination and perfect time to visit it?

## SLIDE 3. DESCRIPTION ABOUT PROJECT (SOLUTION)

Our aim is to create a visualization tool for all the travelers which gives them a comparable holiday destination and best airline to travel with based on our analysis on air traffic, air fare and airline ranking data.

## SLIDE 4. Homepage of Website

This page gives details on the problem statement and solution of our project through slider images.

## SLIDE 5. Find Best Destination(map)

Our story is helping user find the destination country for their travel. We selected choropleth map for this section as maps are organized and helps users in giving bird eyes view.By default the map shows all the countries that are visited by travelers from United States in year 2017.

## SLIDE 6. Find Best Destination(pie chart)

User is provided with dropdown interaction to select their source country and the map will change displaying the top countries to be visited from that source. This result is based on count of passengers in past from a particular source to destination. On hovering a particular destination country we also present users with pie-chart which helps them in deciding which city to travel in those countries. Again the cities are displayed based on the past travelers count
## SLIDE 7. Find Best Destination(selection)
For example, user can select their source city here for instace Los Angeles and accordingly map will change highlighting top 10 countries to be visited from that source. Canada is found to be most visited from Los Angeles.

## SLIDE 8. Interactive in map chart
Piechart gives information about cities that can be visited in Canada. We also see that Toronto is most visted city.

## SLIDE 9. Overview 
This section gives all destination countries that can be travelled from United States.
We have used Bubble Chart as it helps in spotting categories easily and compare them to the rest of the data by looking at the size of the bubble. By having just a look at our data we can see that Mexico is largest bubble i.e. Mexico is destination for most of the travelers from United States in 2017.

## SLIDE 10. Overview(bubble chart)
The size of Country bubble also indicates the number of tourists. The Country bubble also includes the city bubble inside it. Hovering over the bubble will give us more detail about city, country and passenger count.  

## SLIDE 11. Find Best Time
This section helps in deciding the best time to visit a particular destination.Line Chart helps us in determining the relationship between two destinations.By default line chart shows the number of passengers to top 10 destination countries from United States over January to December in 2017.

## SLIDE 12. Find Best Time(default line chart)
User can select a particular destination to find out what is the best time to visit it. User is also given option to select multiple destinations.
## SLIDE 13. Find Best Time(selection)
We present here an example where user is selecting multiple destinations like Argentina, Brazil，Canada.

## SLIDE 14. Find Best Time(selection)
We can see line chart for the above countires and see that March and April are the best time to visit Cananda.

## SLIDE 15. Find Best Airline
The last step is helping user to find the airlines they can travel with.We have provided user with stacked bar graph.

## SLIDE 16. Find Best Airline(Default)
The factors considered in determining best airline are  Punctuality, Handling of Passenger Rights, AirHelp Score, Service Quality. Sum of these factors is important in determining the Airline ranking so we have used stacked bar graph.
## SLIDE 17. Find Best Airline
User is given option to view just Top 10 airline or alphabetically.
## SLIDE 18. Find Best Airline(Top ten)
We can see top ten airlines presented to user. Here, considering all the factors, Qatar Airways is best airline to travel with.
## SLIDE 19. Technical considerations
We used D3 as our visualization launguage and used Angular as our web development framework

## SLIDE 20. Data Source
We collected data from two sources for our project. Two sources are : Bureau of transportation statistics and data.world. After collecting the data we used SQL queries to use the part of subset of data as required in our project. The data we collected from Bureau of transportation statistics was air traffic data giving information about source country, source city, destination country, destination city, number of passengers, time of the year. Data we collected from data.world was about international airline rankings which had a airline score for following factors : Punctuality, Handling of Passenger Rights and Service Quality and Airline Score.






 

