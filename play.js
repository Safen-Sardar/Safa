const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ytsr = require("youtube-sr");
const { attentionembed } = require("../util/attentionembed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Search and select videos to play')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The video name or URL to search')
                .setRequired(true)),
    async execute(interaction) {
        // If not in a guild, return
        if (!interaction.guild) return;

        // Define channel
        const { channel } = interaction.member.voice;
        // Get server queue
        const serverQueue = interaction.client.queue.get(interaction.guild.id);

        // React with approve emoji
        await interaction.reply({ content: "<:emoji_46:836689644988923945>", ephemeral: true });

        // Get the search query
        const search = interaction.options.getString('query');

        // Define a temporary Loading Embed
        let temEmbed = new EmbedBuilder()
            .setAuthor({ name: "Searching..." })
            .setColor("#FB0505");

        // Define the Result Embed
        let resultsEmbed = new EmbedBuilder()
            .setTitle("Results for: ")
            .setDescription(`\`${search}\``)
            .setColor("83c0ff")
            .setFooter({ text: "Response with your favorite number", iconURL: interaction.client.user.displayAvatarURL() });

        // Try to find top 5 results
        try {
            // Find them
            const results = await ytsr.search(search, { limit: 5 });
            // Map them and sort them and add a Field to the ResultEmbed
            results.map((video, index) => resultsEmbed.addFields({ name: video.url, value: `${index + 1}. ${video.title}` }));

            // Send the temporary embed
            const resultsMessage = await interaction.channel.send({ embeds: [temEmbed] });

            // React with 5 Numbers
            await resultsMessage.react("1️⃣");
            await resultsMessage.react("2️⃣");
            await resultsMessage.react("3️⃣");
            await resultsMessage.react("4️⃣");
            await resultsMessage.react("5️⃣");

            // Edit the result message to the result embed
            await resultsMessage.edit({ embeds: [resultsEmbed] });

            // Wait for a response
            const filter = (reaction, user) => user.id == interaction.user.id;
            const collector = resultsMessage.createReactionCollector({ filter, max: 1, time: 60000, errors: ['time'] });

            collector.on('collect', (reaction) => {
                let response;
                switch (reaction.emoji.name) {
                    case "1️⃣":
                        response = 1;
                        break;
                    case "2️⃣":
                        response = 2;
                        break;
                    case "3️⃣":
                        response = 3;
                        break;
                    case "4️⃣":
                        response = 4;
                        break;
                    case "5️⃣":
                        response = 5;
                        break;
                    default:
                        response = "error";
                        break;
                }

                if (response === "error") {
                    attentionembed(interaction, "Please use a right emoji!");
                    return resultsMessage.delete().catch(console.error);
                }

                // Get the field name of the response
                const videoUrl = resultsEmbed.fields[response - 1].name;
                // Handle the video selection process
            });

        } catch (error) {
            console.error(error);
            return attentionembed(interaction, "An error occurred while searching for videos.");
        }
    }
};