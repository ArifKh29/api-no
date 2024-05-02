const fs = require('fs');
const whatsapp = require('velixs-md');
const Validator = require('../utils/Validator.js');
const axois = require('axios');

class ApiController {
    constructor(){

    }

    async sendMessage(req, res, next) {
        try {
            let receiver = req.body.receiver || req.query.receiver;
            let text = req.body.text || req.query.text;
            let apikey = req.body.apikey || req.query.apikey;
            let message_type = req.body.mtype || req.query.mtype;
            if(!receiver || !apikey || !message_type) throw new Validator('Invalid parameters.', 400);

            let settings = fs.existsSync("storage/json/settings.json", "utf8") ? JSON.parse(fs.readFileSync("storage/json/settings.json", "utf8")) : {};
            let device = Object.keys(settings).find(device => settings[device].apikey == apikey);
            if(!device) throw new Validator('Invalid apikey.', 400);

            const session = whatsapp.getSession(device);
            if(!session) throw new Validator('Device not found.', 400);
            if(!session.user) throw new Validator('Device not connected.', 400);

            switch(message_type){
                case 'text':
                    if(!text) throw new Validator('Invalid parameters.', 400);
                    await whatsapp.sendTextMessage({
                        sessionId : device,
                        to : receiver,
                        isGroup : whatsapp.isGroup(receiver),
                        text 
                    });
                    break;
                case 'image':
                    let image = req.body.url || req.query.url;
                    if(!image) throw new Validator('Invalid parameters.', 400);
                    await whatsapp.sendImage({
                        sessionId: device,
                        to: receiver,
                        text,
                        isGroup: whatsapp.isGroup(receiver),
                        media: image,
                    });
                    break;
                case 'video':
                    let video = req.body.url || req.query.url;
                    if(!video) throw new Validator('Invalid parameters.', 400);
                    await whatsapp.sendVideo({
                        sessionId: device,
                        to: receiver,
                        text,
                        isGroup: whatsapp.isGroup(receiver),
                        media: video,
                    });
                    break;
                case 'document':
                    var filename = req.body.filename || req.query.filename;
                    var document = req.body.url || req.query.url;
                    if(!document) throw new Validator('Invalid parameters.', 400);
                    filename = filename || document.split('/').pop();
                    document = await axois.get(document, { responseType: 'arraybuffer' }).catch(error => { throw new Validator('Invalid document url.', 400) });
                    await whatsapp.sendDocument({
                        sessionId: device,
                        to: receiver,
                        text,
                        isGroup: whatsapp.isGroup(receiver),
                        filename: filename,
                        media: document.data,
                    });
                    break;
                default:
                    throw new Validator('Invalid message type.', 400);
            }
            
            return res.status(200).json({ status : true, message : 'Message sent.', data : { 
                receiver, 
                text, 
                message_type : message_type,
                url : req.body.url || null,
                isGroup : whatsapp.isGroup(receiver)
            } });
        } catch (error) {
            return res.status(error.code || 500).json({ status : false, message : error.message || 'Internal server error.' });
        }
    }

    async fetchGroup(req, res, next) {
        try{
            let apikey = req.body.apikey || req.query.apikey;
            if(!apikey) throw new Validator('Invalid parameters.', 400);

            let settings = fs.existsSync("storage/json/settings.json", "utf8") ? JSON.parse(fs.readFileSync("storage/json/settings.json", "utf8")) : {};
            let device = Object.keys(settings).find(device => settings[device].apikey == apikey);
            if(!device) throw new Validator('Invalid apikey.', 400);

            const session = whatsapp.getSession(device);
            if(!session) throw new Validator('Device not found.', 400);
            if(!session.user) throw new Validator('Device not connected.', 400);
            let chats = await session.groupFetchAllParticipating();
            let groups = Object.values(chats).map((v) => {
                return {
                    id: v.id,
                    name: v.subject,
                    participants: Object.keys(v.participants).length
                };
            });
            return res.status(200).json({ status : true, message : 'Fetched groups.', data : groups });
        }catch(error){
            return res.status(error.code || 500).json({ status : false, message : error.message || 'Internal server error.' });
        }
    }

    async fetchMember(req, res, next) {
        try{
            let apikey = req.body.apikey || req.query.apikey;
            let idgroup = req.body.idgroup || req.query.idgroup;
            if(!apikey || !idgroup) throw new Validator('Invalid parameters.', 400);

            let settings = fs.existsSync("storage/json/settings.json", "utf8") ? JSON.parse(fs.readFileSync("storage/json/settings.json", "utf8")) : {};
            let device = Object.keys(settings).find(device => settings[device].apikey == apikey);
            if(!device) throw new Validator('Invalid apikey.', 400);

            const session = whatsapp.getSession(device);
            if(!session) throw new Validator('Device not found.', 400);
            if(!session.user) throw new Validator('Device not connected.', 400);

            let chats = await session.groupFetchAllParticipating();
            let group = chats[idgroup]
            if(!group) throw new Validator('Group not found.', 400);
            let total_participants = Object.keys(group.participants).length;
            let members = Object.values(group.participants).map((v) => {
                return {
                    id: v.id,
                    number : v.id.split('@')[0],
                    admin : v.admin
                };
            });

            return res.status(200).json({ status : true, message : 'Fetched groups '+ group.subject, total_participants : total_participants , data : members });
        }catch(error){
            return res.status(error.code || 500).json({ status : false, message : error.message || 'Internal server error.' });
        }
    }
}

module.exports = ApiController;