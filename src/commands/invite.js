const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'Genel',
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Botun davet linkini gönderir'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('<:mythra_externallink:1405888385867972710> Linkler')
            .setDescription('<:mythra_dot:1405887914113761310> **Davet Et:** [Tıkla](http://www.mythra.rf.gd/invite) \n<:mythra_dot:1405887914113761310> **Destek Sunucum:** [Katıl](https://mythra.rf.gd/discord)')
            .setColor('#ffffff');
        
        await interaction.reply({ embeds: [embed] });
    },
};
