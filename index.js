const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  ChannelType,
  PermissionsBitField
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, () => {
  console.log('Bot connecté ✅');
});


// =========================
// 📌 COMMANDES CLASSIQUES
// =========================
client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content === '!ping') {
    message.reply('Pong 🏓');
  }
});


// =========================
// 📌 COMMANDES SLASH + TICKETS
// =========================
client.on(Events.InteractionCreate, async interaction => {

  // ===== SLASH COMMAND =====
  if (interaction.isChatInputCommand()) {

    if (interaction.commandName === 'annonce') {
      const msg = interaction.options.getString('message');

      const embed = new EmbedBuilder()
        .setColor(0xFF4DA6)
        .setDescription(msg)
        .setTimestamp();

      await interaction.channel.send({ embeds: [embed] });
      await interaction.reply({ content: 'Annonce envoyée ✅', ephemeral: true });
    }

    // commande pour envoyer le bouton ticket
    if (interaction.commandName === 'ticketpanel') {

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket')
          .setLabel('🎫 Créer un ticket')
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.reply({
        content: "Clique sur le bouton pour créer un ticket 🎫",
        components: [row]
      });
    }
  }


  // ===== BOUTON TICKET =====
  if (interaction.isButton()) {

    if (interaction.customId === 'ticket') {

      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
          }
        ],
      });

      // bouton fermer
      const closeRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('❌ Fermer le ticket')
          .setStyle(ButtonStyle.Danger)
      );

      await channel.send({
        content: `🎫 ${interaction.user}, ton ticket est ouvert !`,
        components: [closeRow]
      });

      await interaction.reply({ content: 'Ticket créé ✅', ephemeral: true });
    }


    // ===== FERMER TICKET =====
    if (interaction.customId === 'close_ticket') {
      await interaction.reply({ content: 'Fermeture du ticket...', ephemeral: true });

      setTimeout(() => {
        interaction.channel.delete();
      }, 3000);
    }
  }

});


client.login(process.env.TOKEN);