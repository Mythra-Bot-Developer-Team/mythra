const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'Genel',
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Botun çalışma süresini gösterir'),
    async execute(interaction) {
        const uptime = interaction.client.uptime;
        
        // Süreyi formatla
        const seconds = Math.floor(uptime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const formattedUptime = [
            days > 0 ? `${days}g` : null,
            hours % 24 > 0 ? `${hours % 24}s` : null,
            minutes % 60 > 0 ? `${minutes % 60}d` : null,
            `${seconds % 60}sn`
        ].filter(Boolean).join(' ');

        // CPU kullanımı
        const cpuUsage = process.cpuUsage();
        const cpuPercent = ((cpuUsage.user + cpuUsage.system) / (uptime / 1000) / 10).toFixed(2);

        const embed = new EmbedBuilder()
            .setTitle('<:mythra_timer:1405887823004831885> Sunucu Çalışma Durumu')
            .setDescription(`**${formattedUptime}**dir kesintisiz çalışıyor.`)
            .setColor('#FFFFFF')
            .addFields(
                { name: '<:mythra_dot:1405887914113761310> Başlangıç Tarihi', value: new Date(Date.now() - uptime).toLocaleString(), inline: false },
                { name: '<:mythra_dot:1405887914113761310> CPU Kullanımı', value: `${cpuPercent}%`, inline: false },
                { name: '<:mythra_dot:1405887914113761310> RAM Kullanımı', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: false },
                { name: '<:mythra_dot:1405887914113761310> Versiyon', value: "v0.4.7", inline: false }
            )
            .setFooter({ text: `Uptime Kontrol • ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
