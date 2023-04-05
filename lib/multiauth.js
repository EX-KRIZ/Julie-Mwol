const { useMultiFileAuthState, BufferJSON , 
} = require("@adiwajshing/baileys");
const fs = require("fs")
const path = require("path")
  
const KEY_MAP = {
    'pre-key': 'preKeys',
    'session': 'sessions',
    'sender-key': 'senderKeys',
    'app-state-sync-key': 'appStateSyncKeys',
    'app-state-sync-version': 'appStateVersions',
    'sender-key-memory': 'senderKeyMemory'
}
function JSONreplacer(key, value) {
  if (value == null) return;
  const baileysJSON = BufferJSON.replacer(key, value);
  return baileysJSON;
}

const fixFileName = (file) => file?.replace(/\//g, "__")?.replace(/:/g, "-");


module.exports = {

async multiauthState(fileSingle, folderMulti, authState) {
    const authSingleResult = JSON.parse(await fs.promises.readFile(fileSingle, 'utf8'), BufferJSON.reviver)
    const authSingleCreds = authSingleResult.creds || {}
    const authSingleKeys = authSingleResult.keys || {}

    const writeData = (data, file) => {
        return fs.promises.writeFile(path.join(folderMulti, fixFileName(file)), JSON.stringify(data, JSONreplacer()))
    }

    const getKeyByValue = (obj, value) => {
        return Object.keys(obj).find(key => obj[key] === value)
    }

    const keys = Object.fromEntries(Object.entries(authSingleKeys).map(([key, value]) => (value && [getKeyByValue(KEY_MAP, key), value])).filter(Boolean))

    await Promise.all([
        writeData(authSingleCreds, 'creds.json'),
        authState,
    ])
},
};
Footer
© 2023 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact
