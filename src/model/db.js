const sqlite3 = require('sqlite3').verbose()
var sqlite = new sqlite3.Database(
    '/tmp/nexwebeditor.db', 
    sqlite3.OPEN_READWRITE, 
    function (err) {
        if (err) {
            return console.log(err.message)
        }
        console.log('connect database successfully')
    }
)
let db = {}

db.select = function (data, list, where, callback) {
    var sql = `select ${data} from ${list} WHERE ${where}`;
    sqlite.run(sql, function (error, results, fields) {
        if (error) {
            callback('error');
            return false
        };
        callback(results);
    });
}

db.add = function (add, value, listb, callback) {
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
    sqlite.run(sql, value, function (error, results, fields) {
        if (error) {
            callback('error');
            return false;
        }
        callback('ok');
    });
}

db.update = function (update, value, where, listb, callback) {
    var addc = '';
    for (var i = 0; update[i]; i++) {
        addc += ','
        addc += update[i]
        addc += ' = ?'
    }
    addc = addc.substr(1);
    var sql = 'UPDATE ' + listb + ' SET ' + addc + ' WHERE ' + where;
    sqlite.run(sql, value, function (error, results, fields) {
        if (error) return log(sql + ' ' + error), callback({ code: 300, error });
        callback('ok');
    });
}

db.delete = function (list, where, callback) {
    var sql = `DELETE FROM ${list} where ${where}`
    sqlite.run(sql, function (error, results, fields) {
        if (error) {
            callback('error');
            return false
        };
        callback(results);
    });
}

module.exports = db;