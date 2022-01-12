# chaosbot

## Summary

Chaos Bot will add a little bit of fun to your server by offering the below commands! This is just a fun project to learn more about [Discord.js](https://discord.js.org/#/). 

## Commands

`/chaotic` - this creates a prompt with a button instructing users to push the button if they dare. If they do - they'll be timed out for 30 seconds. 

`/blindfaith` - do you believe in your friends? If so, put a button into the world that when they push it, the last person to call `/blindfaith` will be timed out for 1 minute. 

## Setup

1) Create your Discord app following the steps here: [https://discordjs.guide/preparations/adding-your-bot-to-servers.html](https://discordjs.guide/preparations/adding-your-bot-to-servers.html)
2) Add your Token to your .env file (or config setup if deploying online somewhere) -  `DISCORD_TOKEN={your token here}`
3) Modify the roles in your discord server so that the Bot's role is above everyone but the moderator role (the bot can only timeout people with lower roles). 
4) Start your script and have fun! 
