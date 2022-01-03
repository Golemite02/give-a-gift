const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    config: {
        name: "ban",
        aliases: [],
        category: "Giveaways",
        description: "Bans the user",
        usage: "[name | nickname | mention | ID] <reason> (optional)",
        accessableby: "Admins",
    },
    run: async (bot, message, args) => {
        try {
            if (!message.member.hasPermission("BAN_MEMBERS")) message.lineReply("<a:forbidden:750012265083830348> You need `BAN_MEMBERS` permission to ban members.");
            if (!message.guild.me.hasPermission("BAN_MEMBERS")) message.lineReply("I need `BAN_MEMBERS` permission for ban members.");
            if (!args[0]) message.lineReply("Command usage: `gg!ban <user_id/mention_user>` ")

            let banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
            if (!banMember) message.lineReply("This user is not in the server.");
            if (banMember === message.member)message.lineReply("<a:forbidden:750012265083830348> You cant ban yourself.")

            var reason = args.slice(1).join(" ");

            if (!banMember.bannable) message.lineReply("<a:forbidden:750012265083830348> I cant ban this user.")
            try {
            banMember.send(`<:banhammer:911701210300567563> You was banned from ${message.guild.name}.
           Reason: ${reason || "`No reason provided`"}`).then(() =>
                message.guild.members.ban(banMember, { days: 7, reason: reason })).catch(() => null)
            } catch {
                message.guild.members.ban(banMember, { days: 7, reason: reason })
            }
            if (reason) {
            var sembed = new MessageEmbed()
                .setColor("FFFF00")
                .setTitle("**Banned user**")
                .setDescription(`**${banMember.user.username}** has been banned for ${reason}`)
            message.channel.send(sembed)
            } else {
                var sembed2 = new MessageEmbed()
                .setColor("FFFF00")
                .setTitle("**Banned user**")
                .setDescription(`**${banMember.user.username}#${banMember.user.discriminator}** has been banned`)
            message.channel.send(sembed2)
            }
            let channel = db.fetch(`modlog_${message.guild.id}`)
            if (channel == null) return;

            if (!channel) return;

           const embed = new MessageEmbed()
          .setTitle('**Moderation - Banned user info:**')
          .setColor('ffe100')
          .setDescription(`
          Banned user: **${banMember.user.username}#${banMember.user.discriminator}**
          ID: **${banMember.user.id}**
          Reason: \`${reason || "`No Reason`"}\`
          Moderator: <@${message.author.id}>
         `)
.setFooter('Mod-logs')
.setTimestamp();

            var sChannel = message.guild.channels.cache.get(channel)
            if (!sChannel) return;
            sChannel.send(embed)
        } catch (e) {
            return message.channel.send(`**${e.message}**`)
        }
    }
};