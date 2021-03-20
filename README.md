# fullstack-project

## Structure of the repository:
puzzles contains all the actual code, inside puzzles are two respositories, node_modules which contains all the modules we use and statics which contains the images displayed on the homepage. 


## To run the website:
<p>
first make sure you have Node.js installed. To check, run:
```
$ node -v
```
If you don't have Node.js installed, download it here: https://nodejs.org/en/download/ <br>
Once Node.js is installed, navigate to the puzzles directory, then run
```
$ node sitescript.js
```
Then in your web browser, go to this link: http://localhost:3000

You should see the home page. To interact with the website:
1. register an account by putting in your username of choice and password. If your username is already taken, then you must enter a new one. NOTE: DO NOT USE A REAL PERSONAL PASSWORD, use something like password123
2. Once you have succesfully registered an account, log in using that information
2. Answer the puzzle, if you answer enough you might just climb onto the leaderboard!

Since the database the website uses to store user information is a mongoDB cloud database, you will see the usernames and scores of other people who have used the website before! 
</p>

## Member Contributions
Kevin - worked on setting up and connecting a database to the website. This includes creating the functionality for getting information from the data base such as login information and displaying score rankings.
Jeffrey- worked on the back end handling get+post requests as well as sending relevant data from the site script to the ejs files.
Qinan - worked on front-end, getting data from the backend displayed onto the page through ejs/html and styled appropriately in CSS.


## Known bugs: 
