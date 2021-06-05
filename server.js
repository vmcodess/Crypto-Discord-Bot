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
    if (message.content.startsWith(`${prefix}`)) {
        let symbol = message.content;
        console.log(symbol);
    }
})


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
.then((res => {
    // res.data.data[0].quote.USD.price -> GETS THE PRICE OF BTC
    let cryptoSymbol = 'BTC';

    let data = res.data.data;

    // function to iterate through data and return values
    //let returnSymbolPrice = function()

    // save discord users value
    // client.on('message', message => {
    //     if (!message.content.startsWith(prefix) || message.author.bot) return;
    //     if (message.content.startsWith(`${prefix}`)) {
    //         cryptoSymbol = message.content;
    //     }

    //     for (let i of data) {
    //         if (i.symbol.toLowerCase() == cryptoSymbol.toLowerCase()) {
    //             console.log(`Crypto = ${i.symbol} and current price is: ${i.quote.USD.price}`);
    //             //message.channel.send(`Crypto = ${i.symbol} and current price is: ${i.quote.USD.price}`)
    //         }
    //     }
    // })
    for (let i of data) {
        //console.log(i)
        if (i.symbol.toLowerCase() == cryptoSymbol.toLowerCase()) {
            //console.log(i)
            console.log(`Crypto = ${i.symbol} and current price is: ${i.quote.USD.price}`);
            
            client.on('message', message => {
                message.channel.send(`Crypto = ${i.symbol} and current price is: ${i.quote.USD.price}`)
            } )
        } else {
            client.on('message', message => {
                message.channel.send('Not Found.. Please Try Again :)');
            })
        }
    }
}))
.catch((err) => {
    console.log(err);
})


// ----------- ROUTES -----------
app.get('/', (req, res) => {
    res.send('hello');
})

app.listen(PORT, () => {
    console.log('App is working!!!');
})