const express = require('express');
const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  response.sendStatus(200);
});
app.listen(process.env.PORT);
const { Client, Collection, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
require("dotenv").config();
const client = new Client({
    intents: 32767,
    ws: { properties: { $browser: "Discord iOS" }}
});
module.exports = client;
const config = require(`./config.json`)
client.slashCommands = new Collection();
client.config = require("./config.json");

require("./handler")(client);

client.on("messageCreate", message => {
    
    if (message.author.bot) return;
    if (message.channel.type == '')
    return
    if(message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) {

        
        
    let but = new MessageActionRow()
.addComponents(
    new MessageButton()
.setLabel("Meu servidor")
.setStyle("LINK")
.setURL("https://discord.gg/rdvstore"),


    
   
        


     new MessageButton()
 .setLabel(`Ping:  ${client.ws.ping}`)   
.setStyle("SECONDARY")
 .setCustomId("ping")
 .setDisabled(true),
          );
        
        
    let bot = new MessageEmbed()
    
    .setColor("2F3136")
    .setDescription(`Prefixo: a! me compre falando com o ! kgb'Lofy`)
.setImage("https://media.discordapp.net/attachments/979439490735153222/988844287498276914/standard.gif")
  message.reply({ embeds: [bot], components: [but] })
    }
}); 



client.on("messageCreate", message => {
    let botao = new MessageActionRow()

                  .addComponents(

                      new MessageButton()

                      .setLabel ("MEU SERVIDOR")

                      .setStyle("URL")

                      .setURL("https://discord.gg/VChwjgMV2Q")

                  );

  

     if (message.author.bot) return;

     if (message.channel.type == 'dm') return;

     if (!message.content.toLowerCase().startsWith(config.prefix.toLowerCase())) return;

     if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) {

     const mencionados = new MessageEmbed()

      mencionados.setColor('2F3136')

      mencionados.setDescription('Oi')

message.reply({ embeds: [mencionados]})

     return 



     }

    const args = message.content

        .trim().slice(config.prefix.length)

        .split(/ +/g);

    const command = args.shift().toLowerCase();

    try {

        const commandFile = require(`./commands/${command}.js`)

        commandFile.run(client, message, args);

const logbed = new MessageEmbed()

  .setDescription(`New log ${message.author.tag} usou meu comando \`\`a!${command}\`\`\nNo servidor: \`\`${message.guild.name}\`\`\nNo canal: <#${message.channelId}>`)

    .setColor("#2F3136")

        client.channels.cache.get(`984482748997722142`).send({embeds: [logbed]})

     

      

    } catch (err) {

    console.error('Erro:' + err);

  }

  
    
    })

client.on("interactionCreate", (interaction) => {
  if (interaction.isButton()) {
      if (interaction.customId === "sup") {
          if (interaction.guild.channels.cache.find(c => c.name === `reward-${interaction.user.id}`)) {
              let c = interaction.guild.channels.cache.find(c => c.name === `reward-${interaction.user.id}`);
              interaction.reply({ content: `*Ops Você Já tem um ticket aberto em:* ${c}.`, ephemeral: true })
          } else {
              interaction.guild.channels.create(`reward-${interaction.user.id}`, {
                  type: "GUILD_TEXT",
                // Coloque o ID DA CATEGORIA
                  permissionOverwrites: [
                      {
                          id: interaction.guild.id,
                          deny: ["VIEW_CHANNEL"]
                      },
                      {
                          id: interaction.user.id,
                          allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS"]
                      }
                  ]
              }).then(c => {

                  interaction.reply({ content: `*Ok  abri um ticket para você em:*${c}.`, ephemeral: true })

                  let embed = new MessageEmbed()
                  .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                  .setDescription(`Sejá bem vindo ao suporte da ${interaction.guild.name}, Descreva o ocorrido para que podemos ajudar ao seu suporte!, \n\n agradecemos a sua compreensão,`)
                                    .setTimestamp(new Date())
                  .setColor("#2F3136")

                  let botao = new MessageActionRow()
                  .addComponents(
                      new MessageButton()
                      .setCustomId("suporte")
                      .setLabel ("Fechar Ticket")
                      .setEmoji('<:denied:962182078449983508>')
                      .setStyle("SECONDARY")
                  );

                  c.send({ embeds: [embed], components: [botao] })
              })
          }
      } else if (interaction.customId === "suporte") {
          interaction.reply(`*Iremos deletar esse ticket se caso tiver com dúvidas abra outro Suporte, Ticket fechando em 5 Segundos*`).then(() => {
              setTimeout(() => {
                  interaction.channel.delete();
              }, 5000)
          })
      }
  }
});


client.login(config.token)