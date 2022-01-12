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

let chaosTarget = null;
let blindfaithTarget = null;

// client.application?.commands.create({
//   name: "chaos",
//   description: "Create chaos for the choosen one",
// });

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
        .setStyle("PRIMARY")
    );
    await interaction.reply({ content: ":]", components: [row] });
  }

  if (interaction.isCommand() && interaction.commandName === "chaotic") {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("btn1")
        .setLabel("Do not click")
        .setStyle("DANGER")
    );
    await interaction.reply({ content: "Do you dare?", components: [row] });
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
        .setStyle("DANGER")
    );
    await interaction.reply({ content: "Do you dare?", components: [row] });
  }

  if (interaction.isCommand() && interaction.commandName === "blindfaith") {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("btn3")
        .setLabel("Do not click")
        .setStyle("PRIMARY")
    );
    blindfaithTarget = interaction.member;
    const msg = `${interaction.member.nickname} has requested that nobody touch this button`;

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
        `${interaction.member.nickname} does not have your back 🔪`
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
