const mongoose = require("mongoose");

module.exports = {
    // https://mongoosejs.com/docs/5.x/docs/deprecations.html
    // https://velog.io/@untiring_dev/MongoDB-MongoDB-Mongoose%EC%97%90-%EC%97%B0%EA%B2%B0
    connect: DB_HOST => {
        // // 몽고 드라이버의 업데이트된 URL 스트링 파서 사용
        // mongoose.set('useNewUrlParser', true);
        // // findAndModify() 대신 findOneAndUpdate() 사용
        // mongoose.set('useFindAndModify', false);
        // // ensureIndex() 대신 createIndex() 사용
        // mongoose.set('useCreateIndex', true);
        // // 새로운 서버 디스커버리 및 모니터링 엔진 사용
        // mongoose.set('useUnifiedTopology', true);
        // DB에 연결
        mongoose.connect(DB_HOST);
        // 연결에 실패하면, 에러 로깅
        mongoose.connection.on('error', error => {
            console.log(error);
            console.log('MongoDB connection error. Plz make sure Mongodb is running');
        })
        // process.exit();
    },

    close: () => {
        mongoose.connection.close();
    }
}