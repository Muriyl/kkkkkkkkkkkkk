  const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType} = require('discord.js');
  const TicketSetup = require('../../Schemas/TicketSetup');
  const config = require('../../config');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('ticket')
      .setDescription('A command to setup the ticket system.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Select the channel where the tickets should be created.')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
      .addChannelOption((option) =>
        option
          .setName('category')
          .setDescription('Select the parent where the tickets should be created.')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildCategory)
      )
      .addChannelOption((option) =>
        option
          .setName('transcripts')
          .setDescription('Select the channel where the transcripts should be sent.')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
      .addRoleOption((option) =>
        option
          .setName('handlers')
          .setDescription('Select the ticket handlers role.')
          .setRequired(true)
      )
      .addRoleOption((option) =>
        option
          .setName('everyone')
          .setDescription('Select the everyone role.')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('description')
          .setDescription('Choose a description for the ticket embed.')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('button')
          .setDescription('Choose a name for the ticket embed.')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('emoji')
          .setDescription('Choose a style, so choose a emoji.')
          .setRequired(true)
      ),
    async execute(interaction) {
      const { guild, options } = interaction;
      try {
        const channel = options.getChannel('channel');
        const category = options.getChannel('category');
        const transcripts = options.getChannel('transcripts');
        const handlers = options.getRole('handlers');
        const everyone = options.getRole('everyone');
        const description = options.getString('description');
        const button = options.getString('button');
        const emoji = options.getString('emoji');
        await TicketSetup.findOneAndUpdate(
          { GuildID: guild.id },
          {
            Channel: channel.id,
            Category: category.id,
            Transcripts: transcripts.id,
            Handlers: handlers.id,
            Everyone: everyone.id,
            Description: description,
            Button: button,
            Emoji: emoji,
          },
          {
            new: true,
            upsert: true,
          }
        );
        const embed = new EmbedBuilder()
		  .setTitle('Stack.gg - Ticket')
		  .setDescription('<:br:1237898680015523952> | Bem-vindo ao nosso ticket\nCaso precise de qualquer tipo de suporte abra um ticket clicando no botão abaixo.\n\n<:en:1237898681668206614> | Welcome to our ticket\nIf you need help or any kind of help, just click on the button below.')
		  .setImage('https://media.discordapp.net/attachments/1237903721602486312/1237903784697401354/stackbanner2.jpg?ex=663d573d&is=663c05bd&hm=132baa2542e66d9331409a2a8618b6ac763423eefc30a0295c8be62dbff484f9&=&format=webp')
		  .setColor('2b2d31');
        const buttonshow = new ButtonBuilder()
		  
          .setCustomId(button)
          .setLabel(button)
          .setEmoji(emoji)
          .setStyle(ButtonStyle.Secondary);
        await guild.channels.cache.get(channel.id).send({
          embeds: [embed],
          components: [new ActionRowBuilder().addComponents(buttonshow)],
        }).catch(error => {return});
        return interaction.reply({ embeds: [new EmbedBuilder().setDescription('The ticket panel was successfully created.').setColor('Green')], ephemeral: true});
      } catch (err) {
        console.log(err);
        const errEmbed = new EmbedBuilder().setColor('Red').setDescription(config.ticketError);
        return interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(error => {return});
      }
    },
  };
  