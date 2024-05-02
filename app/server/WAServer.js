const whatsapp = require('velixs-md');
const fs = require('fs');
const { toDataURL } = require("qrcode");
const Serialize = require('../utils/serialize.js'); 
const { default: axios } = require('axios');
const Validator = require('../utils/Validator.js');
const axois = require('axios');
const logger = require('../utils/Logs.js');

class WAServer{
    constructor(io){
        this.io = io;
        this.autoStart();
        this.main();
    }

    async autoStart(){
        whatsapp.setCredentialsDir("storage/wa_credentials")
        whatsapp.loadSessionsFromStorage();
    }

    async main(){
        const io = this.io;
        const socket = io.on("connection", (socket) => {
            socket.on("qr_generate", async(session) => {
                try {
                    await whatsapp.startSession(session, { printQR: false });
                    whatsapp.onQRUpdated(async (data) => {
                        const qr = await toDataURL(data.qr);
                        socket.emit("qr_update", { qr : qr, session : session });
                        socket.emit("logs", {
                            session : session,
                            type : 'info',
                            message : 'QR Code Updated'
                        })    
                    });
                } catch (error) {
                    socket.emit("logs", {
                        type : 'error',
                        message : error.message
                    })
                }
            });
        });
        
        whatsapp.onConnected(async (session) => {
            socket.emit("logs", {
                session : session,
                type : 'info',
                message : 'Session Connected'
            })
        
            socket.emit("connected", {
                session : session
            })

            logger.info('Session Connected : ' + session);
        });
        
        whatsapp.onDisconnected(async (session) => {
            socket.emit("logs", {
                session : session,
                type : 'error',
                message : 'Session Disconnected'
            })
        
            socket.emit("disconnected", {
                session : session
            })
        });
        
        whatsapp.onMessageReceived(async (msg) => {
            try {
                if(fs.existsSync("storage/json/settings.json")){
                    var settings = JSON.parse(fs.readFileSync("storage/json/settings.json"));
                    settings = settings[msg.sessionId];
                    if(settings?.webhook){
                        const message = await new Serialize(whatsapp.getSession(msg.sessionId), msg);
                        var data = {
                            session : msg.sessionId,
                            from : message.from,
                            sender : message.sender,
                            isGroup : message.isGroupMsg,
                            body : message.body,
                            messageType : message.typeMessage,
                            message : message.msg.message
                        }
                        axios.post(settings.webhook, data)
                        .then(async res => {
                            if (res.data.data != 'false') {
                                let data = JSON.parse(res.data.data);
                                switch(data.messageType){
                                    case 'text':
                                        await whatsapp.sendTextMessage({
                                            sessionId : msg.sessionId,
                                            to : data.to,
                                            text: data.text,
                                            isGroup : whatsapp.isGroup(data.to)
                                        });
                                        break;
                                    case 'image':
                                        await whatsapp.sendImage({
                                            sessionId: msg.sessionId,
                                            to: data.to,
                                            text : data.text,
                                            media: data.url,
                                            isGroup : whatsapp.isGroup(data.to)
                                        });
                                        break;
                                    case 'video':
                                        await whatsapp.sendVideo({
                                            sessionId: msg.sessionId,
                                            to: data.to,
                                            text : data.text,
                                            media: data.url,
                                            isGroup : whatsapp.isGroup(data.to)
                                        });
                                        break;
                                    case 'document':
                                        var filename = data.filename || null;
                                        var document = data.url
                                        filename = filename || document.split('/').pop();
                                        document = await axois.get(document, { responseType: 'arraybuffer' }).catch(error => { throw new Validator('Invalid document url.', 400) });
                                        await whatsapp.sendDocument({
                                            sessionId: msg.sessionId,
                                            to: data.to,
                                            text : data.text,
                                            filename: filename,
                                            media: document.data,
                                            isGroup : whatsapp.isGroup(data.to)
                                        });
                                        break;
                                    default:
                                        throw new Validator('Invalid message type.', 400);
                                }
                            }
                        })
                        .catch(err => {
                            // console.log(err);
                        });
                    }
                }
            } catch(err) {
                // console.log(err);
            }
           
        });
    }
}

module.exports = WAServer;