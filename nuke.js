const { MessageAttachment } = require("discord.js");
const config = require("../../config.json");
const db = require('quick.db');

module.exports = {
    config: {
        name: "nuke",
        aliases: [],
        category: "Giveaways",
        description: "Nuke a channel.",
        usage: "nuke",
        accessableby: "Admins",
    },

run: async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_CHANNELS"))  message.lineReply("<:Faux:906362360770494494> You need `MANAGE_CHANNELS` permission for nuke channels.");
  if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) message.lineReply("I need `MANAGE_CHANNELS` for nuke channels.");

  message.channel.clone({ parent: message.channel.parentID, position: message.channel.rawPosition });
  message.channel.delete();
  message.send("<:Vrai:906362239810940968> Successfully nuked this channel.")

}};
