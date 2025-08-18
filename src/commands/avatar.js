const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'Genel',
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Kullanıcının avatarını gösterir')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Avatarını görmek istediğiniz kullanıcı')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        
        const embed = new EmbedBuilder()
            .setTitle(`<:mythra_information:1405888245895794798> ${user.username} Kullanıcısının Profil Fotoğrafı`)
            .setImage(user.displayAvatarURL({ size: 1024 }))
            .setColor('#FFFFFF');
            
        
        await interaction.reply({ embeds: [embed] });
    },
};
