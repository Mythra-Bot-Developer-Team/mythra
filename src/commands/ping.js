const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'Genel',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Botun gecikme süresini gösterir'),
    async execute(interaction) {
        const ping = interaction.client.ws.ping;
        
        // Renk belirleme (ping'e göre)
        let color;
        if (ping < 100) color = '#00ff00'; // Yeşil (iyi)
        else if (ping < 200) color = '#ffff00'; // Sarı (orta)
        else color = '#ff0000'; // Kırmızı (kötü)

        const embed = new EmbedBuilder()
            .setTitle('<:servers:1404016997389566052> Toplam Gecikme Süresi')
            .setDescription(`Gecikme süresi: **${ping}ms**`)
            .addFields(
                { name: '<:mythra_dot:1405887914113761310> Ping Değeri', value: ping < 150 ? '<:online_status:1403877439377248366> Normal' : ping < 300 ? '<:idle_status:1403877583363510292> Orta' : '<:dnd_status:1403877397119631450> Yüksek', inline: true },
            )
            .setColor(color)
            .setFooter({ text: `Ping Ölçer • ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
