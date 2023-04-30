var app = require('express')();
var persianDate = require('persian-date');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 7988;
let api_key = "e42ce0037b7788dbffb41e45f107ea19";
let mysql = require('mysql');
let config = require('./config.js');
let connection = mysql.createConnection(config);
var moment = require('jalali-moment');

// require('dotenv').config()
// var http = require('http');
// var mongoose = require("mongoose");
//
// var db = mongoose.connection;
// mongoose.plugin(require('mongoose-autopopulate'));
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function () {
//     console.log("DB OK");
// });

console.log("test index.js");

//moment().locale('fa').format('YYYY/M/D');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


let socket_user = [];
let location_user = [];

io.on('connection', function (socket) {
    function save_location(latitude, longitude, user_id) {
    }

    // function timer() {
    //     // var elem = document.getElementById("myBar");
    //     // var width = 0;
    //     var id = setInterval(setlocation, 3000);
    //     function setlocation() {
    //         console.log('location : ',location[index_send_location]);
    //         // clearInterval(id);
    //         // if (is_send_location==false) {
    //             index_send_location = Math.floor(Math.random() * len_location);
    //             is_send_location = true;
    //
    //         io.emit('getLocation', {
    //                 'status': 1,
    //                 'data': location[index_send_location],
    //                 'message': 'اطلاعات جی پی اس راننده'
    //             }
    //         );
    //
    //         // }
    //     }
    // }

    console.log(socket.id);

    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
        console.log(msg)
        io.to('hall_1').emit('news popup', {
            'status': 1,
            'data': {
                'title': 'habib',
                'message': 'habib',
                'version': 0,
                'button_title': 'habib'
            },
            'message': '',
        });


        // io.emit('news popup', {
        //     'status': 1,
        //     'data': {
        //         'title': 'habib',
        //         'message': 'habib',
        //         'version': 0,
        //         'button_title': 'habib'
        //     },
        //     'message': '',
        // });
    });


    socket.on('new message', function (msg) {
        // io.emit('new message', msg);
        console.log(msg)
        // io.to('hall_1').emit('news popup', {
        //     'status': 1,
        //     'data': {
        //         'title': 'habib',
        //         'message': 'habib',
        //         'version': 0,
        //         'button_title': 'habib'
        //     },
        //     'message': '',
        // });


        // io.emit('news popup', {
        //     'status': 1,
        //     'data': {
        //         'title': 'habib',
        //         'message': 'habib',
        //         'version': 0,
        //         'button_title': 'habib'
        //     },
        //     'message': '',
        // });
    });


    socket.on('join room', function (data) {
        if (data.user_id !== 'undefined' && data.api_key !== 'undefined' && data.hall_id !== 'undefined') {
            console.log('user_id :', data.user_id);
            console.log('api_key :', data.api_key);
            console.log('hall_id :', data.hall_id);
            if (data.api_key == api_key) {
                console.log('join room');
                socket.join('hall_' + data.hall_id.toString());
            } else {
                io.to(socket.id).emit('join room', {
                    'status': 0,
                    'data': null,
                    'message': 'کاربر احراز هویت نشده است'
                });
            }

        } else {
            io.to(socket.id).emit('join room', {
                'status': 0,
                'data': null,
                'message': 'کاربر احراز هویت نشده است'
            });
        }
    });


    socket.on('left room', function (data) {
        if (data.user_id !== 'undefined' && data.api_key !== 'undefined' && data.hall_id !== 'undefined') {
            console.log('user_id :', data.user_id);
            console.log('api_key :', data.api_key);
            console.log('hall_id :', data.hall_id);
            if (data.api_key == api_key) {
                console.log('left room');
                socket.leave('hall_' + data.hall_id.toString());
            } else {
                io.to(socket.id).emit('join room', {
                    'status': 0,
                    'data': null,
                    'message': 'کاربر احراز هویت نشده است'
                });
            }

        } else {
            io.to(socket.id).emit('join room', {
                'status': 0,
                'data': null,
                'message': 'کاربر احراز هویت نشده است'
            });
        }
    });


    socket.on('accept order', function (data) {
        if (data.user_id !== 'undefined' && data.api_key !== 'undefined' && data.order_id !== 'undefined') {
            console.log('accept order');
            console.log("user_id :", data.user_id);
            console.log("api_key :", data.api_key);
            console.log("order_id :", data.order_id);

            if (data.api_key == api_key) {
                let sql = "select * from orders  where id = ?";
                let data2 = [data.order_id];
                connection.query(sql, data2, (err, results, fields) => {
                    if (err) {
                        //io.emit('show_log', "database :" + err.message);
                        return console.error(err.message);
                    }

                    if (typeof results !== 'undefined' && results.length > 0) {
                        var order_qty = results[0].order_qty;
                        console.log("order_qty :", order_qty);
                        if (order_qty == 0) {
                            io.to(socket.id).emit('cancel update order', {
                                'status': 1,
                                'data': {'order_id': data.order_id, is_disable: true, order_qty: 0},
                                'message': 'پذیرش سفارش با موفقیت انجام شد',
                                'turn_message': 'توسط شماره نوبت ' + data.order_id + ' رزرو شد',
                            });

                            socket.broadcast.emit("cancel update order", {
                                'status': 1,
                                'data': {'order_id': data.order_id, is_disable: true, order_qty: 0},
                                'message': 'سفارش مورد نظر رزرو شده',
                                'turn_message': 'توسط شماره نوبت ' + data.order_id + ' رزرو شد',
                            });

                            socket.broadcast.emit("accept order", {
                                'status': 1,
                                'data': {'order_id': data.order_id, is_disable: true, order_qty: 0},
                                'message': 'سفارش مورد نظر رزرو شده',
                                'turn_message': 'توسط شماره نوبت ' + data.order_id + ' رزرو شد',
                            });
                        } else {
                            io.to(socket.id).emit('cancel update order', {
                                'status': 1,
                                'data': {'order_id': data.order_id, is_disable: false, order_qty: order_qty},
                                'message': 'پذیرش سفارش با موفقیت انجام شد',
                                'turn_message': '',
                            });

                            socket.broadcast.emit("cancel update order", {
                                'status': 1,
                                'data': {'order_id': data.order_id, is_disable: false, order_qty: order_qty},
                                'message': '',
                                'turn_message': ''
                            });
                        }
                        // get inserted id
                        // console.log('Todo Id:' + results.insertId);
                    }
                });
            } else {
                io.to(socket.id).emit('accept order', {
                    'status': 0,
                    'data': null,
                    'message': 'کاربر احراز هویت نشده است'
                });
            }
        } else {
            io.to(socket.id).emit('accept order', {
                'status': 0,
                'data': null,
                'message': 'پارامتر های ورودی معتبر نمی باشد',
                'turn_message': null
            });
        }
    });

    socket.on('save location', function (data) {
        if (data.user_id !== 'undefined' && data.api_key !== 'undefined' && data.driver_latitude !== 'undefined' && data.driver_longitude !== 'undefined') {
            // io.emit('show_log', "save location");
            // io.emit('show_log', "driver_latitude :" + data.driver_latitude);
            // io.emit('show_log', "driver_longitude :" + data.driver_longitude);


            console.log('save location');
            console.log("user_id :", data.user_id);
            // console.log("api_key :", data.api_key);
            console.log("driver_latitude :", data.driver_latitude);
            console.log("driver_longitude :", data.driver_longitude);
            console.log("---------------------------------------------------------");
            let driver_user_id = data.user_id;
            if (data.api_key == api_key) {
                save_location(data.driver_latitude, data.driver_longitude, data.user_id)
                io.to(socket.id).emit('save location', {
                    'status': 1,
                    'data': null,
                    'message': 'اطلاعات با موفقیت ثبت شد'
                });

                let socket_list = [];
                if (location_user.length > 0) {
                    location_user.forEach(function (item, val) {
                        if (item['driver_user_id'] == driver_user_id) {
                            socket_list.push({
                                'socket_id': item['socket_id']
                            });
                        }
                    });
                }


                socket_list.forEach(function (item, val) {
                    io.to(item['socket_id']).emit('getLocation', {
                            'status': 1,
                            'data': {'driver_latitude': data.driver_latitude, 'driver_longitude': data.driver_longitude},
                            'message': 'اطلاعات جی پی اس راننده'
                        }
                    );

                    // console.log("send emit location");
                    // console.log("---------------------------------------------------------");
                });


            } else {
                io.to(socket.id).emit('save location', {
                    'status': 0,
                    'data': null,
                    'message': 'کاربر احراز هویت نشده است'
                });
            }
        } else {
            io.to(socket.id).emit('save location', {
                'status': 0,
                'data': null,
                'message': 'پارامتر های ورودی معتبر نمی باشد'
            });
        }
    })

    socket.on('join socket', function (data) {
        if (data.user_id !== 'undefined' && data.api_key !== 'undefined') {
            io.emit('show_log', "join socket");

            console.log('join socket');
            console.log("user_id :", data.user_id);
            console.log("api_key :", data.api_key);
            if (data.api_key == api_key) {
                if (socket_user.length == 0) {
                    socket_user.push({
                        'socket_id': socket.id,
                        'user_id': data.user_id,
                    });
                } else {
                    let is_exist = false;
                    let index = 0;
                    socket_user.forEach(function (item, val) {
                        if (item['user_id'] == data.user_id) {
                            index++;
                            is_exist = true;
                        }
                    });

                    if (is_exist == true && index > 0) {
                        socket_user[index - 1]['socket_id'] = socket.id;
                    } else {
                        socket_user.push({
                            'socket_id': socket.id,
                            'user_id': data.user_id,
                        });
                    }
                }
                io.to(socket.id).emit('join socket', {
                    'status': 1,
                    'data': null,
                    'message': ''
                });
            } else {
                io.to(socket.id).emit('join socket', {
                        'status': 0,
                        'data': null,
                        'message': 'کاربر احراز هویت نشده است'
                    }
                );
            }
        } else {
            io.to(socket.id).emit('join socket', {
                    'status': 0,
                    'data': null,
                    'message': 'پارامتر های ورودی معتبر نمی باشد'
                }
            );
        }

    });

    socket.on('getLocation', function (data) {
        if (typeof data.user_id !== 'undefined' && typeof data.api_key !== 'undefined' && typeof data.driver_user_id !== 'undefined') {
            let is_exist = false;
            console.log('getLocation');
            console.log("user_id :", data.user_id);
            console.log("api_key :", data.api_key);
            console.log("driver_user_id :", data.driver_user_id);
            //console.log("owner_user_id :", data.owner_user_id);

            if (data.api_key == api_key) {

                if (location_user.length > 0) {
                    location_user.forEach(function (item, val) {
                        if (item['driver_user_id'] == data.driver_user_id && item['user_id'] == data.user_id) {
                            is_exist = true;
                        }
                    });
                }

                if (is_exist == false) {
                    if (data.driver_user_id != 0) {
                        location_user.push({
                            'driver_user_id': data.driver_user_id,
                            'user_id': data.user_id,
                            'socket_id': socket.id,
                        });
                    }
                }

                console.log('---------------------------------------------------------------');
                console.log('location_user :', location_user);


                let driver_latitude = 32.656656556;
                let driver_longitude = 51.656656556;
                io.to(socket.id).emit('getLocation', {
                        'status': 1,
                        'data': {'driver_latitude': driver_latitude, 'driver_longitude': driver_longitude},
                        'message': 'اطلاعات جی پی اس راننده'
                    }
                );
            } else {
                io.to(socket.id).emit('getLocation', {
                        'status': 0,
                        'data': null,
                        'message': 'کاربر احراز هویت نشده است'
                    }
                );
            }
        } else {
            io.to(socket.id).emit('getLocation', {
                    'status': 0,
                    'data': null,
                    'message': 'پارامتر های ورودی معتبر نمی باشد'
                }
            );
        }
    });

    socket.on('delete location', function (data) {
        if (typeof data.user_id !== 'undefined' && typeof data.api_key !== 'undefined' && typeof data.driver_user_id !== 'undefined') {
            let is_exist = false;
            let index = 0;
            console.log('delete location');
            console.log("user_id :", data.user_id);
            console.log("api_key :", data.api_key);
            console.log("driver_user_id :", data.driver_user_id);

            if (data.api_key == api_key) {
                if (location_user.length > 0) {
                    location_user.forEach(function (item, val) {
                        if (item['driver_user_id'] == data.driver_user_id && item['user_id'] == data.user_id) {
                            index++;
                            is_exist = true;
                        } else if (is_exist == false) {
                            index++;
                        }
                    });
                }

                if (is_exist == true) {
                    console.log('index :', index - 1);
                    location_user.splice(index - 1, 1);
                }

                console.log('---------------------------------------------------------------');
                console.log('location_user :', location_user);

            } else {
                io.to(socket.id).emit('delete location', {
                        'status': 0,
                        'data': null,
                        'message': 'کاربر احراز هویت نشده است'
                    }
                );
            }
        } else {
            io.to(socket.id).emit('delete location', {
                    'status': 0,
                    'data': null,
                    'message': 'پارامتر های ورودی معتبر نمی باشد'
                }
            );
        }


    });


    socket.on('cancel owner order', function (data) {
        if (data.user_id !== 'undefined' && data.api_key !== 'undefined' && data.order_id !== 'undefined') {
            console.log('cancel owner order');
            console.log('--------------------------------------------------');
            console.log("user_id :", data.user_id);
            console.log("api_key :", data.api_key);
            console.log("order_id :", data.order_id);

            if (data.api_key == api_key) {
                io.to(socket.id).emit('cancel update order', {
                    'status': 1,
                    'data': {'order_id': data.order_id, is_disable: true, order_qty: 0},
                    'message': 'انصراف صاحب کالا با موفقیت انجام شد',
                    'turn_message': 'بار توسط صاحب کالا حذف شد',
                });

                socket.broadcast.emit("cancel update order", {
                    'status': 1,
                    'data': {'order_id': data.order_id, is_disable: true, order_qty: 0},
                    'message': 'انصراف صاحب کالا با موفقیت انجام شد',
                    'turn_message': 'بار توسط صاحب کالا حذف شد',
                });
            }
        }
    });

    socket.on('accept cargo companies order', function (data) {
        if (data.user_id !== 'undefined' && data.api_key !== 'undefined' && data.order_id !== 'undefined') {
            console.log('accept order');
            console.log("user_id :", data.user_id);
            console.log("api_key :", data.api_key);
            console.log("order_id :", data.order_id);
            if (data.api_key == api_key) {
                let sql = "SELECT `orders`.*,`cargo_types`.`title` as cargo_type_title,\n" +
                    "`truck_types`.`title` as truck_type_title,`packing_types`.`title` as packing_type_title,\n" +
                    "tsender_state.title as sender_state_title,tsender_city.title as sender_city_title,\n" +
                    "tdelivery_state.title as delivery_state_title , tdelivery_city.title as delivery_city_title,`cargo_companies`.`title` as cargo_company_title\n" +
                    "\n" +
                    "FROM `orders` \n" +
                    "INNER JOIN `cargo_types` on `orders`.`cargo_type_id` = `cargo_types`.`id`\n" +
                    "INNER JOIN `truck_types` on `orders`.`truck_type_id` = `truck_types`.`id`\n" +
                    "INNER JOIN `packing_types` on `orders`.`packing_type_id` = `packing_types`.`id`\n" +
                    "INNER JOIN `cargo_companies` on `orders`.`cargo_company_id` = `cargo_companies`.`id`\n" +
                    "\n" +
                    "INNER JOIN `states` as tsender_state on `orders`.`sender_state` =tsender_state.id\n" +
                    "INNER JOIN `cities` as tsender_city on `orders`.`sender_city` = tsender_city.id\n" +
                    "\n" +
                    "INNER JOIN `states` as tdelivery_state on `orders`.`delivery_state` =tdelivery_state.id\n" +
                    "INNER JOIN `cities` as tdelivery_city on `orders`.`delivery_city` = tdelivery_city.id  where `orders`.id = ?";
                let data2 = [data.order_id];
                connection.query(sql, data2, (err, results, fields) => {
                    if (err) {
                        //io.emit('show_log', "database :" + err.message);
                        return console.error(err.message);
                    }

                    if (typeof results !== 'undefined') {

                        var hall_id = results[0].hall_id;
                        var rent_title = '';
                        if (results[0].rent_type == 1) {
                            rent_title = 'کل کرایه';
                        } else if (results[0].rent_type == 2) {
                            rent_title = 'هرتن‌صافی';
                        } else if (results[0].rent_type == 3) {
                            rent_title = 'کرایه صافی';
                        } else if (results[0].rent_type == 4) {
                            rent_title = 'هرتن کل';
                        }

                        console.log('sender_to_datetime : ', moment(results[0].sender_to_datetime, 'YY/MM/DD HH:mm').locale('fa').format('YY/MM/DD HH:mm'));

                        console.log("sender_to_datetime :", results[0].sender_to_datetime);
                        console.log("delivery_to_datetime :", results[0].delivery_to_datetime);
                        console.log("cargo_type_title :", results[0].cargo_type_title);
                        console.log("truck_type_title :", results[0].truck_type_title);
                        console.log("packing_type_title :", results[0].packing_type_title);

                        io.to('hall_' + hall_id.toString()).emit("add update order", {
                            'status': 1,
                            'data': {
                                'id': results[0].id,
                                'order_code': results[0].order_code,
                                'cargo_type_title': results[0].cargo_type_title,
                                'truck_type_title': results[0].truck_type_title,
                                'packing_type_title': results[0].packing_type_title,
                                'final_price': results[0].final_price,
                                'order_cargo_count': results[0].order_cargo_count,
                                'commission_price': results[0].commission_price,
                                'weight': results[0].weight,
                                'weight_unit': "کیلوگرم",
                                'order_qty': results[0].order_qty,
                                'order_date': results[0].order_date,
                                'sender_datetime': moment(results[0].sender_to_datetime, 'YY/MM/DD HH:mm').locale('fa').format('YY/MM/DD HH:mm'),
                                'delivery_datetime': moment(results[0].delivery_to_datetime, 'YY/MM/DD HH:mm').locale('fa').format('YY/MM/DD HH:mm'),
                                'sender_state_title': results[0].sender_state_title,
                                'sender_city_title': results[0].sender_city_title,
                                'delivery_state_title': results[0].delivery_state_title,
                                'delivery_city_title': results[0].delivery_city_title,
                                'cargo_company_title': results[0].cargo_company_title,
                                'rent_title': rent_title
                            },
                            'message': 'اطلاعات سفارش جدید',
                            'turn_message': ''
                        });
                    }
                });
            } else {
                socket.emit('add update order', {
                    'status': 0,
                    'data': null,
                    'message': 'کاربر احراز هویت نشده است'
                });
            }
        } else {
            socket.emit('add update order', {
                'status': 0,
                'data': null,
                'message': 'پارامتر های ورودی معتبر نمی باشد',
                'turn_message': null
            });
        }

    });

    socket.on('cancel driver order', function (data) {
        if (data.user_id !== 'undefined' && data.api_key !== 'undefined' && data.order_id !== 'undefined') {
            console.log('cancel driver order');
            console.log('--------------------------------------------------');
            console.log("user_id :", data.user_id);
            console.log("api_key :", data.api_key);
            console.log("order_id :", data.order_id);
            if (data.api_key == api_key) {
                let sql = "SELECT `orders`.*,`cargo_types`.`title` as cargo_type_title,\n" +
                    "`truck_types`.`title` as truck_type_title,`packing_types`.`title` as packing_type_title,\n" +
                    "tsender_state.title as sender_state_title,tsender_city.title as sender_city_title,\n" +
                    "tdelivery_state.title as delivery_state_title , tdelivery_city.title as delivery_city_title,`cargo_companies`.`title` as cargo_company_title\n" +
                    "\n" +
                    "FROM `order_details` \n" +
                    "INNER JOIN `orders` on `order_details`.`order_id` = `orders`.`id`\n" +
                    "INNER JOIN `cargo_types` on `orders`.`cargo_type_id` = `cargo_types`.`id`\n" +
                    "INNER JOIN `truck_types` on `orders`.`truck_type_id` = `truck_types`.`id`\n" +
                    "INNER JOIN `packing_types` on `orders`.`packing_type_id` = `packing_types`.`id`\n" +
                    "INNER JOIN `cargo_companies` on `orders`.`cargo_company_id` = `cargo_companies`.`id`\n" +
                    "\n" +
                    "INNER JOIN `states` as tsender_state on `orders`.`sender_state` =tsender_state.id\n" +
                    "INNER JOIN `cities` as tsender_city on `orders`.`sender_city` = tsender_city.id\n" +
                    "\n" +
                    "INNER JOIN `states` as tdelivery_state on `orders`.`delivery_state` =tdelivery_state.id\n" +
                    "INNER JOIN `cities` as tdelivery_city on `orders`.`delivery_city` = tdelivery_city.id  where `order_details`.id = ?";
                let parameters = [data.order_id];
                connection.query(sql, parameters, (err, results, fields) => {
                    if (err) {
                        //io.emit('show_log', "database :" + err.message);
                        return console.error(err.message);
                    }

                    if (typeof results !== 'undefined' && results.length > 0) {

                        var rent_title = '';
                        console.log("results  :", results[0]);

                        if (results[0].rent_type == 1) {
                            rent_title = 'کل کرایه';
                        } else if (results[0].rent_type == 2) {
                            rent_title = 'هرتن‌صافی';
                        } else if (results[0].rent_type == 3) {
                            rent_title = 'کرایه صافی';
                        } else if (results[0].rent_type == 4) {
                            rent_title = 'هرتن کل';
                        }

                        console.log("sender_to_datetime :", results[0].sender_to_datetime);
                        console.log("delivery_to_datetime :", results[0].delivery_to_datetime);

                        socket.broadcast.emit("add update order", {
                            'status': 1,
                            'data': {
                                'id': results[0].id,
                                'order_code': results[0].order_code,
                                'cargo_type_title': results[0].cargo_type_title,
                                'truck_type_title': results[0].truck_type_title,
                                'packing_type_title': results[0].packing_type_title,
                                'final_price': results[0].final_price,
                                'order_cargo_count': results[0].order_cargo_count,
                                'commission_price': results[0].commission_price,
                                'weight': results[0].weight,
                                'weight_unit': "کیلوگرم",
                                'order_qty': results[0].order_qty + 1,
                                'order_date': results[0].order_date,
                                'sender_datetime': moment(results[0].sender_to_datetime, 'YY/MM/DD HH:mm').locale('fa').format('YY/MM/DD HH:mm'),
                                'delivery_datetime': moment(results[0].delivery_to_datetime, 'YY/MM/DD HH:mm').locale('fa').format('YY/MM/DD HH:mm'),
                                'sender_state_title': results[0].sender_state_title,
                                'sender_city_title': results[0].sender_city_title,
                                'delivery_state_title': results[0].delivery_state_title,
                                'delivery_city_title': results[0].delivery_city_title,
                                'cargo_company_title': results[0].cargo_company_title,
                                'rent_title': rent_title
                            },
                            'message': 'اطلاعات سفارش جدید',
                            'turn_message': ''
                        });
                    }
                });
            } else {
                io.to(socket.id).emit('cancel driver order', {
                    'status': 0,
                    'data': null,
                    'message': 'کاربر احراز هویت نشده است'
                });
            }
        } else {
            io.to(socket.id).emit('cancel driver order', {
                'status': 0,
                'data': null,
                'message': 'پارامتر های ورودی معتبر نمی باشد',
                'turn_message': null
            });
        }

    });

    socket.on('user disconnect', function (data) {
        if (data.user_id !== 'undefined' && data.api_key !== 'undefined') {
            console.log('user disconnect run');
            if (data.api_key == api_key) {
                // console.log('user disconnected');
                // socket.disconnect(true);
            } else {
                // io.to(socket.id).emit('user disconnect', {
                //     'status': 0,
                //     'data': null,
                //     'message': 'کاربر احراز هویت نشده است'
                // });
            }
        } else {
            // io.to(socket.id).emit('user disconnect', {
            //     'status': 0,
            //     'data': null,
            //     'message': 'پارامتر های ورودی معتبر نمی باشد',
            //     'turn_message': null
            // });
        }
    });

});

http.listen(port, function () {
    console.log('listening on *:' + port);
});
