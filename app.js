var express = require('express');
var app = express();
var server = require('http').createServer(app);
/* SOCKET IO */
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var meta = {
	usersConnected: 0,
};
io.on('connection', function(socket){

	meta.usersConnected++;
	io.emit('user connected', {
		'msg': 'a user connected',
		'meta': meta,
	});

	socket.on('disconnect', function(){
		meta.usersConnected--;
		io.emit('user disconnected',{
			'msg': 'user disconnected',
			'meta': meta,
		});
	});

});
server.listen(port,function(){
	console.log('Servidor corriendo en http://localhost:' + port)
});

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});
module.exports = app;