import pylonJokes from './pylonJokes.js';
import pylonDeux from './pylonDeux.js';
import pylonAnswers from './pylonAnswers.js';
import pylonAttacks from './pylonAttacks.js';
import axios from 'axios';
import moment from 'moment'; // require
import { readdirSync } from 'fs';
import got from 'got';
import { JSDOM } from 'jsdom';
import commands from './commands/index.js';

import dotenv from 'dotenv';
dotenv.config();

// Require the necessary discord.js classes
import { Client, Collection, Intents } from 'discord.js';

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// List of servers
const servers = ['885798729859358742', '945259132045365288'];
// sept 2021          mars 2022

client.on('ready', () => {
  console.log('rajout des commandes');
  client.commands = new Collection();
  const commandFiles = readdirSync('./commands').filter((file) =>
    file.endsWith('.js')
  );

  for (const server of servers) {
    commands.map((command) => {
      client.api
        .applications(client.user.id)
        .guilds(server)
        .commands.post({
          data: {
            name: command.name,
            description: command.description,
            options: command.options,
          },
        });
      console.log(`${command.name} ajoutée`);
    });
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
        if (
          interaction.member._roles.find(
            (role) =>
              role === '885802798036434954' || role === '945262201634193520'
          )
        ) {
          await interaction.reply('<@&945262136228188181> on pointe svp !');
        } else {
          throw 'Non, je ne crois pas';
        }
        break;
      case 'remote':
        await interaction.reply(
          `Voici le lien pour le remote : https://meet.google.com/jjn-kvnb-nrc?authuser=0`
        );
        break;
      case 'remboursement':
        await interaction.reply(
          `Pour rembourser Lydie, au choix :
            soit par Paylib au 06.71.33.88.05
            soit par Virement http://lydiepluvinage.fr/RIB.pdf`
        );
        break;
      case 'meteo':
        await interaction.reply('Récupération des infos météo');
        axios
          .get(
            `https://api.meteo-concept.com/api/forecast/daily?insee=64024&token=${process.env.API_TOKEN}`
          )
          .then(async (meteoList) => {
            await interaction.editReply(
              `Voici la météo à 3 jours :
              ${moment().format('DD/MM/YYYY')} : Températures (min-max) : ${
                meteoList.data.forecast[0].tmin
              }° - ${meteoList.data.forecast[0].tmax}°. Il va pleuvoir à ${
                meteoList.data.forecast[0].probarain
              }% et le vent sera de ${meteoList.data.forecast[0].wind10m}km/h.
              ${moment()
                .add(1, 'days')
                .format('DD/MM/YYYY')} : Températures (min-max) : ${
                meteoList.data.forecast[1].tmin
              }° - ${meteoList.data.forecast[1].tmax}°. Il va pleuvoir à ${
                meteoList.data.forecast[1].probarain
              }% et le vent sera de ${meteoList.data.forecast[1].wind10m}km/h
              ${moment()
                .add(2, 'days')
                .format('DD/MM/YYYY')} : Températures (min-max) : ${
                meteoList.data.forecast[2].tmin
              }° - ${meteoList.data.forecast[2].tmax}°. Il va pleuvoir à ${
                meteoList.data.forecast[2].probarain
              }% et le vent sera de ${meteoList.data.forecast[2].wind10m}km/h`
            );
          });

        break;

      case 'horoscope':
        const horoscopeUrl = 'https://www.20minutes.fr/horoscope/';

        (async () => {
          // récupère le dom de la page
          const response = await got(horoscopeUrl);
          const dom = new JSDOM(response.body);
          // récupère le paragraphe à coté du titre correspond aux signes
          const horoscopeList = [
            ...dom.window.document.querySelectorAll('.titleblock-title'),
          ];
          interaction.reply(
            `Et voici l'horoscope du jour rien que pour toi, ${interaction.member.displayName}`
          );
          horoscopeList.map((horoscopeSign) => {
            let horoscope = `**${horoscopeSign.innerHTML.split(' ')[1]} : **`;
            horoscope +=
              horoscopeSign.parentNode.parentNode.nextSibling.nextSibling
                .nextSibling.nextSibling.innerHTML;
            if (
              removeAccentsAndUpperCase(interaction.options._subcommand) ===
              removeAccentsAndUpperCase(horoscopeSign.innerHTML.split(' ')[1])
            ) {
              interaction.followUp({ content: horoscope, ephemeral: true });
            }
          });
        })();

        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
    if (interaction.deferred) {
      return interaction.editReply({
        content: error,
        ephemeral: true,
      });
    } else {
      return interaction.reply({
        content: error,
        ephemeral: true,
      });
    }
  }
});

client.on('messageCreate', async (msg) => {
  const PYLON_ID = '270148059269300224';
  const JOSEPH_ID = '814818053635702784';
  const LYDIE_ID = '182990141889970176';
  const JIMMY_ID = '886911555344670720';

  const r2WasTagged = msg.content.toLowerCase().includes(`<@${PYLON_ID}>`);
  const pylonWasMentionned =
    msg.content.toLowerCase().includes('pylon') &&
    msg.member.id !== client.user.id;
  const unPlusUn =
    msg.content.toLowerCase().includes('1+1') &&
    msg.member.id !== client.user.id;
  const pylonSpoke = msg.member.id === PYLON_ID || msg.member.id === JOSEPH_ID;
  const lydieSpoke =
    msg.member.id === LYDIE_ID &&
    (msg.content.toLowerCase().includes('r2') || r2WasTagged);
  const hipHipHip = msg.content.toLowerCase().includes('hip');

  if (hipHipHip) {
    msg.channel.send(
      'https://www.photofunky.net/output/image/e/1/d/f/e1df7c/photofunky.gif'
    );
  } else if (pylonSpoke) {
    let message = '';
    try {
      if (msg.content.toLowerCase().includes('trop cool le spam')) {
        message = `Il se plaint du spam et on entend que lui !!`;
      } else if (msg.content.toLowerCase().includes('r2') || r2WasTagged) {
        // pioche au choix dans une des blagues sur Pylon
        const randomJoke = Math.floor(Math.random() * __length);
        message = pylonAnswers[randomJoke];
      }

      if (message !== '') msg.channel.send(message);
    } catch (err) {
      console.warn('Failed to respond to mention r2.');
      console.warn(err);
    }
  } else if (lydieSpoke && msg.content.toLowerCase().includes('attaque')) {
    // pioche au choix dans une des blagues sur Pylon
    const randomJoke = Math.floor(Math.random() * ___length);
    msg.channel.send(pylonAttacks[randomJoke]);
  } else if (pylonWasMentionned) {
    try {
      // pioche au choix dans une des blagues sur Pylon
      const randomJoke = Math.floor(Math.random() * length);
      msg.channel.send(pylonJokes[randomJoke]);
    } catch (err) {
      console.warn('Failed to respond to mention pylon.');
      console.warn(err);
    }
  } else if (unPlusUn) {
    try {
      const randomJoke = Math.floor(Math.random() * _length);
      msg.channel.send(pylonDeux[randomJoke]);
    } catch (err) {
      console.warn('Failed to respond to mention 1+1.');
      console.warn(err);
    }
  }
});

// Login to Discord with your client's token
client.login(process.env.DJS_TOKEN);

// function to remove all accents and set string to lowercase for comparaison
function removeAccentsAndUpperCase(stringToClean) {
  const forbiddenCharacters =
    'áàâäãåçéèêëíïîìñóòôöõúùûüýÁÀÂÄÃÅÇÉÈÊËÍÏÎÌÑÓÒÔÖÕÚÙÛÜÝ';
  const allowedCharacters =
    'aaaaaaceeeeiiiinooooouuuuyAAAAAACEEEEIIIINOOOOOUUUUY';

  const sentence = stringToClean
    .split('')
    .map((character) => {
      const characterPosition = forbiddenCharacters.indexOf(character);
      return characterPosition > 0
        ? allowedCharacters[characterPosition]
        : character;
    })
    .join('');

  return sentence.toLowerCase();
}
