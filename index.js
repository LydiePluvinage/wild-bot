const pylonJokes = require('./pylonJokes.js');
const pylonDeux = require('./pylonDeux.js');
const pylonAnswers = require('./pylonAnswers.js');
const fs = require('fs');
//require('dotenv').config();

// Require the necessary discord.js classes
const { Client, Collection, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
  console.log('rajout des commandes');
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

  try {
    switch (interaction.commandName) {
      case 'git':
        await interaction.reply(`Voici les principales commandes git :\n
        **git init** : Indique à git que ce dossier va être suivi. Utile uniquement à la création d'un nouveau projet
        **git remote add origin *chemin*** : Lie un dossier à un repository git. Utile uniquement à la création d'un nouveau projet ou lors de recréation de repo
        **git clone *chemin*** : Crée un répertoire et récupère l'intégralité du repository. A faire suivre par npm install
        **git status** : Affiche les fichiers mis à jour depuis le dernier commit
        **git add .** : Ajoute toutes les modifications disponible à la liste à commit
        **git commit -m *message*** : Commit les modifications sur git.
        **git checkout -b *nomBranche*** : Crée une branche et se déplace dessus
        **git checkout *nomBranche*** : Se déplace sur la branche
        **git push origin *nomBranche*** : Envoie les modifications sur github
        **git fetch --all** : Récupère toutes les branches du repository
        **git reset --hard origin *nomBranche*** : Annule toutes les modifications effectuées sur la branche. Tout code en attente de commit sera perdu.
        **git log --oneline** : Affiche la liste des commit
        Pour en savoir plus : **https://www.atlassian.com/dam/jcr:e7e22f25-bba2-4ef1-a197-53f46b6df4a5/SWTM-2088_Atlassian-Git-Cheatsheet.pdf**
        `);
        break;
      case 'npm':
        await interaction.reply(`Voici les principales commandes NPM :\n
        **npm init** : Initialise le projet. Génère le package.json
        **npm install** : Installe les dépendances du projet. Génère le dossier node_modules. A faire après chaque git clone
        **npm install --save-dev *packageName*** : Installe le package en dépendance de développement et test
        **npm install -g *packageName*** : Installe le package en global. A faire quand le package va être utilisé partout
        **npm list -g --depth 0** : Affiche la liste des packages installés en global sur la machine
        **npm start** : Lance le script *start* défini dans la partie scripts de package.json
        **npm run *scriptName*** : Lance le script défini dans la partie scripts de package.json
        Pour en savoir plus : **https://devhints.io/npm**
        `);
        break;
      case 'pointage':
        if(interaction.member._roles.find((role)=> role==='885802798036434954')) {
          await interaction.reply('@everyone on pointe svp !');
        }
        else{
          throw 'Non, je ne crois pas';
        }
        break;
      case 'remote':
        await interaction.reply(
          'Voici le lien pour le remote : https://meet.google.com/jjn-kvnb-nrc?authuser=0'
        );
        break;
      default:
        break;
    }
  } catch (error) {
    return interaction.reply({
      content: error,
      ephemeral: true,
    });
  }
});

client.on('messageCreate', async (msg) => {
  const PYLON_ID= '270148059269300224';

  const pylonWasMentionned = (msg.content.toLowerCase().includes('pylon') && (msg.member.id !== client.user.id));
  const unPlusUn = (msg.content.toLowerCase().includes('1+1') && (msg.member.id !== client.user.id));
  const pylonSpoke = (msg.member.id === PYLON_ID);

  if (pylonSpoke) {
    let message = '';
    try {
      if (msg.content.toLowerCase().includes('trop cool le spam')){
        message  =`Il se plaint du spam et on entend que lui !!`;
      } else if (msg.content.toLowerCase().includes('r2')) {
        // pioche au choix dans une des blagues sur Pylon            
        const randomJoke = Math.floor(Math.random()*pylonAnswers.length);
        message = pylonAnswers[randomJoke];
      }
  
      if (message !== '') msg.channel.send(message);
    } catch (err) {
      console.warn('Failed to respond to mention r2.');
      console.warn(err);
    }    
  }
  else if (pylonWasMentionned) {
      try {
          // pioche au choix dans une des blagues sur Pylon
          const randomJoke = Math.floor(Math.random()*pylonJokes.length);
          msg.channel.send(pylonJokes[randomJoke]);
      } catch (err) {
          console.warn('Failed to respond to mention pylon.');
          console.warn(err);
      }
  }
  else if (unPlusUn) {
    try {
      const randomJoke = Math.floor(Math.random()*pylonDeux.length);
      msg.channel.send(pylonDeux[randomJoke]);
    } catch (err) {
      console.warn('Failed to respond to mention 1+1.');
      console.warn(err);
    }   
  }
});


// Login to Discord with your client's token
client.login(process.env.DJS_TOKEN);
