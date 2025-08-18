const fs = require('fs');
const path = require('path');
const { EmbedBuilder, Events } = require('discord.js');

// Log dosyaları için sabit yol
const LOGS_DIR = path.join(process.cwd(), '');
const LOGS_PATH = path.join(LOGS_DIR, '');

// Dizin yoksa oluştur
function ensureLogsDirectory() {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
}

// Düzeltilmiş getLogChannel fonksiyonu
function getLogChannel(guildId) {
  try {
    ensureLogsDirectory();
    
    if (!fs.existsSync(LOGS_PATH)) {
      return null;
    }

    const fileContent = fs.readFileSync(LOGS_PATH, 'utf8');
    const logsData = JSON.parse(fileContent);
    return logsData[guildId] || null;
    
  } catch (error) {
    console.error('Log kanalı okunurken hata:', error);
    return null;
  }
}


module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
      ensureLogsDirectory();
    // Mesaj silme
    client.on(Events.MessageDelete, async message => {
      if (!message.guild) return;
      const logChannelId = getLogChannel(message.guild.id);
      if (!logChannelId) return;
      const channel = message.guild.channels.cache.get(logChannelId);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setTitle('<:delete:1404039610803294208> Mesaj Silindi')
        .setColor('Red')
        .addFields(
          { name: '<:mythra_member:1405887970807906396> Kullanıcı', value: `${message.author.tag} (${message.author.id})`, inline: true },
          { name: '<:channels:1403877912779817080> Kanal', value: `${message.channel}`, inline: true },
          { name: '<:folder:1403877634995392653> Mesaj', value: message.content || '*Embed veya boş mesaj*' }
        )
        .setTimestamp();

      channel.send({ embeds: [embed] });
    });

    // Mesaj düzenleme
    client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
      if (!oldMessage.guild) return;
      if (oldMessage.partial) await oldMessage.fetch();
      if (newMessage.partial) await newMessage.fetch();

      const logChannelId = getLogChannel(oldMessage.guild.id);
      if (!logChannelId) return;
      const channel = oldMessage.guild.channels.cache.get(logChannelId);
      if (!channel) return;

      if (oldMessage.content === newMessage.content) return;

      const embed = new EmbedBuilder()
        .setTitle('<:mythra_pin:1405887459333640273> Mesaj Düzenlendi')
        .setColor('Yellow')
        .addFields(
          { name: '<:mythra_member:1405887970807906396> Kullanıcı', value: `${oldMessage.author.tag} (${oldMessage.author.id})`, inline: true },
          { name: '<:channels:1403877912779817080> Kanal', value: `${oldMessage.channel}`, inline: true },
          { name: '<:folder:1403877634995392653> Eski Mesaj', value: oldMessage.content || '*Boş*' },
          { name: '<:folder:1403877634995392653> Yeni Mesaj', value: newMessage.content || '*Boş*' }
        )
        .setTimestamp();

      channel.send({ embeds: [embed] });
    });

    // Üye giriş
    client.on(Events.GuildMemberAdd, member => {
      const logChannelId = getLogChannel(member.guild.id);
      if (!logChannelId) return;
      const channel = member.guild.channels.cache.get(logChannelId);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setTitle('<:mythra_wave:1405894813970337893> Yeni Üye Katıldı')
        .setColor('Green')
        .setDescription(`${member} sunucuya katıldı!`)
        .setTimestamp();

      channel.send({ embeds: [embed] });
    });

    // Üye çıkış
    client.on(Events.GuildMemberRemove, member => {
      const logChannelId = getLogChannel(member.guild.id);
      if (!logChannelId) return;
      const channel = member.guild.channels.cache.get(logChannelId);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setTitle('<:mythra_banned:1405893750592372896> Üye Ayrıldı')
        .setColor('DarkRed')
        .setDescription(`${member.user.tag} sunucudan ayrıldı.`)
        .setTimestamp();

      channel.send({ embeds: [embed] });
    });

    // Ban
    client.on(Events.GuildBanAdd, async (guild, user) => {
      const logChannelId = getLogChannel(guild.id);
      if (!logChannelId) return;
      const channel = guild.channels.cache.get(logChannelId);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setTitle('<a:banned:1404038497492533348> Kullanıcı Banlandı')
        .setColor('Red')
        .setDescription(`${user.tag} sunucudan banlandı.`)
        .setTimestamp();

      channel.send({ embeds: [embed] });
    });

    // Kick (audit log ile)
    client.on(Events.GuildMemberRemove, async member => {
      const logChannelId = getLogChannel(member.guild.id);
      if (!logChannelId) return;
      const channel = member.guild.channels.cache.get(logChannelId);
      if (!channel) return;

      const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 20,
      });

      const kickLog = fetchedLogs.entries.first();
      if (!kickLog) return;

      if (kickLog.target.id === member.id) {
        const { executor } = kickLog;

        const embed = new EmbedBuilder()
          .setTitle('<:mythra_kicked:1405891150660767774> Kullanıcı Atıldı (Kick)')
          .setColor('Orange')
          .setDescription(`${member.user.tag} sunucudan atıldı.\n<:mod:1403877159369703586> Atan yetkili: ${executor.tag}`)
          .setTimestamp();

        channel.send({ embeds: [embed] });
      }
    });

    // SES ETKİNLİKLERİ
    // Sese giriş
    client.on(Events.VoiceStateUpdate, (oldState, newState) => {
      const guild = newState.guild;
      const logChannelId = getLogChannel(guild.id);
      if (!logChannelId) return;
      const channel = guild.channels.cache.get(logChannelId);
      if (!channel) return;

      // Sese giriş durumu
      if (!oldState.channelId && newState.channelId) {
        const embed = new EmbedBuilder()
          .setTitle('<:mythra_voice:1406066829742309416> Sese Katılım')
          .setColor('Green')
          .setDescription(`${newState.member} **${newState.channel.name}** kanalına katıldı`)
          .setTimestamp();

        channel.send({ embeds: [embed] });
      }

      // Sesten çıkış durumu
      if (oldState.channelId && !newState.channelId) {
        const embed = new EmbedBuilder()
          .setTitle('<:mythra_disconnect:1406066768316862474> Sesten Ayrılma')
          .setColor('Red')
          .setDescription(`${newState.member} **${oldState.channel.name}** kanalından ayrıldı`)
          .setTimestamp();

        channel.send({ embeds: [embed] });
      }

      // Kanal değiştirme durumu
      if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
        const embed = new EmbedBuilder()
          .setTitle('<:mythra_voice:1406066829742309416> Ses Kanalı Değişimi')
          .setColor('Blue')
          .setDescription(`${newState.member}\n**${oldState.channel.name}** → **${newState.channel.name}**`)
          .setTimestamp();

        channel.send({ embeds: [embed] });
      }

      // Mikrofon/Ses durum değişiklikleri
      if (oldState.mute !== newState.mute || oldState.deaf !== newState.deaf || oldState.streaming !== newState.streaming) {
        const changes = [];
        
        if (oldState.mute !== newState.mute) {
          changes.push(newState.mute ? '<:mythra_miq:1406066958969077821> Mikrofonu kapattı' : '<:mythra_miq:1406066958969077821> Mikrofonu açtı');
        }
        
        if (oldState.deaf !== newState.deaf) {
          changes.push(newState.deaf ? '<:mythra_closevoice:1406066885585535156> Kulaklığını kapattı' : '<:mythra_voice:1406066829742309416> Kulaklığını açtı');
        }
        
        if (oldState.streaming !== newState.streaming) {
          changes.push(newState.streaming ? '<:mythra_video:1406067006251204792> Ekran paylaşımı başlattı' : '<:mythra_video:1406067006251204792> Ekran paylaşımını durdurdu');
        }

        if (changes.length > 0) {
          const embed = new EmbedBuilder()
            .setTitle('<:mythra_channelupdate:1405893690240794655> Ses Ayarları Değişikliği')
            .setColor('Purple')
            .setDescription(`${newState.member} **${newState.channel?.name || 'Bilinmeyen'}** kanalında:\n${changes.join('\n')}`)
            .setTimestamp();

          channel.send({ embeds: [embed] });
        }
      }
    });
  }
};
