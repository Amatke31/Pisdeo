const sqlite3 = require('sqlite3').verbose()
var sqlite = new sqlite3.Database(
    '/tmp/nexwebeditor.db', 
    sqlite3.OPEN_READWRITE, 
    function (err: { message: any }) {
        if (err) {
            return console.log(err.message)
        }
        console.log('connect database successfully')
    }
)
let db: any = {}

db.select = function (data: any, list: any, where: any, callback: (msg: any) => void) {
    var sql = `select ${data} from ${list} WHERE ${where}`;
    sqlite.run(sql, function (error: any, results: string, fields: any) {
        if (error) {
            callback('error');
            return false
        };
        callback(results);
    });
}

db.add = function (add: string[], value: any, listb: string, callback: (msg: any) => void) {
    var addc = '', qc = '';
    for (var i = 0; add[i]; i++) {
        addc += ','
        addc += add[i]
        qc += ','
        qc += '?'
    }
    addc = addc.substr(1);
    qc = qc.substr(1);
    var sql = 'INSERT INTO ' + listb + '(' + addc + ') VALUES(' + qc + ')';
    sqlite.run(sql, value, function (error: any, results: any, fields: any) {
        if (error) {
            callback('error');
            return false;
        }
        callback('ok');
    });
}

db.update = function (update: string[], value: any, where: string, listb: string, callback: (msg: any) => void) {
    var addc = '';
    for (var i = 0; update[i]; i++) {
        addc += ','
        addc += update[i]
        addc += ' = ?'
    }
    addc = addc.substr(1);
    var sql = 'UPDATE ' + listb + ' SET ' + addc + ' WHERE ' + where;
    sqlite.run(sql, value, function (error: string, results: any, fields: any) {
        if (error) return callback({ code: 300, error });
        callback('ok');
    });
}

db.delete = function (list: any, where: any, callback: (msg: any) => void) {
    var sql = `DELETE FROM ${list} where ${where}`
    sqlite.run(sql, function (error: any, results: any, fields: any) {
        if (error) {
            callback('error');
            return false
        };
        callback(results);
    });
}

module.exports = db;