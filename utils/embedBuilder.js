const { EmbedBuilder } = require("discord.js");

module.exports.dropItemEmbed = function (place, itemName, rarity, chance) {
  return new EmbedBuilder()
    .setColor("Green")
    .setTitle(itemName)
    .addFields(
      { name: "Location", value: String(place) },
      { name: "Rarity", value: String(rarity) },
      { name: "Chance", value: `${String(chance)}%` }
    );
};
