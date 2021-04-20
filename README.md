# bazaar-stocks

A stocks application for the Bazaar in Hypixel SkyBlock.

There isn't an actual application yet, you have to run it using Node.js and Electron right now.

To run it:

Install [Node.js](https://nodejs.org/), and download this folder.

Run `npm install` in this folder, then run `sudo npm install electron -g`.

Put your Hypixel API key in `.env`.
Finally, run `npm start` to run the program.


# Making your own

Any JS scripts, CSS files,  for the app will be automatically hosted if they are in the right folder.

Put JS scripts in `/public/scripts`
Put CSS scripts in `/public/stylesheets`

Put assets in `/assets`

It will not host any files starting with `.`

It's hosted at localhost:5555.
You can change the port in `.env`, but you will have to replace all of the 5555 ports used in `index.html`

To reference something, use:
http://localhost:5555/<assets/scripts/stylesheets>/\<file\>.\[?\]

You can look at `start-server.js` if you want to look for yourself.

This program will only request data from (hypixel.net)[https://hypixel.net], (api.hypixel.net)[https://hypixel.net] and any links for forum avatars.
