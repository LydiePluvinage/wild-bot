const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('npm')
    .setDescription(
      'Affiche la liste des principales commandes Npm et leur rôle'
    ),
  async execute(interaction) {
    return interaction.reply(`Npm c'est bien`);
  },
};
