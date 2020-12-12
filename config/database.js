var mysql = require('mysql');
var dbInfo = {
  host: "localhost",
  user: "user",
  password: "1234",
  database: "node",
}

module.exports = {
    init: function () {
        return mysql.createConnection(dbInfo);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}