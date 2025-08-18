const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: 'Moderasyon',
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Kullanıcıyı sunucudan kalıcı olarak yasaklar')
        .addUserOption(option => option.setName('user').setDescription('Yasaklanacak kullanıcı').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Yasaklama sebebi'))
        .addIntegerOption(option => option.setName('day').setDescription('Eski mesajları silmek için gün sayısı (0-7)').setMinValue(0).setMaxValue(7))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Sebep belirtilmedi';
        const days = interaction.options.getInteger('day') || 0;

        const embed = new EmbedBuilder()
            .setColor('#ED4245')
            .setTitle('<:mythra_banned:1405893750592372896> Kullanıcı Yasaklandı')
            .addFields(
                { name: '<:mythra_member:1405887970807906396> Kullanıcı', value: `${user.tag} (${user.id})` },
                { name: '<:mythra_staff:1405887869272457329> Yetkili', value: interaction.user.tag },
                { name: '<:mythra_information:1405888245895794798> Neden', value: reason },
                { name: '<:delete:1404039610803294208> Silinen Mesajlar', value: `${days} gün` }
            )
            .setTimestamp();

        try {
            await interaction.guild.members.ban(user, { reason, deleteMessageDays: days });
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: '<:cypher_think:1403879978054979755> Yasaklama işlemi başarısız oldu.', ephemeral: true });
        }
    }
};
