const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('annonce')
    .setDescription('Envoyer une annonce')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Le message à envoyer')
        .setRequired(true))
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Déploiement des commandes...');

    await rest.put(
      Routes.applicationCommands('1486352594371874896'),
      { body: commands },
    );

    console.log('Commandes ajoutées ✅');
  } catch (error) {
    console.error(error);
  }
})();