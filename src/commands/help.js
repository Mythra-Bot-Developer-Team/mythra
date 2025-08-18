const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Botun tüm komutlarını gösterir'),
    
    async execute(interaction) {
        // 1. Komut Kategorilerini Tanımla
        const commandCategories = {
            "Genel": [
                { name: '/help', description: 'Botun tüm komutlarını gösterir' },
                { name: '/ping', description: 'Botun gecikme süresini gösterir' },
                { name: '/uptime', description: 'Botun çalışma süresini gösterir' },
                { name: '/invite', description: 'Botun davet linkini gönderir' },
            ],

            "Kullanıcı": [
                { name: '/avatar', description: 'Kullanıcının avatarını gösterir' },
                { name: '/serverinfo', description: 'Sunucu hakkında bilgi gösterir' },
                { name: '/userinfo', description: 'Kullanıcı hakkında bilgi gösterir' },
                { name: '/write', description: 'Belirtilen mesaj URL\'sini bot olarak yazdırır' },
                { name: '/ticket-create', description: 'Kendi ticket kanalını oluşturur' },
            ],

            "Moderasyon": [
                { name: '/role', description: 'Kullanıcıya rol ekler veya kaldırır' },
                { name: '/nick', description: 'Bir kullanıcının takma adını değiştirir' },
                { name: '/ban', description: 'Kullanıcıyı sunucudan kalıcı olarak yasaklar' },
                { name: '/unban', description: 'Yasaklanmış bir kullanıcının yasağını kaldırır' },
                { name: '/kick', description: 'Kullanıcıyı sunucudan atar' },
                { name: '/mute', description: 'Kullanıcıyı belirli süre susturur' },
                { name: '/unmute', description: 'Kullanıcının susturmasını kaldırır' },
                { name: '/warn', description: 'Kullanıcıyı uyarır' },
                { name: '/clear', description: 'Belirtilen sayıda mesajı siler' },
                { name: '/ticket-close', description: 'Ticket kanalını kapatır' },
            ],

            "Yönetim": [
                { name: '/lock', description: 'Kanalı kilitler/açar' },
                { name: '/slowmode', description: 'Kanal için yavaş mod ayarlar' },
                { name: '/logs', description: 'Log kanalı ayarlar' },
                { name: '/set-welcome', description: 'Hoş geldin mesajı atılacak kanalı ayarlar' },
                { name: '/autorole', description: 'Yeni gelenlere otomatik verilecek rolü ayarlar' },
                { name: '/tagall', description: 'Tüm sunucu üyelerinin isim başına tag ekler' },
                { name: '/automod', description: 'Automode sisteminin kurulumunu yapar' },
                { name: '/ticket-setup', description: 'Ticket sistemi için yapılandırma' },
            ],
            
            "Premium": [
                { name: '/pre-write', description: 'PRE Belirtilen mesaj URL\'sini bot olarak yazdırır' },
            ],

            "Bot Owner": [
                { name: '/pre-ekle', description: 'Şansını deneme bile' },
                { name: '/blacklist', description: 'Sadece gerektiği yerlerde' },
                { name: '/quit', description: 'Blackliste eklendiysen geçmiş olsun' },
            ],

        };

        // 2. Sayfaları Oluştur
        const pages = [];
        const categories = Object.keys(commandCategories);
        
        categories.forEach((category, index) => {
    const embed = new EmbedBuilder()
        .setTitle(`<:mythra:1404425661120122971> ${category} Komutları`)
        .setColor('#FFFFFF')
        .setDescription(`**${category}** kategorisindeki komutlar listelenmiştir.`)
        .addFields(
            commandCategories[category].map(cmd => ({
                name: `\`${cmd.name}\``,
                value: cmd.description,
                inline: false
            })) // Burada addFields için kapanış parantezi eksikti
        )
        .setFooter({ 
            text: `Sayfa ${index + 1}/${categories.length} • ${interaction.user.username}`, 
            iconURL: interaction.user.displayAvatarURL() 
        });

    pages.push(embed);
});

        // 3. Butonları Oluştur (2+ sayfa varsa)
        let components = [];
        if (pages.length > 1) {
            components = [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('help_previous')
                        .setLabel('◀ Önceki')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('help_next')
                        .setLabel('Sonraki ▶')
                        .setStyle(ButtonStyle.Primary)
                )
            ];
        }

        // 4. Yanıtı Gönder
        await interaction.reply({
            embeds: [pages[0]],
            components: components,
            ephemeral: false
        });

        // 5. Sayfalar Arası Geçiş (2+ sayfa varsa)
        if (pages.length > 1) {
            const collector = interaction.channel.createMessageComponentCollector({ 
                filter: i => i.user.id === interaction.user.id, 
                time: 60000 
            });

            let currentPage = 0;
            collector.on('collect', async i => {
                if (i.customId === 'help_previous') currentPage--;
                if (i.customId === 'help_next') currentPage++;

                // Buton durumlarını güncelle
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('help_previous')
                        .setLabel('◀ Önceki')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(currentPage === 0),
                    new ButtonBuilder()
                        .setCustomId('help_next')
                        .setLabel('Sonraki ▶')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === pages.length - 1)
                );

                await i.update({
                    embeds: [pages[currentPage]],
                    components: [row]
                });
            });

            collector.on('end', () => {
                interaction.editReply({ components: [] }).catch(() => {});
            });
        }
    }
};
