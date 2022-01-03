const db = require("quick.db")

module.exports = {
    config: {
        name: "modlogs",
        category: "Giveaways",
        aliases: ['setm', 'sm', 'smc'],
        description: "Sets A Channel Where The Bot Can Send Moderation Logs!",
        usage: "[channel mention | channel ID | channel name]",
        accessableby: "Admins"
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("<a:forbidden:750012265083830348> You need `ADMINISTRATOR` permission for set a moderation logs channel.")
    if (!args[0]) {
      let b = await db.fetch(`mod-log-${message.guild.id}`);
      let channelName = message.guild.channels.cache.get(b);
      if (message.guild.channels.cache.has(b)) {
        return message.channel.send(`Mod-Log channel of this server is: \`${channelName.name}\``
        );
      } else
        return message.channel.send(
          "Provide a channel ID/Name to set as mod-log channel."
        );
    }
        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

        if (!channel || channel.type !== 'text') return message.channel.send("The channel you want to set have to be a text channel.");

        try {
            let a = await db.fetch(`mod-log-${message.guild.id}`)

            if (channel.id === a) {
                return message.channel.send("This channel is already a mod-log channel.")
            } else {
                bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send("Here will be all moderation logs of this server!")
                db.set(`modlog_${message.guild.id}`, channel.id)

                message.channel.send(`Mod-log channel has been set successfully in #${channel.name}.`)
            }
        } catch {
            return message.channel.send("Something went wrong... I dont have enough permissions or the channel is not a text channel.");
        }
    }
};