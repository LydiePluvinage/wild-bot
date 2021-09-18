const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('git')
    .setDescription(
      'Affiche la liste des principales commandes Git et leur rôle'
    )
    .addUserOption((option) =>
      option.setName('command').setDescription('La commande Git à détailler')
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('command');
    if (user) return interaction.reply(`Git ${user.username}' ça sert à rien`);
    return interaction.reply(`Git c'est bien`);
  },
};
