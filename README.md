# bazaar-stocks

A stocks application for the Bazaar in Hypixel SkyBlock.



### Downloading

Look [here](https://github.com/jaideng1/bazaar-stocks/releases/) for releases.  

**Side Note:**  

This program will only request data from [hypixel.net](https://hypixel.net), [api.hypixel.net](https://hypixel.net) and any links for forum avatars.


# On Your Own

Here's the guide + some other things if you want to make your own addons for this.

### Prerequisites

Install [Node.js](https://nodejs.org/), and [download](https://github.com/jaideng1/bazaar-stocks/archive/refs/heads/main.zip) this repository.  
(Or run `git clone https://github.com/jaideng1/bazaar-stocks`)

### Running The Program

Open CMD/Terminal or what ever shell you use into this folder.

1st Run:  
`npm install`  

2nd:  
`sudo npm install electron -g`  

3rd:  
`cat example-env.txt >> .env && mv example-data.txt src/data.json`  
(To create the `.env` and `data.json` files).

Put your Hypixel API key in `.env`. (You can get it with `/api new` on Hypixel)  
*Note: It's not used right now, so you could just put some random letters in (for now.)*   

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

If you've moved around files outside of `src` that you want in your app or something like that, then you'll have to reference it in `package.json` under `"files"`. You have to replace `./src/app.js` with wherever the starting script is, but you can follow the format of the other files.  


In your shell, run `mkdir build && mkdir dist`.
Move the files in `saved-icons` to the `build` folder.
To build the program for your current platform (? I think), run:  
`npm run dist`

To build for Mac, Windows and Linux, run:   
`npm run dist-all-platforms`  

For only Mac and Windows, run:
`npm run dist-mw`  

(Be careful about building, it can use up a lot of storage!)

### Warnings

There might be warnings about this GitHub page that popup while making the program. They look a bit like this:  
`⚠ Warning: There have been new commits made to the GitHub page.  
This bazaar-stocks fork only has 35 commits, and the GitHub page has 36 commits.`  

They just mean that there is new content here, in this repository, and you might want to check it out.  
To get rid of the warnings, run `npm run update-info`.
