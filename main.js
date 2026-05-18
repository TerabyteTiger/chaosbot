#!/usr/bin/env node
// ^ Interpreter for running this on server

import {
  Client,
  Intents,
  MessageActionRow,
  MessageButton,
  Permissions,
} from "discord.js";
import dotenv from "dotenv";
import http from "http";

dotenv.config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

let blindfaithTarget = null;

const gamble_button_title_options = [
  "🎲 Let's go gambling",
  "🎲 One time for Kenny Rogers",
  "🎲 Everything is a 50/50",
];

let gambler = null;
let gambler2 = null;

client.on("ready", () => {
  client.application?.commands.create({
    name: "chaotic",
    description: "Create chaos for everyone",
  });
  client.application?.commands.create({
    name: "blindfaith",
    description: "How much do you trust everyone in this channel?",
  });
  client.application?.commands.create({
    name: "timeout_gamble",
    description:
      "50/50 chance to time out you or the person that pushed the button",
  });
  client.application?.commands.create({
    name: "perms",
    description: "Check Bot Permissions",
  });
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand() && interaction.commandName === "perms") {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("permsBtn")
        .setLabel("Check Permissions")
        .setStyle("PRIMARY"),
    );
    await interaction.reply({ content: ":]", components: [row] });
  }
  if (interaction.isCommand() && interaction.commandName === "chaotic") {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("btn1")
        .setLabel("Do not click")
        .setStyle("DANGER"),
    );
    await interaction.reply({ content: "?", components: [row] });
  }
  if (interaction.isCommand() && interaction.commandName === "chaos") {
    const collector = interaction.channel.createMessageCollector({
      time: 15000,
    });
    interaction.deferReply();
    await collector.on("collect", (m) => {
      console.log(`Collected ${m}`);
    });
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("btn2")
        .setLabel("Do not click")
        .setStyle("DANGER"),
    );
    await interaction.reply({ content: "Do you dare?", components: [row] });
  }

  if (interaction.isCommand() && interaction.commandName === "blindfaith") {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("btn3")
        .setLabel("Do not click")
        .setStyle("PRIMARY"),
    );
    blindfaithTarget = interaction.member;
    const msg = `${interaction.member.nickname} has requested that nobody touch this button`;

    await interaction.reply({ content: msg, components: [row] });
  }

  if (interaction.isCommand() && interaction.commandName === "timeout_gamble") {
    let gamble_button_title =
      gamble_button_title_options[
        Math.floor(Math.random() * gamble_button_title_options.length)
      ];
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("btn4")
        .setLabel(gamble_button_title)
        .setStyle("PRIMARY"),
    );
    gambler = interaction.member;
    const msg = `${interaction.member.nickname} wants to gamble 🎲🎲`;

    await interaction.reply({ content: msg, components: [row] });
  }

  // Chaos Button pushed
  if (interaction.isButton() && interaction.customId === "btn2") {
    interaction.reply({
      content: "THE BUTTON HAS BEEN PUSHED",
      ephemeral: true,
    });
    return;
  }
  if (interaction.isButton() && interaction.customId === "permsBtn") {
    interaction.reply({
      content: "THE BUTTON HAS BEEN PUSHED",
      ephemeral: true,
    });
    return;
  }

  // Chaotic Button pushed
  if (interaction.isButton() && interaction.customId === "btn1") {
    if (interaction.member.moderatable) {
      interaction.member.timeout(30000, "I told you not to push the button 😜");
      interaction.reply({
        content: "THE BUTTON HAS BEEN PUSHED - ENJOY",
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content:
          "THE BUTTON HAS BEEN PUSHED - but you're above the law, so continue about your day 😊",
        ephemeral: true,
      });
    }
    return;
  }

  // Blind Faith Button Pushed
  if (interaction.isButton() && interaction.customId === "btn3") {
    if (blindfaithTarget.moderatable) {
      blindfaithTarget.timeout(
        60000,
        `${interaction.member.nickname} does not have your back 🔪`,
      );
      interaction.reply({
        content: `${interaction.member.nickname} cannot be trusted`,
      });
    } else {
      interaction.reply({
        content: `Sorry, ${blindfaithTarget.nickname}, you're above the law and aren't eligible for this chaos - but you still can't trust ${interaction.member.nickname}`,
      });
    }
    return;
  }
  // Gambling Button pushed
  if (interaction.isButton() && interaction.customId === "btn4") {
    gambler2 = interaction.member;
    if (gambler.moderatable && gambler2.moderatable) {
      if (Math.floor(Math.random() * 2) == 0) {
        gambler.timeout(5 * 60 * 1000, `${gambler2.nickname} has won 🔥`);
        interaction.reply({
          content: `${gambler2.nickname} has won 🔥`,
        });
      } else {
        gambler2.timeout(5 * 60 * 1000, `${gambler.nickname} has won 🍀`);
        interaction.reply({
          content: `${gambler.nickname} has won 🍀`,
        });
      }
    } else {
      if (!gambler.moderatable) {
        interaction.reply({
          content: `Sorry, ${gambler.nickname}, you're above the law and aren't eligible for this casino`,
        });
      }
      if (!gambler2.moderatable) {
        interaction.reply({
          content: `Sorry, ${gambler2.nickname}, you're above the law and aren't eligible for this casino`,
        });
      }
    }
    return;
  }

  return;
});

client.login(process.env.DISCORD_TOKEN);

client.once("ready", () => {
  console.log("Matt Berry Running 🏃🏻‍♀️🏃🏻‍♂️");
});

// Need to listen for something to prevent R10 error on Heroku

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Hello World!");
    res.end();
  })
  .listen(process.env.PORT || 8080);
//Example invite link: https://discord.com/api/oauth2/authorize?client_id=123456789012345678&permissions=0&scope=bot%20applications.commands
