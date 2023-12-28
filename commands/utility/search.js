const { SlashCommandBuilder } = require("discord.js");
const { dropItemEmbed } = require("../../utils/embedBuilder");
const axios = require("../../services/axiosConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("searchdrop")
    .setDescription("Search for item who drops on warframe")
    .addStringOption((option) =>
      option.setName("input").setDescription("The input to echo back")
    ),
  async execute(interaction) {
    // console.log(interaction);
    try {
      const item = interaction.options.getString("input");
      const response = await axios.get(`/drops/search/${item}`);
      if (response.length === 0) {
        return await interaction.reply(
          "Nenhum resultado encontrado para a pesquisa."
        );
      }
      const place = response.data[0].place;
      const itemName = response.data[0].item;
      const rarity = response.data[0].rarity;
      const chance = response.data[0].chance;

      const channel = interaction.client.channels.cache.get(
        interaction.channelId,
        ephe
      );
      await channel.send({
        embeds: [dropItemEmbed(place, itemName, rarity, chance)],
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      await interaction.reply("Ouve algum erro na hora da procura");
    }
  },
};
