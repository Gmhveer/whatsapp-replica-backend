
const { Client, LegacySessionAuth } = require('whatsapp-web.js');
const fs = require('fs');
// Path where the session data will be stored
const SESSION_FILE_PATH = '../public/session.json';
const { MongoStore } = require('wwebjs-mongo');

// const store = new MongoStore({ mongoose: mongoose });
// Create an express session and configure it to use the MongoDB based session store
// const sessionMiddleware = session({
//     secret: 'some-secret-key',
//     store: MongoStore.create({
//         mongoUrl: 'mongodb://localhost:27017/whatsapp-web-session',
//         ttl: 14, // 14 days
//         autoRemove: 'interval',
//         autoRemoveInterval: 10, // In minutes. Default
//     }),
//     resave: false,
//     saveUninitialized: false
// });
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}
// Register the session middleware with the client
const whatsapp_io = new Client({
    webVersionCache: {
        type: "remote",
        remotePath:
            "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
});// whatsapp_io.use(sessionMiddleware);




module.exports = initSocket = () => {
    const { Io } = global;
    console.log("$$$$$_ Server Connected to client _$$$$$");


    //Create Socket Connection
    Io.on('connection', (client) => {
        console.log('connection establish', client.id);

        client.on('GET_QR', () => {
            console.log('[ Now Whats app Client Initiate ]');
            whatsapp_io.initialize();
        });

        client.on('LOGOUT', (client) => {
            console.log('logout Connected User:_________', client);
            // console.log(path.join(__dirname, `../../${fd}`), "Event called Dissconnect-=----->>>");
            // fs.unlink(path.join(__dirname, `../../${fd}`), (err) => {
            //     if (err) throw err; console.log("Delete File successfully.");
            // });
            // whatsapp_io.logout();
        });


        //Get Contact list
        client.on('CONTACT_LIST', (check) => {
            //Fetch all contact list
            whatsapp_io.getContacts().then((contacts) => {
                console.log("[WhatsApp Contact list Raw Data]: ",contacts);
                if (contacts.length > 0) {
                    let result = contacts.map(list => { return ({ user: list.id, number: list.number, name: list.name ? list.name : 'Unknown' }) });
                    Io.sockets.emit('contact_list', { contact_list: result });
                }
            });
        });

    });

    whatsapp_io.on('remote_session_saved', async (data) => {
        // Do Stuff...
        console.log("Session Event alllllllled=--------------------------------", data);

    })


    whatsapp_io.on('authenticated', async (session) => {
        console.log(session, "Session--------------------");
        // await store.save({session: 'OCI_session'});
    });

    whatsapp_io.on('qr', qr => {
        console.log('Genrate QR =>', new Date(), qr);
        Io.sockets.emit('qr', { qr: qr });
    });


    //Screen loading Event
    whatsapp_io.on('loading_screen', (percent) => {
        if (percent == 100) Io.sockets.emit('loading_screen', { loading: 'end' });
        else Io.sockets.emit('loading_screen', { loading: 'start' });
    });


    //Screen disconnect Event
    whatsapp_io.on('disconnected', () => {
        // fs.unlink(path.join(__dirname, `../../${fd}`), (err) => {
        //     if (err) throw err; console.log("Delete File successfully.");
        // });
        Io.sockets.emit('disconnected', { loading: 'NAVIGATION' });
    });

    //Ready for connection
    whatsapp_io.on('ready', () => {
        console.log('whatsapp_io is ready!');
        Io.sockets.emit('loading_screen', { loading: 'start' });

        //Fetch all contact list
        // whatsapp_io.getContacts().then((contacts) => {
        //     if (contacts.length > 0) {
        //         let result = contacts.map(list => { return ({ user: list.id, number: list.number, name: list.name ? list.name : 'Unknown' }) });
        //         Io.sockets.emit('contact_list', { contact_list: result });
        //     }
        // });
    });


    //Whatsapp Socket message event
    whatsapp_io.on('message', async msg => {
        console.log(msg);
        // if (msg.hasMedia) {
        //     const media = await msg.downloadMedia();
        //     console.log(media, "Media-=-=-=-=");
        //     msg.dmedia = media; 
        //     // do something with the media data here
        // }
        //Message From User
        if (msg['id'].remote == "status@broadcast") {
            msg.eventType = 'status';
            // if(msg.hasMedia) msg.dmedia = await msg.downloadMedia();
        } else if (msg['id'].remote && !msg.author) {
            msg.eventType = "chat";
            // if(msg.hasMedia) msg.dmedia = await msg.downloadMedia();
        } else if (msg.author) {
            msg.eventType = "groupChat";
        } else {
            // console.log(msg, 'MESSAGE RECEIVED');
        }
        return Io.sockets.emit('message_list', { message_list: msg });
    });


}

