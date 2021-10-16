const fs = require('fs');
// Require the necessary discord.js classes
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
  client.commands = new Collection();
  const commandFiles = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.api
      .applications(client.user.id)
      .guilds('885798729859358742')
      .commands.post({
        data: {
          name: command.name,
          description: command.description,
        },
      });
    console.log(`${command.name} ajouté`);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  /*const command = client.api
    .applications(client.user.id)
    .guilds('885798729859358742')
    .commands.filter((name) => (name = interaction.commandName));

  if (!command) return;*/

  try {
    switch (interaction.commandName) {
      case 'git':
        await interaction.reply(
          `Bah alors ${interaction.member.displayName}, t'as cru que j'allais te montrer mon git ?`
        );
        break;
      case 'npm':
        await interaction.reply(`https://devhints.io/npm`);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

/*
  client.ws.on('INTERACTION_CREATE', async (interaction) => {
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    if (command === 'hello') {
      // here you could do anything. in this sample
      // i reply with an api interaction
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: `hello ${interaction.member.nick}!!!`,
          },
        },
      });
    }
  });

});*/

// Login to Discord with your client's token
client.login(token);
