// PouchDB（NoSQL） 作成
// Movies という名前の DB を作成
var movies = new PouchDB('movies');

// 作成した DB に新規ドキュメントを作成
movies.put({
    _id: 'tdkr',
    title: 'pouch sample',
    director: 'fumiwo',
}).then(function (response) {
    console.log('Success', response);
}).catch(function (err) {
    console.log('Error', err);
});

// ドキュメントの読み取り
movies.get('tdkr').then(function (doc) {
    console.log(doc.title);
}).catch(function (err) {
    console.log(err);
});

// ドキュメントの更新
movies.get('tdkr').then(function (doc) {
    doc.year = '2016';
    console.log(doc._rev);

    // レスポンスを返し、then で拾う
    return movies.put(doc);
}).then(function (res) {
    console.log(res);
});

// ドキュメントの削除
movies.get('tdkr').then(function (doc) {
    return movies.remove(doc);
}).then(function (res) {
    console.log('Remove', res);
});

// DB 情報を表示
movies.info().then(function (info) {
    console.log(info);
});

// ローカル DB（ブラウザの IndexedDB に格納されている）
var localDB = new PouchDB('movies');

// リモート CouchDB
var remoteDB = new PouchDB('http://localhost:5984/movies');

// ローカルの変更をリモート DB に複写
localDB.replicate.to(remoteDB).on('complete', function () {
    // ローカルの変更をリモートに複写
}).on('error', function (err) {
    // 複製中にエラーが発生
});

// 双方向同期を実現
// リモート DB の方からブラウザに変更を同期
// replicates once
localDB.sync(remoteDB);

// リアルタイム同期
// live  リアルタイムに同期するか
// retry コネクションがエラーだった場合にリトライするかどうか
localDB.sync(remoteDB, {
    live: true,
    retry: true
}).on('change', function (change) {
    // 同期完了後、DB からデータを取得
    localDB.get('tdkr').then(function (doc) {
        console.log(doc.title);
    }).catch(function (err) {
        console.log(err);
    });
}).on('error', function (err) {
    console.log('error');
});
