import localforage from "localforage";

let NWD_DB = localforage.createInstance({
    name: "NWD_DB"
})

function setFile(name: string, content: any) {
    NWD_DB.setItem(name, content).then(function (value) {
    }).catch(function (err) {
        console.log(err);
    });
}

function getFile(name: string, callback: any) {
    NWD_DB.getItem(name, (err, result) => {
        callback(result)
    })
}

function recovery(callback: any) {
    NWD_DB.clear().then(function () {
        callback(true)
    }).catch(function (err) {
        callback(false)
    });
}

export { setFile, getFile, recovery }