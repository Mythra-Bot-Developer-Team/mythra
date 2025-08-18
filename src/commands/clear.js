const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: 'Moderasyon',
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Belirtilen sayıda mesajı siler')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Silinecek mesaj sayısı (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Sadece belirli kullanıcının mesajlarını siler'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const user = interaction.options.getUser('user');

        try {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            let filtered = messages;

            if (user) {
                filtered = filtered.filter(m => m.author.id === user.id);
            }

            const toDelete = filtered.first(Math.min(amount, filtered.size));
            const deleted = await interaction.channel.bulkDelete(toDelete, true);

            const fields = [
                { name: '<:mythra_checkno:1405892611520204821> Silinen Mesaj Sayısı', value: `${deleted.size} adet`, inline: false },
                user && { name: '<:mythra_checkno:1405892611520204821> Filtre', value: `Sadece ${user.username}`, inline: false },
                { name: '<:mythra_staff:1405887869272457329> Yetkili', value: interaction.user.tag, inline: false }
            ].filter(Boolean);

            const embed = new EmbedBuilder()
                .setColor('#99AAb5')
                .setTitle('<:delete:1404039610803294208> Mesajlar Silindi')
                .addFields(fields)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Mesaj silme hatası:', error);
            await interaction.reply({ 
                content: '<:cypher_think:1403879978054979755> Mesajlar silinirken bir hata oluştu.', 
                ephemeral: false 
            });
        }
    }
};
