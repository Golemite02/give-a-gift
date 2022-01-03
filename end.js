module.exports = {
    config: {
        name: "end",
        description: "Ends a giveaway.",
        usage: "[message-id]",
        category: "Giveaways",
        accessableby: "Admins",
        aliases: [], // To add custom aliases just type ["alias1", "alias2"].
    },
    run: async (client, message, args) => {

        if (!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return message.channel.send('<a:forbidden:750012265083830348> You need \`MANAGE_MESSAGES\` permission to end giveaways.');
        }

        if (!args[0]) {
            return message.channel.send('<a:forbidden:750012265083830348> Please specify ID/Prize name of the giveaway you want to end.');
        }

        let giveaway =
            client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
            client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

        if (!giveaway) {
            return message.channel.send('<a:forbidden:750012265083830348:> I can\'t find a giveaway for `' + args.join(' ') + '`.');
        }
        client.giveawaysManager.edit(giveaway.messageID, {
            setEndTimestamp: Date.now()
        })
            .then(() => {
                message.channel.send('Ending giveaway in ' + (client.giveawaysManager.options.updateCountdownEvery / 10000) + ' secs...');
                message.delete();
            })
            .catch((e) => {
                if (e.startsWith(`Giveaway with message ID ${giveaway.messageID} has already ended.`)) {

                    message.channel.send('This giveaway has already ended.');

                } else {
                    console.error(e);
                    message.channel.send('<a:forbidden:750012265083830348> Something went wrong... retry host a giveaway.');
                }
            });
    },
}
