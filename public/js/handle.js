const socket = io();
var username = 'Anonymous';
var isExistUsername = false;

$(document).ready( () => {
	$('#btnSendMessage').click( () => {
		let text = $('#txtInputText').val();
		let mess = {id: socket.id, text: text};

		if (text == '') return;
		socket.emit('User-send-message', mess);
	})
})

socket.on('Join-successfuly', () => {
	$('#username').html('Hello! ' + username)
});

// socket.on('User-already-exist', () => alert('Tên tài khoản '+username+' đã được sử dụng, vui lòng thử tên khác!'));

socket.on('Serv-send-message', (data) => {
	if (data.username === undefined) data.username = username;
	let rightMsg = '<li class="message right appeared"><div class="avatar"></div><div class="username">'+data.username+'</div><div class="text_wrapper"><div class="text">'+data.text+'</div></div></li>';
	let leftMsg  = '<li class="message left appeared"><div class="avatar"></div><div class="username">'+data.username+'</div><div class="text_wrapper"><div class="text">'+data.text+'</div></div></li>';

	if (data.id == socket.id){
		$('#messages').append(rightMsg);
	} else {
		$('#messages').append(leftMsg);
	}
})
