const { ChannelType, PermissionFlagsBits } = require('discord.js');

const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Başarıyla başlatıldı.`);

        client.user.setPresence({
      activities: [{
        name: process.env.STATUS || '🤍 /𝗁𝖾𝗅𝗉 | Moderasyon, Eğlence ve daha fazlası!',
        type: ActivityType.Listening
      }],
      status: 'idle'
    });
};
