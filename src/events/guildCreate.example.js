const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const blacklistPath = path.join(__dirname, '');

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    // 1. Blacklist kontrolü
    if (fs.existsSync(blacklistPath)) {
      let blacklist = { sunucular: [], uyeler: [] };
      try {
        blacklist = JSON.parse(fs.readFileSync(blacklistPath, 'utf8'));
        if (!blacklist.sunucular) blacklist.sunucular = [];
      } catch {
        blacklist = { sunucular: [], uyeler: [] };
      }

      if (blacklist.sunucular.find(s => s.id === guild.id)) {
        try {
          const owner = await guild.fetchOwner();
          await owner.send('<a:white_warn:1403878878761713684> Sunucunuz, blacklist\'te olduğu için botu kullanamazsınız. **Bot sunucudan ayrılıyor.**');
        } catch {
          // DM atılamazsa sessizce devam
        }
        await guild.leave();
        return; // Bot çıktı, işlemler burada biter
      }
    }

    // 2. Sunucu sahibine hoş geldin mesajı
    try {
      const owner = await guild.fetchOwner();

      const embed = new EmbedBuilder()
        .setColor('#ffffff')
        .setTitle('<:mythra:1404425661120122971> Yeni Bir Sunucuya Eklendim')
        .setDescription(`Merhaba **${owner.user.username}**,\nBotumuzu eklediğin için teşekkür ederiz, destek için [sunucumuza](https://discord.gg/9JaHQhAqqZ) katılabilirsin. *by Mythra Family*`)
        .addFields(
          { name: '<:mythra_dot:1405887914113761310> Sunucu', value: guild.name, inline: false },
          { name: '<:mythra_slash:1405888956184133786> Yardım', value: '</help:1404028368508424295> komutu ile kullanım bilgilerini görebilirsiniz.', inline: false }
        )
        .setThumbnail(guild.client.user.displayAvatarURL())
        .setTimestamp();

      await owner.send({ embeds: [embed] }).catch(e => {
        console.log(`${guild.name} sunucusunda sahibe DM atılamadı:`, e.message);
        const generalChannel = guild.systemChannel || guild.channels.cache.find(ch => ch.type === 0 && ch.permissionsFor(guild.members.me).has('SendMessages'));
        if (generalChannel) {
          generalChannel.send({ content: `<@${owner.id}>`, embeds: [embed] });
        }
      });
    } catch (error) {
      console.error('Sunucu katılma mesajı gönderilirken hata:', error);
    }

    // 3. Log kanalına bilgi gönderimi
    try {
      const joinLogChannel = guild.client.channels.cache.get('1405815737653923934');
      
      if (joinLogChannel) {
        const owner = await guild.fetchOwner();
        const invite = await guild.invites.create(guild.rulesChannel || guild.systemChannel || guild.channels.cache.find(ch => ch.type === 0), {
          reason: 'Bot join server invite',
          maxAge: 0, // Never expires
          maxUses: 0 // Unlimited uses
        }).catch(() => null);

        const joinEmbed = new EmbedBuilder()
          .setColor('#ffffff')
          .setTitle('<a:white_verify:1403877783276617839> Yeni Bir Sunucuya Eklendim')
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .addFields(
            { name: '<:mythra_dot:1405887914113761310> Sunucu Adı', value: guild.name, inline: true },
            { name: '<:mythra_member:1405887970807906396> Üye Sayısı', value: guild.memberCount.toString(), inline: true },
            { name: '<:mythra_crown:1405888499487477913> Kurucusu', value: `${owner.user.tag} (${owner.id})`, inline: true }
          )
          .setTimestamp();

        if (invite) {
          joinEmbed.addFields({ name: '<:mythra_link:1405887673222299748> Davet Linki', value: invite.url, inline: false });
        }

        await joinLogChannel.send({ embeds: [joinEmbed] });
      }
    } catch (error) {
      console.error('Sunucu katılma logu gönderilirken hata:', error);
    }
  }
};
