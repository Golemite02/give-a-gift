const config = require("../../config.json")

   module.exports = {
    config: {
        name: "purge",
        description: "Clears messages for you",
        usage: "[messages_amount]",
        category: "Giveaways",
        accessableby: "Admins",
        aliases: [], // To add custom aliases just type ["alias1", "alias2"].
    },

    run: async (client, message, args) => {

        if(!args[0]) return message.reply('<a:forbidden:750012265083830348> Enter an amount of messages to delete!');
        if(isNaN(args[0])) return message.reply('<a:forbidden:750012265083830348> This number does not exist.');

        if(args[0] > 100) return message.reply('<a:forbidden:750012265083830348> You cant delete more than 100 messages.');
        if(args[0] < 1) return message.reply('Command usage:```gg!purge <messages_amount>```(Amount have to be between 1-100.)  ');

        await message.channel.messages.fetch({limit: args[0]}).then(messages =>{

            message.channel.bulkDelete(messages);
        });
    }
 
}
