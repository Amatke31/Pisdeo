import localforage from "localforage";

function setFile(name: string, content: any) {
    localforage.setItem(name, content).then(function (value) {
    }).catch(function (err) {
        console.log(err);
    });
}

function getFile(name: string, callback: any) {
    localforage.getItem(name, (err, result) => {
        callback(result)
    })
}

export { setFile, getFile }