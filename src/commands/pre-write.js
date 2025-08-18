const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { readFileSync } = require('fs');

const config = JSON.parse(readFileSync('./config.json', 'utf-8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pre-write')
        .setDescription('PRE Belirtilen mesaj URL\'sini bot olarak yazdırır')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Mesaj URL\'si (https://discord.com/channels/...)')
                .setRequired(true)),
    
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });


        if (!config.premiumUsers.includes(interaction.user.id)) {
            return interaction.editReply({ 
                content: '<:mythra_checkno:1405892611520204821> **Bu komut sadece premium üyeler içindir.**' 
            });
        }

        const url = interaction.options.getString('url');
        const parts = url.split('/');
        
        try {
            const guildId = parts[4];
            const channelId = parts[5];
            const messageId = parts[6];

            if (!guildId || !channelId || !messageId) {
                return interaction.editReply({ content: '<:mythra_checkno:1405892611520204821> Geçersiz mesaj URL formatı kullandın.' });
            }

            const channel = await interaction.client.channels.fetch(channelId);
            const message = await channel.messages.fetch(messageId);

            if (!message.content && message.attachments.size === 0) {
                return interaction.editReply({ content: '<:mythra_checkno:1405892611520204821> Bu mesajın içeriği yok veya erişimim yok.' });
            }

            await interaction.channel.send({
                content: message.content,
                files: message.attachments.map(a => a.url)
            });

            await interaction.editReply({ content: '<a:white_verify:1403877783276617839> Mesaj başarıyla gönderildi.' });

        } catch (error) {
            console.error('Write komutu hatası:', error);
            await interaction.editReply({ 
                content: '<:cypher_think:1403879978054979755> Mesaj alınırken hata oluştu. URL\'yi ve izinleri kontrol edin.'
            });
        }
    }
};
