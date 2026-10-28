const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("select")
    .setDescription("DropdownTesting!"),
  async execute(interaction) {
    const favoriteStarterSelect = new StringSelectMenuBuilder()
      .setCustomId("starter")
      .setPlaceholder("Make a selection!")
      .addOptions(
        // String select menu options
        new StringSelectMenuOptionBuilder()
          // Label displayed to user
          .setLabel("Bulbasaur")
          // Description of option
          .setDescription("The dual-type Grass/Poison Seed Pokémon.")
          // Value returned in select menu interaction
          .setValue("bulbasaur"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Charmander")
          .setDescription("The Fire-type Lizard Pokémon.")
          .setValue("charmander"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Squirtle")
          .setDescription("The Water-type Tiny Turtle Pokémon.")
          .setValue("squirtle"),
      );

    // Adding a string select menu to an action row
    const row = new ActionRowBuilder().addComponents(favoriteStarterSelect);
    // Reply with the action row
    const response = await interaction.reply({
      content: "Choose your starter!",
      components: [row],
      withResponse: true,
    });

    // This should look like
    const collectorFilter = (i) => i.user.id === interaction.user.id;

    try {
      const confirmation =
        await response.resource.message.awaitMessageComponent({
          filter: collectorFilter,
          time: 60_000,
        });
      console.log(confirmation);
      await interaction.editReply({
        content: `You've selected ${confirmation.values[0]}!`,
        components: [],
      });
      return;
    } catch (err) {
      console.log(err);
      await interaction.editReply({
        content: "Confirmation not received within 1 minute, cancelling",
        components: [],
      });
      return;
    }
  },
};
