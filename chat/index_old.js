var app = require('express')();
var serverKey = 'AAAA2wV4VnY:APA91bFosnxEAGCnt-9b8dX893R6hu3_KHF1Xg5Nf_J4SCgPlEqG0QV0DHniv176fQ6J85VoodmejOoNUIT7EEU3uPKCPawc3TL_QMBeIpbpVKNtQ1BKPLvplf12ylznjA0va5AMv6g-'; //put your server key here
// var fcm = new FCM(serverKey);



var querystring = require('querystring');
var bodyParser = require('body-parser');
const response = require('./response');
const fs = require('fs')
const fetch = require("node-fetch");
var request = require('request');


var malisonWordList = [];
var request = require('request');
const express = require('express')
var router = express.Router();
var persianDate = require('persian-date');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 7988;
const session = require('express-session');
let api_key = "e42ce0037b7788dbffb41e45f107ea19";
// let config = require('./config.js');
var moment = require('jalali-moment');
require('dotenv').config();
var mongoose = require("mongoose");
var MessageList = require('./model/messageList.js');
var ChatList = require('./model/chatList.js');
var MalisonList = require('./model/malisonList.js');
var ChatUserReport = require('./model/chatUserReport.js');
const Person = require('./model/person').Person;
const config = require('./config.js');
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('...')
});


const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('./middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser]


var db = mongoose.connection;
app.set('view engine', 'ejs');


// app.use(express.static('public'));
mongoose.plugin(require('mongoose-autopopulate'));
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("DB OK");
});
process.env.TZ = 'Asia/Tehran';


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true}));


MalisonList.find().exec((err, malisonList) => {
    malisonList.forEach(item => {
        // console.log('item :', item);
        malisonWordList.push({
            'text': item.text,
        });
    });

    // console.log('malisonWordList :',malisonWordList);
});

// User model
// messageList.findKey('userId':'60715bb9e5d8d57a4cfdea42').exec((err, doc) => {
//     if (doc) {
//         console.log(doc);
//         //req.data.item = doc;
//         // response.ok(req, res, next);
//     } else {
//         console.log(err);
//         // response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
//     }
// })

//
// MessageList.find({
//     userId: '60715bb9e5d8d57a4cfdea42'
// }).exec((err, msgList) => {
//     console.log('msgList :',msgList);
//     // req.data.title = `شهر های استان ${provinceInfo.title}`;
//     // req.data.provinceInfo = provinceInfo;
//     // req.data.items = cityList;
//     // response.ok(req, res, next);
// })

//console.log("test index.js 22");

//moment().locale('fa').format('YYYY/M/D');

app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    req.data = {};
    req.token = null;
    next();
})
app.use('/', router);


router.get('/save_malison', function (req, res,next) {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }

        var text = 'کون';
        var jsonList = JSON.parse(data);
        jsonList = jsonList.word;
        jsonList.forEach(item => {
            const malisonList = new MalisonList({
                text: item,
            });

            malisonList.save(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                }
            });

        });

        response.ok(req, res, null);
    });
});


router.get('/fcm', function (req, res,next) {
    console.log('aaaaaaaaaaaaaaaaaaaaaa');
    var user_id = '62238914d2a93c20dd57581a';
    Person.findById(user_id).exec((err, doc) => {
        if (doc) {

            var fcmToken = doc.fcmToken;
            console.log('------doc----- :', doc);

            // Build the post string from an object
            var post_data = querystring.stringify({
                'title': 'ADVANCED_OPTIMIZATIONS',
                'body': 'json',
                'image': 'compiled_code',
                'page': 'QUIET',
                'sound': ''
            });

            var fcm_notification = querystring.stringify({
                'to': fcmToken,
                'notification': post_data,
                'data': [],
                'priority': 10
            });

            // An object of options to indicate where to post to
            var post_options = {
                host: 'https://fcm.googleapis.com/',
                port: '80',
                path: 'fcm/send',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization:': serverKey
                }
            };


            var http2 = require('http');
            // Set up the request
            var post_req = http2.request(post_options, function (res) {
                res.setHeader("'Content-Type', 'application/json'");
                res.setHeader("'Authorization:', " + serverKey);
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('Response: ' + chunk);
                });
            });


            // post the data
            post_req.write(post_data);
            post_req.end();


            //
            // var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            //     to: doc.fcmToken,
            //     collapse_key: '',
            //     notification: {
            //         title: 'Title of your push notification',
            //         body: 'Body of your push notification'
            //     },
            //     data: {  //you can send only notification or only data(or include both)
            //         my_key: 'AMEDA CHAND',
            //         my_another_key: 'AMEDA MIKHAM'
            //     }
            // };
            //
            // fcm.send(message, function(err, response){
            //     if (err) {
            //         console.log("Something has gone wrong!");
            //         console.log('err : ',err);
            //     } else {
            //         console.log("Successfully sent with response: ", response);
            //     }
            // });
            // console.log('doc :', doc);
        } else {
            console.log('err :', err);
        }
    });
});

router.get('/fcm2', function (req, res,next) {
    console.log('aaaaaaaaaaaaaaaaaaaaaa');
    var user_id = '620bc763f10efb7769b70f5d';
    Person.findById(user_id).exec((err, doc) => {
        if (doc) {
            var FCM = require('fcm-node');
            // var serverKey = 'YOURSERVERKEYHERE'; //put your server key here
            var fcm = new FCM(serverKey);
            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: doc.notificationKey,
                collapse_key: 'your_collapse_key',

                notification: {
                    title: 'سبکینو',
                    body: 'نوتیفیکیشن بگیر حال بیای'
                },

                data: {  //you can send only notification or only data(or include both)
                    my_key: 'تست',
                    my_another_key: 'تست '
                }
            };

            fcm.send(message, function (err, res2) {
                if (err) {
                    console.log("Something has gone wrong!");
                } else {
                    console.log("Successfully sent with response: ", res2);
                }
            });


            // These registration tokens come from the client FCM SDKs.
            const registrationTokens = [
                doc.notificationKey,
            ];


            subscribeTokenToTopic(doc.notificationKey, 'channel');
// Subscribe the devices corresponding to the registration tokens to the
// topic.
//             fcm.getMessaging().subscribeToTopic(registrationTokens, 'channel')
//                 .then((response) => {
//                     // See the MessagingTopicManagementResponse reference documentation
//                     // for the contents of response.
//                     console.log('Successfully subscribed to topic:', response);
//                 })
//                 .catch((error) => {
//                     console.log('Error subscribing to topic:', error);
//                 });


            // fcm.subscribeToTopic( doc.notificationKey, 'channel')
            //     .then((response) => {
            //         // See the MessagingTopicManagementResponse reference documentation
            //         // for the contents of response.
            //         console.log('Successfully subscribed to topic:', response);
            //     })
            //     .catch((error) => {
            //         console.log('Error subscribing to topic:', error);
            //     });


            response.ok(req, res, null);


        } else {
            response.error(req, res, null);
            console.log('err :', err);
        }
    });
});


function subscribeTokenToTopic(token, topic) {
    fetch('https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/' + topic, {
        method: 'POST',
        headers: {
            'Authorization': 'key=' + serverKey
        }
    }).then(response => {
        if (response.status < 200 || response.status >= 400) {
            throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text();
        }
        console.log('Subscribed to "' + topic + '"');
    }).catch(error => {
        console.error(error);
    })
}

router.get('/admin/login', function (req, res,next) {
    var host = 'https://' + req.get('host');
    res.render('login', {mainUrl: host, title: 'login'});
    // res.sendFile(__dirname + '/view/login.jade.html',{'test':22});
});


router.post('/admin/login', function (req, res, next) {
    const Person = require("./model/person").Person;
    const Token = require("./model/token");
    var rand = require("random-key");

    console.log('admin/login');
    var host = 'https://' + req.get('host');
    var username = req.body.username;
    var pass = req.body.password;
    console.log('username :', username);
    console.log('password :', pass);
    const crypto = require('crypto');
    let password = crypto.createHash('md5').update(pass).digest("hex");
    // console.log('username', username);
    // console.log('password', password);

    Person.find({
        enName: username,
        password: password,
    }).exec((err, user) => {
        if (err) {
            response.error(req, res, next, 'مشکل در ایجاد توکن');
        }
        if (user) {
            if (user.length != 0) {
                console.log('user ::::::::::::', user[0]);
                new Token({
                    personId: user[0]._id.toString(),
                    token: rand.generateBase30(128),
                }).save((err, token) => {
                    if (token) {
                        // if (!req.session.initialised) {
                        //     req.session.initialised = true;
                        //     req.session.api_key = token.token;
                        //     req.session.save();
                        // }
                        console.log('token :', token.token);
                        req.data.verify = true;
                        req.session.loggedin = true;
                        req.data.token = token.token;
                        response.ok(req, res, next);
                    } else {
                        req.session.loggedin = false;
                        req.data.verify = false;
                        req.data.token = null;
                        response.error(req, res, next, 'مشکل در ایجاد توکن');
                    }
                });
            } else {
                req.session.loggedin = false;
                req.data.verify = false;
                req.data.token = null;
                response.error(req, res, next, 'اطلاعات کاربر یافت نشد');
            }
        } else {
            req.session.loggedin = false;
            req.data.verify = false;
            req.data.token = null;
            response.error(req, res, next, 'مشکل در ایجاد کاربر');
        }
    })


    // if (username == 'admin' && password == '123456') {
    //     req.session.loggedin = true;
    //     req.session.username = username;
    //     // Redirect to home page
    //     res.redirect('/');
    // } else {
    //     res.redirect('/admin/login');
    // }
});

//
// router.get('/',checkAuth, function (req, res,next) {
//     // if (req.session.loggedin == true) {
//         var host = 'https://' + req.get('host');
//         res.render('index', {mainUrl: host, title: 'chat'});
//         // res.sendFile(__dirname + '/views/index.html');
//     // } else {
//     //     res.redirect('/admin/login');
//     // }
// });




router.get('/', function (req, res,next) {

    console.log('checkAuth :::::',checkAuth);
    var host = 'https://' + req.get('host');
    res.render('login', {mainUrl: host, title: 'login'});
});
router.get('/chatList',checkAuth, function (req, res,next) {
    // if (req.session.loggedin == true) {
    var host = 'https://' + req.get('host');
    res.render('chat', {mainUrl: host, title: 'chat'});
    // res.sendFile(__dirname + '/views/index.html');
    // } else {
    //     res.redirect('/admin/login');
    // }
});


let socket_user = [];
// let message_list = [];
let location_user = [];


function checkChatText(text) {
    var is_restricted = false;
    if (malisonWordList.length > 0) {
        malisonWordList.forEach(item => {
            if (text.includes(item.text)) {
                is_restricted = true;
            }
        });
    }

    if (is_restricted == false) {

    }

    return is_restricted;
}

// MalisonList

io.on('connection', function (socket) {

    async function chatList(data) {
        console.log('data.user_id :', data.user_id);
        console.log('data.recive_user_id :', data.recive_user_id);
        var chatListItems = [];
        var chatList = [];
        ChatList.find({
            $and: [
                {'UserIdA': data.user_id},
                {'UserIdB': data.recive_user_id}
            ]
        }).skip(0).limit(50).exec((err, chatList) => {
            chatList.forEach(item => {

                console.log('item :', item);
                chatListItems.push({
                    'message_count': item.message_count,
                    'last_message': item.last_message,
                });
            });

            // console.log('chatListItems :', chatListItems);
            socket.emit('chat list', {
                'chatListItems': chatListItems
            });
        });
    }

    async function lastmessage(data) {
        var msgListData = [];
        // console.log('data.user_id :', data.user_id);
        // console.log('data.recive_user_id :', data.recive_user_id);
        MessageList
            .aggregate()
            .match({
                // $expr: {
                $or: [
                    {
                        $and: [
                            {'sendUserId': config.ObjectIdConvertor(data.user_id)},
                            {'reciveUserId': config.ObjectIdConvertor(data.recive_user_id)},
                        ]
                    },
                    {
                        $and: [
                            {'sendUserId': config.ObjectIdConvertor(data.recive_user_id)},
                            {'reciveUserId': config.ObjectIdConvertor(data.user_id)},
                        ]
                    }
                ]
                // }
            })

            .lookup({
                from: "messagelists",
                localField: "replyId",
                foreignField: "_id",
                as: "replyContent"
            })
            .exec((err, msgList) => {
                // console.log('msgList :', msgList);
                msgList.forEach(item => {
                    if (data.user_id == item.sendUserId.toString()) {
                        if (item.is_delete == false) {
                            var replyId = item.replyId;
                            if (replyId != null) {
                                var ex_message = '';
                                if (item.replyContent.length > 0) {
                                    ex_message = item.replyContent[0].message;
                                }
                                msgListData.push({
                                    'id': item._id.toString(),
                                    'sendUserId': item.sendUserId.toString(),
                                    'reciveUserId': item.reciveUserId.toString(),
                                    'message': item.message,
                                    'replyId': item.replyId.toString(),
                                    'ex_message': ex_message,
                                    'is_seen': item.is_seen,
                                    'type': 'reply',
                                    'date': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('MM/DD HH:mm')
                                });
                            } else {
                                msgListData.push({
                                    'id': item._id.toString(),
                                    'sendUserId': item.sendUserId.toString(),
                                    'reciveUserId': item.reciveUserId.toString(),
                                    'message': item.message,
                                    'is_seen': item.is_seen,
                                    'type': item.type,
                                    'date': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('MM/DD HH:mm')
                                });
                            }

                        }
                    } else {
                        if (item.is_delete_receive == false) {
                            var replyId = item.replyId;
                            if (replyId != null) {
                                var ex_message = '';
                                if (item.replyContent.length > 0) {
                                    ex_message = item.replyContent[0].message;
                                }
                                msgListData.push({
                                    'id': item._id.toString(),
                                    'sendUserId': item.sendUserId.toString(),
                                    'reciveUserId': item.reciveUserId.toString(),
                                    'message': item.message,
                                    'replyId': item.replyId.toString(),
                                    'ex_message': ex_message,
                                    'is_seen': item.is_seen,
                                    'type': 'reply',
                                    'date': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('MM/DD HH:mm')
                                });

                            } else {
                                msgListData.push({
                                    'id': item._id.toString(),
                                    'sendUserId': item.sendUserId.toString(),
                                    'reciveUserId': item.reciveUserId.toString(),
                                    'message': item.message,
                                    'is_seen': item.is_seen,
                                    'type': item.type,
                                    'date': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('MM/DD HH:mm')
                                });
                            }
                        }
                    }
                });


                // console.log('msgListData :',msgListData);
                socket.emit('list message', {
                    'msgListData': msgListData,
                });

                // MessageList.find({
                //     $or: [
                //         {'sendUserId': data.recive_user_id},
                //         {'reciveUserId': data.user_id}
                //     ]
                // }).exec((err, msgList2) => {
                //     msgList2.forEach(item => {
                //         if (data.user_id == item.sendUserId.toString()) {
                //             msgListData.push({
                //                 'id': item._id.toString(),
                //                 'sendUserId': item.sendUserId.toString(),
                //                 'reciveUserId': item.reciveUserId.toString(),
                //                 'message': item.message,
                //                 'type': item.type,
                //                 'date': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('MM/DD HH:mm')
                //             });
                //         } else {
                //             msgListData.push({
                //                 'id': item._id.toString(),
                //                 'sendUserId': item.sendUserId.toString(),
                //                 'reciveUserId': item.reciveUserId.toString(),
                //                 'message': item.message,
                //                 'type': item.type,
                //                 'date': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('MM/DD HH:mm')
                //             });
                //         }
                //     });
                //     // console.log('msgListData 1:', msgListData);
                //
                // });


            });
    }

    async function userList(data) {
        var userList = [];
        Person.find({
            $or: [
                {'class': "user"},
                {'class': "teacher"},
                {'class': "mentor"}
            ]
        }).skip(0).limit(50).exec((err, listItem) => {
            listItem.forEach(item => {
                if (data.user_id != item._id.toString()) {
                    userList.push({
                        'id': item._id.toString(),
                        'avatar': item.avatar,
                        'firstName': item.firstName,
                        'lastName': item.lastName,
                        'class': item.class,
                    });
                }
            });

            console.log('userList 1:', userList);
            socket.emit('user list', {
                'userList': userList
            });
        });
    }


    socket.on('user chat list', function (data) {
        var chatList = [];
        var user_id = data.user_id;
        ChatList
            .aggregate()
            .match({
                'UserIdA': config.ObjectIdConvertor(user_id)
            })
            .lookup({
                from: "pepole",
                localField: "UserIdB",
                foreignField: "_id",
                as: "userContent"
            }).exec((err, chList) => {
            console.log('chList :', chList);
            socket.emit('user chat list', {
                'data': chList
            });


        });
    });


    socket.on('user list', function (data) {
        console.log('user list :', data);
        userList(data);
    });

    socket.on('list message', function (data) {
        lastmessage(data);
    });

    socket.on('chat list', function (data) {
        chatList(data);
    });

    socket.on('add user', function (data) {
        socket.emit('login', {
            'numUsers': 0,
        });
        // var user_id = data.user_id;
        // console.log('user_id :', user_id);
        // var is_exist = false;
        // socket_user.forEach(item => {
        //     if (user_id == item['user_id']) {
        //         is_exist = true;
        //         // break;
        //     }
        // });
        //
        // if (is_exist == false) {
        //     socket_user.push({
        //         'user_id': user_id,
        //         'socket_id': socket.id,
        //     });
        // }
    });

    socket.on('user joined', function (data) {
        //console.log(data);
        var page_user_id = data.page_id;
        var user_id = data.user_id;

        var is_exist = false;
        // socket_user.forEach(item => {
        //     if (user_id == item['user_id']) {
        //         is_exist = true;
        //         // break;
        //     }
        // });

        var length = socket_user.length;
        for (var i = 0; i < length; i++) {
            if (user_id == socket_user[i]['user_id']) {
                is_exist = true;
                socket_user[i]['socket_id'] = socket.id;
                socket_user[i]['page_user_id'] = page_user_id;
                break;
            }
        }

        var page_socket_id;
        for (var i = 0; i < length; i++) {
            if (page_user_id == socket_user[i]['user_id']) {
                page_socket_id = socket_user[i]['socket_id'];
                break;
            }
        }

        if (typeof page_socket_id != 'undefined') {
            io.to(page_socket_id).emit('user data', {
                'last_seen': 'آنلاین',
                'is_mute': false,
                'is_block': false,
            });
        }


        // var length = socket_user.length;
        // for (var i = 0; i < length; i++) {
        //     if (user_id == socket_user[i]['user_id']) {
        //         is_exist = true;
        //         socket_user[i]['socket_id'] = socket.id;
        //         socket_user[i]['page_user_id'] = page_user_id;
        //         break;
        //     }
        // }


        Person.findByIdAndUpdate(user_id, {
                'last_seen': moment().format('YYYY/MM/DD HH:mm:ss')
            },
            {
                new: true,
                runValidators: true
            }).exec((err, doc) => {
            if (doc) {
                if (is_exist == false) {
                    ChatList.find({'UserIdA': user_id}).exec((err2, doc2) => {
                        if (doc2) {
                            if (doc2.length == 0) {
                                socket_user.push({
                                    'user_id': user_id,
                                    'socket_id': socket.id,
                                    'page_user_id': page_user_id,
                                    'chatList': [],
                                    'last_seen': moment(doc.last_seen).locale('fa').format('MM/DD - HH:mm'),
                                });
                            } else {
                                var chatList = [];
                                doc2.forEach(item => {
                                    chatList.push({
                                        'UserIdB': item.UserIdB,
                                        'Mute': item.Mute,
                                        'Block': item.Block,
                                        'last_message': item.last_message,
                                    });
                                });

                                socket_user.push({
                                    'user_id': user_id,
                                    'socket_id': socket.id,
                                    'page_user_id': page_user_id,
                                    'chatList': chatList,
                                    'last_seen': moment(doc.last_seen).locale('fa').format('MM/DD - HH:mm'),
                                });

                                console.log('socket_user :', socket_user);
                            }
                        }
                    });
                }
                // console.log('doc :', doc);
            } else {
                console.log('err :', err);
            }
        });

        // console.log('----------------------------------------------------');
        // console.log('socket_user :', socket_user);
        // console.log('----------------------------------------------------');
    });

    socket.on('user left', function (data) {
        console.log('user left', data);
        var user_id = data.user_id;
        // console.log('left user_id :', user_id);
        var index = 0;
        var length = socket_user.length;
        var page_user_id;
        for (var i = 0; i < length; i++) {
            if (user_id == socket_user[i]['user_id']) {
                index = i;
                page_user_id = socket_user[i]['page_user_id'];
                break;
            }
        }

        var page_socket_id;
        if (typeof page_user_id != 'undefined') {
            socket_user.forEach(item => {
                if (page_user_id == item['user_id']) {
                    page_socket_id = item['socket_id'];
                }
            });
        }

        if (typeof page_socket_id != 'undefined') {
            io.to(page_socket_id).emit('user data', {
                'last_seen': moment().format('MM/DD HH:mm'),
                'is_mute': false,
                'is_block': false,
            });
        }


        Person.findByIdAndUpdate(data.user_id, {
                'last_seen': moment().format('YYYY/MM/DD HH:mm:ss')
            },
            {
                new: true,
                runValidators: true
            }).exec((err, doc) => {
            if (doc) {
                // console.log('doc :', doc);
            } else {
                console.log('err :', err);
            }
        });

        // console.log('left index :', index);
        socket_user.splice(index, 1);
        // console.log('left socket_user :', socket_user);
    });

    socket.on('user data', function (data) {
        var user_id = data.user_id;
        var me_id = data.me_id;
        var length = socket_user.length;
        var last_seen = '';
        var is_mute;
        var is_block;
        for (var i = 0; i < length; i++) {
            if (user_id == socket_user[i]['user_id']) {
                last_seen = socket_user[i]['last_seen'];
                break;
            }
        }


        if (last_seen.length > 0) {
            ChatList.find({
                $and: [
                    {'UserIdA': me_id},
                    {'UserIdB': user_id}
                ]
            }).exec((err, doc) => {
                if (doc) {
                    if (doc.length != 0) {
                        is_mute = doc[0].Mute;
                        is_block = doc[0].Block;

                        console.log('is_mute :', is_mute);
                        console.log('is_block :', is_block);

                        socket.emit('user data', {
                            'last_seen': 'آنلاین',
                            'is_mute': is_mute,
                            'is_block': is_block,
                        });
                    } else {
                        socket.emit('user data', {
                            'last_seen': 'آنلاین',
                            'is_mute': false,
                            'is_block': false,
                        });
                    }
                }
            });

        } else {
            Person.findById(data.user_id).exec((err, doc) => {
                if (doc) {
                    // console.log('doc :', doc);

                    ChatList.find({
                        $and: [
                            {'UserIdA': me_id},
                            {'UserIdB': user_id}
                        ]
                    }).exec((err2, doc2) => {
                        if (doc2) {
                            if (doc2.length != 0) {
                                is_mute = doc2[0].Mute;
                                is_block = doc2[0].Block;

                                console.log('is_mute :', is_mute);
                                console.log('is_block :', is_block);
                                socket.emit('user data', {
                                    'last_seen': moment(doc.last_seen).locale('fa').format('MM/DD - HH:mm'),
                                    'is_mute': is_mute,
                                    'is_block': is_block,
                                });
                            } else {
                                socket.emit('user data', {
                                    'last_seen': moment(doc.last_seen).locale('fa').format('MM/DD - HH:mm'),
                                    'is_mute': false,
                                    'is_block': false,
                                });
                            }
                        }
                    });
                    // console.log('doc :', doc);
                } else {
                    console.log('err :', err);
                }
            });
        }
    });

    socket.on('new message', function (data) {
        var send_socket_id = '';
        var page_user_id = '';
        var recive_user_id = data.me_id;
        var send_user_id = data.user_id;
        var type = data.type;
        var ex_message = data.ex_message;
        var message_id = data.message_id;
        if (typeof type == 'undefined') {
            type = 'text';
        }

        // console.log('aaaa :', type);
        var chatList = [];
        console.log('send user_id', data.user_id);
        console.log('recive_user_id', recive_user_id);
        // console.log('data.user_id :', data.user_id);
        socket_user.forEach(item => {
            if (data.user_id == item['user_id']) {
                send_socket_id = item['socket_id'];
                page_user_id = item['page_user_id'];

            }

            if (recive_user_id == item['user_id']) {
                chatList = item['chatList'];
            }

        });


        var is_block = false;
        chatList.forEach(item => {
            if (item.UserIdB == send_user_id && item.Block == true) {
                is_block = true;
            }
        });


        var is_restricted = checkChatText(data.message);
        // var is_restricted = false;
        // if (malisonWordList.length > 0) {
        //     malisonWordList.forEach(item => {
        //         if (data.message.includes(item.text)) {
        //             is_restricted = true;
        //         }
        //     });
        // }


        // console.log('chatList :', chatList);
        console.log('is_restricted :', is_restricted);
        console.log('is_block :', is_block);


        // socket_user.forEach(item => {
        //     if (recive_user_id == item['user_id']) {
        //     // if (socket.id == item['socket_id']) {
        //     //     recive_user_id = item['user_id'];
        //
        //     }
        // });

        // console.log('chatList :', chatList);

        console.log('send_socket_id :', send_socket_id);
        console.log(data);
        // socket.broadcast.emit('new message', {
        //     'username': user_name,
        //     'sendUserId': data.user_id,
        //     'reciveUserId': '',
        //     'message': data.message,
        //     'date': moment().locale('fa').format('MM/DD HH:mm')
        // });

        var user_name;
        // console.log('send_user_id :', send_user_id);
        // console.log('recive_user_id :', recive_user_id);


        if (send_user_id.length != 0 && recive_user_id.length != 0) {
            if (is_restricted == false) {
                if (type == 'text') {
                    if (is_block == false) {
                        if (send_socket_id.length != 0) {
                            if (page_user_id == recive_user_id) {
                                const messageList = new MessageList({
                                    sendUserId: recive_user_id,
                                    reciveUserId: send_user_id,
                                    message: data.message,
                                    type: 'text',
                                    is_seen: true,
                                    image: '',
                                });


                                messageList.save(function (err, result) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(' result._id :', result._id);

                                        io.to(send_socket_id).emit('new message', {
                                            'id': result._id.toString(),
                                            'username': user_name,
                                            'sendUserId': recive_user_id,
                                            'reciveUserId': send_user_id,
                                            'message': data.message,
                                            'is_seen': true,
                                            'type': 'text',
                                            'date': moment().locale('fa').format('MM/DD HH:mm')
                                        });


                                        socket.emit('new message', {
                                            'id': result._id.toString(),
                                            'username': user_name,
                                            'sendUserId': recive_user_id,
                                            'reciveUserId': send_user_id,
                                            'message': data.message,
                                            'is_seen': true,
                                            'type': 'text',
                                            'date': moment().locale('fa').format('MM/DD HH:mm')
                                        });

                                    }
                                });
                            } else {
                                const messageList = new MessageList({
                                    sendUserId: recive_user_id,
                                    reciveUserId: send_user_id,
                                    message: data.message,
                                    type: 'text',
                                    is_seen: false,
                                    image: '',
                                });


                                messageList.save(function (err, result) {
                                    if (err) {
                                        console.log(err);
                                    } else {

                                        console.log(' result._id :', result._id);

                                        socket.emit('new message', {
                                            'id': result._id.toString(),
                                            'username': user_name,
                                            'sendUserId': recive_user_id,
                                            'reciveUserId': send_user_id,
                                            'message': data.message,
                                            'is_seen': false,
                                            'type': 'text',
                                            'date': moment().locale('fa').format('MM/DD HH:mm')
                                        });

                                    }
                                });
                            }


                        } else {
                            const messageList = new MessageList({
                                sendUserId: recive_user_id,
                                reciveUserId: send_user_id,
                                message: data.message,
                                type: 'text',
                                is_seen: false,
                                image: '',
                            });

                            messageList.save(function (err, result) {
                                if (err) {
                                    console.log(err);
                                } else {

                                    console.log(' result._id :', result._id);

                                    socket.emit('new message', {
                                        'id': result._id.toString(),
                                        'username': user_name,
                                        'sendUserId': recive_user_id,
                                        'reciveUserId': send_user_id,
                                        'message': data.message,
                                        'type': 'text',
                                        'is_seen': false,
                                        'date': moment().locale('fa').format('MM/DD HH:mm')
                                    });

                                }
                            });
                        }
                    }
                } else if (type == "reply") {
                    if (is_block == false) {
                        if (typeof message_id != 'undefined') {
                            if (send_socket_id.length != 0) {
                                if (page_user_id == recive_user_id) {
                                    const messageList = new MessageList({
                                        sendUserId: recive_user_id,
                                        reciveUserId: send_user_id,
                                        message: data.message,
                                        type: 'reply',
                                        replyId: message_id,
                                        is_seen: true,
                                        image: '',
                                    });


                                    messageList.save(function (err, result) {
                                        if (err) {
                                            console.log(err);
                                        } else {

                                            console.log(' result._id :', result._id);
                                            io.to(send_socket_id).emit('new message', {
                                                'id': result._id.toString(),
                                                'username': user_name,
                                                'sendUserId': recive_user_id,
                                                'reciveUserId': send_user_id,
                                                'message': data.message,
                                                'ex_message': ex_message,
                                                'is_seen': true,
                                                'type': 'reply',
                                                'replyId': message_id,
                                                'date': moment().locale('fa').format('MM/DD HH:mm')
                                            });


                                            socket.emit('new message', {
                                                'id': result._id.toString(),
                                                'username': user_name,
                                                'sendUserId': recive_user_id,
                                                'reciveUserId': send_user_id,
                                                'message': data.message,
                                                'ex_message': ex_message,
                                                'is_seen': true,
                                                'type': 'reply',
                                                'replyId': message_id,
                                                'date': moment().locale('fa').format('MM/DD HH:mm')
                                            });

                                        }
                                    });
                                } else {
                                    const messageList = new MessageList({
                                        sendUserId: recive_user_id,
                                        reciveUserId: send_user_id,
                                        message: data.message,
                                        type: 'text',
                                        is_seen: false,
                                        replyId: message_id,
                                        image: '',
                                    });


                                    messageList.save(function (err, result) {
                                        if (err) {
                                            console.log(err);
                                        } else {

                                            console.log(' result._id :', result._id);

                                            socket.emit('new message', {
                                                'id': result._id.toString(),
                                                'username': user_name,
                                                'sendUserId': recive_user_id,
                                                'reciveUserId': send_user_id,
                                                'message': data.message,
                                                'ex_message': ex_message,
                                                'is_seen': false,
                                                'type': 'reply',
                                                'replyId': message_id,
                                                'date': moment().locale('fa').format('MM/DD HH:mm')
                                            });

                                        }
                                    });
                                }

                            } else {

                                const messageList = new MessageList({
                                    sendUserId: recive_user_id,
                                    reciveUserId: send_user_id,
                                    message: data.message,
                                    type: 'reply',
                                    replyId: message_id,
                                    is_seen: false,
                                    image: '',
                                });


                                messageList.save(function (err, result) {
                                    if (err) {
                                        console.log(err);
                                    } else {

                                        console.log(' result._id :', result._id);

                                        socket.emit('new message', {
                                            'id': result._id.toString(),
                                            'username': user_name,
                                            'sendUserId': recive_user_id,
                                            'reciveUserId': send_user_id,
                                            'message': data.message,
                                            'ex_message': ex_message,
                                            'is_seen': false,
                                            'type': 'reply',
                                            'replyId': message_id,
                                            'date': moment().locale('fa').format('MM/DD HH:mm')
                                        });

                                    }
                                });
                            }
                        }
                    }
                }


                // const chatList = new ChatList({
                //     UserIdA: send_user_id,
                //     UserIdB: recive_user_id,
                //     message_count: 0,
                //     last_message: data.message,
                // });
                //
                // chatList.save(function (err, result) {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         console.log(result)
                //     }
                // });
            } else {
                socket.emit('popup message', {
                    'title': 'مدیر',
                    'message': 'کاربر عزیز متن ارسال دارای مشکل است',
                });
            }
        }

    });

    socket.on('typing', function (data) {
        // console.log('start typing :', data.user_id);
        var socket_id = '';
        var page_user_id = '';
        var user_id = '';
        socket_user.forEach(item => {
            if (data.user_id == item['user_id']) {
                socket_id = item['socket_id'];
                user_id = item['user_id'];
                page_user_id = item['page_user_id'];
            }
        });

        // socket_user.forEach(item => {
        //     if (data.me_id == item['user_id']) {
        //
        //     }
        // });

        if (socket_id.length != 0) {
            // io.emit('start typing', {
            //     'user_id': user_id,
            // });

            if (page_user_id == data.me_id) {
                io.to(socket_id).emit('typing', {
                    'user_id': user_id,
                });
            }
        }
    });

    socket.on('stop typing', function (data) {
        // console.log('stop typing :', data.user_id);
        var socket_id = '';
        var user_id = '';
        var page_user_id = '';
        socket_user.forEach(item => {
            if (data.user_id == item['user_id']) {
                socket_id = item['socket_id'];
                user_id = item['user_id'];
                page_user_id = item['page_user_id'];
            }
        });

        // socket_user.forEach(item => {
        //     if (data.me_id == item['user_id']) {
        //
        //     }
        // });

        if (socket_id.length != 0) {
            if (page_user_id == data.me_id) {
                io.to(socket_id).emit('stop typing', {
                    'user_id': user_id,
                });
            }
        }
    });

    socket.on('delete for me', function (data) {
        console.log('delete for me :', data);
        var message_id = data.message_id;
        var send_user_id = data.user_id;
        var receive_user_id = data.receive_user_id;


        MessageList.find({_id: message_id}).exec((err, doc) => {
            if (doc[0].sendUserId.toString() == send_user_id) {
                MessageList.findByIdAndUpdate(message_id, {
                        'is_delete': true
                    },
                    {
                        new: true,
                        runValidators: true
                    }).exec((err, doc) => {
                    if (doc) {


                        // console.log('doc :', doc);
                    } else {
                        console.log('err :', err);
                    }
                });
                socket.emit('delete for me', {
                    'message_id': message_id,
                });
            } else {
                console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
                MessageList.findByIdAndUpdate(message_id, {
                        'is_delete_receive': true
                    },
                    {
                        new: true,
                        runValidators: true
                    }).exec((err, doc) => {
                    if (doc) {


                        // console.log('doc :', doc);
                    } else {
                        console.log('err :', err);
                    }
                });
                socket.emit('delete for me', {
                    'message_id': message_id,
                });
            }
        });


    });

    socket.on('delete for everyone', function (data) {
        var message_id = data.message_id;
        var send_user_id = data.user_id;
        var receive_user_id = data.recive_user_id;
        var receive_socket_id;

        console.log('delete for everyone :', data);
        console.log('socket_user :', socket_user);

        var query = {
            _id: message_id
        };
        MessageList.findOneAndDelete(query).exec(() => {
            console.log('deleted');
        });

        // MessageList.find(message_id).remove();

        var is_exist = false;
        var length = socket_user.length;
        console.log('length :', length);


        for (var i = 0; i < length; i++) {
            if (receive_user_id == socket_user[i]['user_id']) {
                is_exist = true;
                receive_socket_id = socket_user[i]['socket_id'];
                break;
            }
        }

        console.log('receive_socket_id :', receive_socket_id);

        if (is_exist == true) {
            console.log('delete for everyone emit :', receive_socket_id);
            socket.emit('delete for everyone', {
                'message_id': message_id,
            });

            io.to(receive_socket_id).emit('delete for everyone', {
                'message_id': message_id,
            });
        } else {
            socket.emit('delete for everyone', {
                'message_id': message_id,
            });
        }


    });


    socket.on('check seen', function (data) {
        // console.log('check seen :', data);
        var chatList = JSON.parse(data.chat_list);
        // console.log('chatList :', chatList);
        var me_id = data.me_id;
        var send_user_id = data.send_user_id;
        var send_socket_id;

        var chatSeenList = [];
        chatList.forEach(item => {

            MessageList.findByIdAndUpdate(item.id, {
                    'is_seen': true
                },
                {
                    new: true,
                    runValidators: true
                }).exec((err, doc) => {
                if (doc) {
                    // console.log('doc :', doc);
                } else {
                    console.log('err :', err);
                }
            });


            chatSeenList.push({
                'id': item.id,
            });
        });


        socket_user.forEach(item => {
            if (send_user_id == item['user_id']) {
                send_socket_id = item['socket_id'];
            }
        });

        console.log('send_socket_id :', send_socket_id);
        if (typeof send_socket_id != 'undefined') {

            console.log('chatSeenList :', chatSeenList);
            io.to(send_socket_id).emit('check seen', {
                'chatSeenList': chatSeenList
            });
        }


        // console.log('chatSeenList :', chatSeenList);
        // socket.emit('check seen', {
        //     'chatSeenList': chatSeenList
        // });
    });

    //panel socket
    //***************************************************************
    //***************************************************************
    //***************************************************************

    socket.on('block user', function (data) {
        var user_id = data.user_id;
        var block_user_id = data.block_user_id;
        var is_block = false;
        ChatList.find({
            $and: [
                {'UserIdA': user_id},
                {'UserIdB': block_user_id},
            ]
        }).exec((err, doc) => {
            console.log('block user :', doc);
            if (doc) {
                if (doc.length == 0) {
                    const chatList = new ChatList({
                        UserIdA: user_id,
                        UserIdB: block_user_id,
                        message_count: 0,
                        Block: true,
                        last_message: 'test',
                    });

                    chatList.save(function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {

                        }
                    });

                    is_block = true;
                    console.log('is_block :', is_block);
                    socket.emit('block user', {
                        'is_block': is_block
                    });
                } else {
                    if (doc[0].Block == true) {
                        var chat_id = doc[0]._id.toString();
                        ChatList.findByIdAndUpdate(chat_id, {
                                'Block': false
                            },
                            {
                                new: true,
                                runValidators: true
                            }).exec((err2, doc2) => {
                            if (doc2) {
                                console.log('doc2 :', doc2);
                            } else {
                                console.log('err2 :', err2);
                            }
                        });


                        is_block = false;

                        console.log('is_block :', is_block);
                        socket.emit('block user', {
                            'is_block': is_block
                        });
                    } else {
                        var chat_id = doc[0]._id.toString();

                        ChatList.findByIdAndUpdate(chat_id, {
                                'Block': true
                            },
                            {
                                new: true,
                                runValidators: true
                            }).exec((err2, doc2) => {
                            if (doc2) {
                                console.log('doc2 :', doc2);
                            } else {
                                console.log('err2 :', err2);
                            }
                        });


                        is_block = true;
                        console.log('is_block :', is_block);
                        socket.emit('block user', {
                            'is_block': is_block
                        });
                    }
                }
                console.log('ChatList :', doc);
            } else {
                console.log('err :', err);
            }
        });
    });

    socket.on('mute user', function (data) {
        var user_id = data.user_id;
        var mute_user_id = data.mute_user_id;
        var is_mute = false;

        ChatList.find({
            $and: [
                {'UserIdA': user_id},
                {'UserIdB': mute_user_id}
            ]
        }).exec((err, doc) => {
            if (doc) {
                if (doc.length == 0) {
                    const chatList = new ChatList({
                        UserIdA: user_id,
                        UserIdB: mute_user_id,
                        message_count: 0,
                        Mute: true,
                        last_message: 'test',
                    });

                    chatList.save(function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {

                        }
                    });

                    is_mute = true;
                    console.log('is_mute :', is_mute);
                    socket.emit('mute user', {
                        'is_mute': is_mute
                    });
                } else {
                    if (doc[0].Mute == true) {
                        var chat_id = doc[0]._id.toString();

                        ChatList.findByIdAndUpdate(chat_id, {
                                'Mute': false
                            },
                            {
                                new: true,
                                runValidators: true
                            }).exec((err2, doc2) => {
                            if (doc2) {
                                console.log('doc2 :', doc2);
                            } else {
                                console.log('err2 :', err2);
                            }
                        });

                        is_mute = false;
                        console.log('is_mute :', is_mute);
                        socket.emit('mute user', {
                            'is_mute': is_mute
                        });
                    } else {
                        var chat_id = doc[0]._id.toString();

                        ChatList.findByIdAndUpdate(chat_id, {
                                'Mute': true
                            },
                            {
                                new: true,
                                runValidators: true
                            }).exec((err2, doc2) => {
                            if (doc2) {
                                console.log('doc2 :', doc2);
                            } else {
                                console.log('err2 :', err2);
                            }
                        });

                        is_mute = true;
                        console.log('is_mute :', is_mute);

                        socket.emit('mute user', {
                            'is_mute': is_mute
                        });
                    }
                }
                console.log('ChatList :', doc);
            } else {
                console.log('err :', err);
            }
        });

    });

    socket.on('chat message', function (msg) {

    });

    socket.on('chat report', function (data) {
        var userId = data.userId;
        var reportUserId = data.reportUserId;
        var reportTitle = data.reportTitle;
        const chatUserReport = new ChatUserReport({
            userId: userId,
            reportUserId: reportUserId,
            reportTitle: reportTitle,
        });


        chatUserReport.save(function (err, result) {
            if (err) {
                console.log(err);
                socket.emit('chat report', {
                    'status': false,
                });
            } else {
                socket.emit('chat report', {
                    'status': true,
                });
            }
        });
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});
