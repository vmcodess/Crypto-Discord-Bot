const express = require('express');
const app = express();
const axios = require('axios');
const { prefix } = require('./config.json');
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const PORT = process.env.PORT || 3000;

client.login(process.env.DISCORD_TOKEN);

client.once('ready', readyDiscord);

function readyDiscord() {
    console.log('ReadyDiscord');
}

//prints the users message content
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    if (message.content.startsWith(`${prefix}`)) {
        let args = message.content.slice(prefix.length).trim().split(' ');
        let command = args.shift().toUpperCase();
        console.log(command);

        axios({
            method: 'get',
            url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
            qs: {
                'start': '1',
                'limit': '5000',
                'convert': 'USD'
            },
            headers: {
                'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API
            },
            json: true,
            gzip: true
        })
        .then((res) => {
            let data = res.data.data;

            for (let i of data) {
                if (i.symbol == command) {
                    //console.log(i)
                    //console.log(`Crypto = ${i.symbol} and current price is: ${i.quote.USD.price.toFixed(2)}`);

                    const setMessageEmbed = new Discord.MessageEmbed();
                    setMessageEmbed
                        .setColor('#0099ff')
                        .setTitle('Current Price');
                        
                    message.channel.send(setMessageEmbed);
                    message.channel.send(`Crypto = ${i.symbol} and current price is: $${i.quote.USD.price.toFixed(2)} USD`)
                } //else {
                    //message.channel.send('Not Found.. Please Try Again :)');
                    //console.log('try again')
                //}
            }
        })
        .catch((err) => {
            console.log(`err calling API: ${err}`);
        })
    }
})





// ----------- ROUTES -----------
app.get('/', (req, res) => {
    res.send('hello');
})

app.listen(PORT, () => {
    console.log('App is working!!!');
})