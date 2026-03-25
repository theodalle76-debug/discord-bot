const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('clientReady', () => {
  console.log('Bot connecté ✅');
});

// Commandes classiques (!)
client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content === '!ping') {
    message.reply('Pong 🏓');
  }
});

// Commandes slash (/)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'annonce') {

    const msg = interaction.options.getString('message');

    const embed = new EmbedBuilder()
      .setColor(0xFF4DA6) // rose 💗
      .setDescription(msg)
      .setTimestamp();

    // ✅ envoie le message dans le salon (visible par tous)
    await interaction.channel.send({ embeds: [embed] });

    // ✅ réponse invisible (personne voit la commande)
    await interaction.reply({ content: 'Annonce envoyée ✅', ephemeral: true });
  }
});

require('dotenv').config();
client.login(process.env.TOKEN);