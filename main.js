const { app, protocol, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require("path");

const BASEPATH = app.getAppPath();

function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to);
    }
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}; 

let OPTIONS = {
    debug: false
};
if (process.argv.indexOf('-debug') >= 1) {
    OPTIONS.debug = true;
}

copyFolderSync(BASEPATH + "/node_modules/emcJS", BASEPATH + "/emcJS");

function createWindow() {
    protocol.interceptFileProtocol("file", (request, callback) => {
        // // Strip protocol
        let url = request.url.replace(/file\:\/+(:?[a-z]\:)?/i, "");
    
        // Build complete path for node require function
        url = path.join(__dirname, ".", url);
    
        // Replace backslashes by forward slashes (windows)
        // url = url.replace(/\\/g, '/');
        url = path.normalize(url);
    
        //console.log(url);
        callback({path: url});
    });
    let win = new BrowserWindow({
        width: 800,
        height: 700,
        show: false,
        webPreferences: {
            nativeWindowOpen: true,
            //nodeIntegration: true
            //preload: `${__dirname}/../webutils/_preload.js`
        }
        //icon: __dirname + "/icon.png"
    });
    win.maximize();
    win.setMenu(null);
    win.loadFile("/index.html");
    if (!!OPTIONS.debug) {
        win.toggleDevTools();
    }
    win.once('ready-to-show', () => {
        win.show();
    });
    win.on('closed', () => {
        app.quit();
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});