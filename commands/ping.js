exports.run = (client, message, args) => {
  message.channel.send({embed: {
    color: 3447003,
    author: {
      name: message.author.username,
      icon_url: `https://cdn.discordapp.com/avatars/
        ${message.author.id}/${message.author.avatar}.png`,
    },
    title: "This is the end!",
    description: "pong!"
  }}).catch(console.error);
}
