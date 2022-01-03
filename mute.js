const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports = {
    config: {
        name: "mute",
        category: 'Giveaways',
        description: "Mutes a member in the discord!",
        usage: "[name | nickname | mention | ID] <reason> (optional)",
    },
    run: async (bot, message, args) => {
        try {
            if (!message.member.hasPermission("MANAGE_GUILD")) message.lineReply("<:Faux:906362360770494494> You need `MANAGE_ROLES` permission for mute an user.");

            if (!message.guild.me.hasPermission("MANAGE_GUILD")) message.lineReply(":warning: I need `MANAGE_ROLES` permission for mute an user")
            if (!args[0]) message.lineReply("Command usage: `gg!mute <user_id/mention> <reason>`");

            var mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
            if (!mutee) message.lineReply('Command usage: `gg!mute <user_id/mention> <reason>');

            if (mutee === message.member) return message.channel.send("<:Faux:906362360770494494> You cannot mute yourself.")
            if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send('<:Faux:906362360770494494> I can\'t mute this user, this user have an highest role than me.')

            let reason = args.slice(1).join(" ");
            if (mutee.user.bot) return message.channel.send("<:Faux:906362360770494494> I can't mute a bot/moderator.");
            const userRoles = mutee.roles.cache
                .filter(r => r.id !== message.guild.id)
                .map(r => r.id)

            let muterole;
            let dbmute = await db.fetch(`muterole_${message.guild.id}`);
            let muteerole = message.guild.roles.cache.find(r => r.name === "Muted")

            if (!message.guild.roles.cache.has(dbmute)) {
                muterole = muteerole
            } else {
                muterole = message.guild.roles.cache.get(dbmute)
            }

            if (!muterole) {
                try {
                    muterole = await message.guild.roles.create({
                        data: {
                            name: "Muted",
                            color: "#514f48",
                            permissions: []
                        }
                    })
                    message.guild.channels.cache.forEach(async (channel) => {
                        await channel.createOverwrite(muterole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false,
                            SPEAK: false,
                            CONNECT: false,
                        })
                    })
                } catch (e) {
                    console.log(e);
                }
            };

            if (mutee.roles.cache.has(muterole.id)) return message.channel.send(":warning: This user is already muted.")

            db.set(`muteeid_${message.guild.id}_${mutee.id}`, userRoles)
          try {
            mutee.roles.set([muterole.id]).then(() => {
                mutee.send(`You have been muted in ${message.guild.name} Reason: \`${reason || "No Reason"}\``).catch(() => null)
            })
            } catch {
                 mutee.roles.set([muterole.id])                               
            }
                if (reason) {
                const sembed = new MessageEmbed()
                    .setColor("YELLOW")
                    .setAuthor(message.guild.name, message.guild.iconURL())
                    .setDescription(`**${mutee.user.username}${mutee.user.discriminator}** was successfully muted.
Reason: \`${reason}\``)
                message.channel.send(sembed);
                } else {
                    const sembed2 = new MessageEmbed()
                    .setColor("YELLOW")
                    .setDescription(`**${mutee.user.username}${mutee.user.discriminator}** was successfully muted`)
                message.channel.send(sembed2);
                }
            
            let channel = db.fetch(`modlog_${message.guild.id}`)
            if (!channel) return;

            let embed = new MessageEmbed()
                
                .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
                let embed = new MessageEmbed()
             .setColor('YELLOW')
              .setTitle('**Moderation - Muted user info**')
             .setDescription(`
Muted User: **${mutee.user.username}${mutee.user.discriminator}**
ID: **${mutee.user.id}**
Moderator: <@${message.author.id}>
Reason: \`${reason || "`No Reason`"}\``)
.setFooter('Mod-logs')
.setTimestamp()

            var sChannel = message.guild.channels.cache.get(channel)
            if (!sChannel) return;
            sChannel.send(embed)
        } catch {
            return;
        }
    }
}