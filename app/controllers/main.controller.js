const fs = require('fs');
const whatsapp = require('velixs-md');
class MainController {
    constructor(){

    }

    async index(req, res) {
        if(!req.session.auth) return res.redirect('/dash/login');
        const folder_credentials = fs.readdirSync('storage/wa_credentials').map(credential => {
            return {
                origin_name : credential,
                name : credential.replace('_credentials', ''),
                status_session : whatsapp.getSession(credential.replace('_credentials', ''))?.user ? 'online' : 'offline'
            }
        })

        return res.render('index', {
            version : process.env.VERSION,
            layout : 'layouts/main',
            folder_credentials : folder_credentials,
            page_active : 'devices'
         });
    }

    async device(req, res) {
        if(!req.session.auth) return res.redirect('/dash/login');
        const device = req.params.device.replace(/[^a-zA-Z0-9]/g,'').toLowerCase();
        let config_velixs = fs.existsSync(`storage/json/settings.json`) ? JSON.parse(fs.readFileSync(`storage/json/settings.json`)) : {};
        config_velixs = config_velixs[device] ? config_velixs[device] : {};
        const session = whatsapp.getSession(device);
        const status_session = session ? session.user ? true : false : false;
        return res.render('device', {
            version : process.env.VERSION,
            layout : 'layouts/main',
            session_name : device,
            status_session : status_session ? 'online' : 'offline',
            session : session,
            config_velixs : config_velixs,
            route_delete : `/dash/delete/${device}`,
            page_active : 'devices'
        })
    }

    async settings_velixs(req, res) {
        if(!req.session.auth) return res.status(400).json({ status : false, message : 'You are not logged in.' });
        const device = req.params.device;
        const webhook = req.body.webhook;
        const apikey = req.body.apikey;
        if(!fs.existsSync(`storage/json/settings.json`)){
            fs.writeFileSync(`storage/json/settings.json`, JSON.stringify({}));
        }
        const settings = JSON.parse(fs.readFileSync(`storage/json/settings.json`));
        settings[device] = {
            webhook : webhook,
            apikey : apikey
        }
        fs.writeFileSync(`storage/json/settings.json`, JSON.stringify(settings));
        return res.status(200).json({ status : true, message : 'Settings saved' });
    }

    async delete(req, res) {
        if(!req.session.auth) return res.status(400).json({ status : false, message : 'You are not logged in.' });
        if(!fs.existsSync(`storage/wa_credentials/${req.params.device}_credentials/`)) return res.status(400).json({ status : false, message : 'Device not found.' });
        whatsapp.deleteSession(req.params.device).then(() => {
            return res.status(200).json({ status : true, message : 'Device deleted' });
        }).catch((error) => {
            return res.status(500).json({ status : false, message : error.message });
        })
    }

    async apidocs(req, res) {
        if(!req.session.auth) return res.redirect('/dash/login');
        return res.render('apidocs', {
            version : process.env.VERSION,
            layout : 'layouts/main',
            page_active : 'apidocs'            
         });
    }

    async login(req, res) {
        if(req.method == 'POST'){
            const username = req.body.username;
            const password = req.body.password;
            const envauth = process.env.AUTH;
            if(envauth){
                const auth = envauth.split(':');
                if(username == auth[0] && password == auth[1]){
                    req.session.auth = true;
                    return res.status(200).json({ status : true, message : 'Login success' });
                }else{
                    return res.status(400).json({ status : false, message : 'Login failed' });
                }
            }else{
               return res.status(400).json({ status : false, message : 'Auth not set' });
            }
        }else{
            res.render('login',{
                layout : false
            });
        }
    }

    async logout(req, res) {
        req.session.auth = false;
        return res.redirect('/dash/login');
    }
}

module.exports = MainController;