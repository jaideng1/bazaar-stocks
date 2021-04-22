# bazaar-stocks

A stocks application for the Bazaar in Hypixel SkyBlock.

### Downloading

Look at the side bar at releases.  



**Side Note:**  

This program will only request data from [hypixel.net](https://hypixel.net), [api.hypixel.net](https://hypixel.net) and any links for forum avatars.


# On Your Own

Here's the guide + some other things if you want to make your own addons for this.

### Prerequisites

Install [Node.js](https://nodejs.org/), and [download](https://github.com/jaideng1/bazaar-stocks/archive/refs/heads/main.zip) this repository.

### Running The Program

Open CMD/Terminal or what ever shell you use into this folder.

Run `npm install`, then run `sudo npm install electron -g`.  
After, run `cd src && cat example-env.txt >> .env` to create the `.env` file.

Put your Hypixel API key in `.env`. (You can get it with `/api new` on Hypixel)  
Finally, run `npm test` to run the program.

### Locations of Files

Any JS scripts, CSS files, or other files for the app will be automatically hosted if they are in the right folder.

Put JS scripts in `/public/scripts`.  
Put CSS scripts in `/public/stylesheets`.  
Put assets in `/assets`.  

It will not host any files starting with `.`

It's hosted at localhost:5555.
You can change the port in `.env`, but you will have to replace all of the 5555 ports used in `index.html`

To reference something, use:
http://localhost:5555/<assets/scripts/stylesheets>/\<file\>.\[?\]  
(Example: http://localhost:5555/assets/an-image.png or http://localhost:5555/scripts/my-script.js)

You can look at `start-server.js` if you want to look for yourself what it does.

### Building The Application On Your Own

This was a bit tricky for myself to do (i might have started at 6:00pm and finished at 1:05am one day), but here's how you can do it on your own.

If you have all of the devDependencies and the normal dependencies installed, then you're pretty much fine.

If you've moved around files outside of src or something like that, then you'll have to reference it in `package.json` under `"files"`. You have to replace `./src/app.js` with wherever the starting script is, but you can follow the format of the other files.  


In your shell, run `mkdir build && mkdir dist`.  
To build the program, run `npm run dist`.
