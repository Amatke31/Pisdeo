function openDB(name: string, db: any) {
    var request = window.indexedDB.open(name);
    request.onerror = function (e) {
        console.log('Open Error!');
    };
    request.onsuccess = function (e: any) {
        db.db = e.target.result;
    };
}


export { openDB }