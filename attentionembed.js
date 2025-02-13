const { EmbedBuilder } = require("discord.js");
const {
  approveemoji,
  denyemoji,
  AVATARURL,
  BOTNAME,
  BOTCOLOR,
} = require(`../config.json`);

module.exports = {
  async attentionembed(interaction, title) {
    try {
      if (interaction.isMessageComponent()) {
        await interaction.message.reactions.removeAll();
        await interaction.message.react(denyemoji);
      }
    } catch {}

    let resultsEmbed = new EmbedBuilder()
      .setTitle("<:emoji_46:836689644988923945> " + title)
      .setColor("#FB0505");

    await interaction.reply({ embeds: [resultsEmbed] });
    if (interaction.isMessageComponent()) {
      await interaction.message.react("<:emoji_46:836689644988923945>");
    }
  }
};
