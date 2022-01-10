import { Client, Intents, MessageActionRow, MessageButton } from "discord.js";
import dotenv from "dotenv";

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
});

client.on("interactionCreate", async (interaction) => {
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

  // Chaotic Button pushed
  if (interaction.isButton() && interaction.customId === "btn1") {
    interaction.member.timeout(30000, "I told you not to push the button 😜");
    interaction.reply({
      content: "THE BUTTON HAS BEEN PUSHED - ENJOY",
      ephemeral: true,
    });
    return;
  }

  // Blind Faith Button Pushed
  if (interaction.isButton() && interaction.customId === "btn3") {
    blindfaithTarget.timeout(
      60000,
      `${interaction.member.nickname} does not have your back 🔪`
    );
    interaction.reply({
      content: `${interaction.member.nickname} cannot be trusted`,
    });
    return;
  }

  return;
});

client.login(process.env.DISCORD_TOKEN);

client.once("ready", () => {
  console.log("Matt Berry Running 🏃🏻‍♀️🏃🏻‍♂️");
});
