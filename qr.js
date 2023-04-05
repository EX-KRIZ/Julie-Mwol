/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const chalk = require('chalk');
const { DisconnectReason, useMultiFileAuthState, downloadContentFromMessage, makeInMemoryStore, BufferJSON, default: makeWASocket } = require('@adiwajshing/baileys');
const fs = require('fs');
const {multiauthState} = require("./lib/multiauth");

async function Singmulti() {
  if (!fs.existsSync(__dirname + "/session.json"))
    await MakeSession("config.SESSION", __dirname + "/session.json");
  const { state } = await useMultiFileAuthState(__dirname + "/session");
  await multiauthState("session.json", __dirname + "/session", state);
}
Singmulti()



setTimeout(() => {
  
  async function connectToWhatsApp() {
  const { state } = await useMultiFileAuthState(__dirname + "/session");

  const conn = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: P({ level: "silent" }),
    patchMessageBeforeSending: (message) => {

    const requiresPatch = !!(
        message.buttonsMessage || message.templateMessage || message.listMessage
    );
    if (requiresPatch) {
        message = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadataVersion: 2,
                        deviceListMetadata: {},
                    },
                    ...message,
                },
            },
        };
    }
    return message;
},
    syncFullHistory: false
  })

  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update


    if (connection === "connecting") {
      console.log("ℹ️ Connecting to WhatsApp... Please Wait.");
    }
if (connection == "open") {
  console.log("Connected to WhatsApp Web✅")
  console.log("WHATS-KRIZ-AI Is Now Online..✅")
  }

    if (connection === 'close') {
      let reason = new Boom(lastDisconnect.error).output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(`Uhh Session Error Please Rescan And Try Again...⚠️`)
        conn.logout()
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Reconnecting...🔁")
        connectToWhatsApp()
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Is Lost  Retrying...🔁")
        connectToWhatsApp()
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("Connection Is Replaced...❗")
        conn.logout()
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(`Connection Is Lost Device Logged Out...🔚`)
        conn.logout()
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required...❗")
        console.log("Restarting...🔁")
        connectToWhatsApp()
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection Timeout Retrying...🔁")
        connectToWhatsApp()
      } else {
        conn.end(`Connection stopped🛑 : ${reason}|${lastDisconnect.error}`)
      }
    }
  })

        
        process.exit(0);
    });

    await conn.connect();
}

whatsAsena()
