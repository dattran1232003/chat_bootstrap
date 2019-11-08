const socket = io('/login');

// check input
$(document).ready( () => {
	let dataLog = ['', '']
	let errLog = ['', '']
	let dataReg = ['', '', '']
	let errReg = ['', '', '']
	$('.form .form-group input').keyup( () => {
	// Login Information
		dataLog[0] = $('.login-form .txtUsername').val();
		dataLog[1] = $('.login-form .txtPassword').val();
		// Sign Up Information
		dataReg[0] = $('.register-form .txtUsername').val();
		dataReg[1] = $('.register-form .txtPassword').val();
		dataReg[2] = $('.register-form .txtRePassword').val();
		// Login error
		errLog[0] = '<span class="noti not-ok">Bạn chưa nhập tên đăng nhập</span>';
		errLog[1] = '<span class="noti not-ok">Bạn chưa nhập mật khẩu</span>'
		// Sign up error
		errReg[0] = errLog[0];
		errReg[2] = errLog[1];
		errReg[2] = '<span class="noti not-ok">Mật khẩu bạn nhập không khớp</span>';
	})

	// Login class names
	let nearbyLog = new Array('.login-form #LogUsername', '.login-form #LogPassword');
	// Sign up class names
	let nearbyReg = new Array('.register-form #RegUsername', '.register-form .RegPassword' , '.register-form #RegRepassword');
	// icon
	let iconNotOK = $('.form-group .icon.not-ok');
	let iconOK = $('.form-group .icon.ok');
	
	// Default
	$(iconNotOK).hide();
	$(iconOK).hide();


	// Login Not valid
	$('.login-form .btnSubmit').click( () => {
		for (i in dataLog) {
			let error = errLog[i];
			let div = nearbyLog[i];

			if (dataLog[i] == ''){
				$(nearbyLog[i] + ' span.noti.not-ok').remove();
				$(nearbyLog[i]).append(error);
			} else {
				toggleHideShow(iconNotOK, iconOK)
				$(nearbyLog[i] + ' span.noti.not-ok').remove();
			}
		}
	});

	// Sign Up not valid
	$('register-form .btnSubmit').click( () => {
		for (i in dataReg) {
			let error = errReg[i];
			let div = nearbyReg[i];

			if (dataReg[i] == ''){
				toggleHideShow(iconOK, iconNotOK)
				$(nearbyReg[i]).append(error);
			} else {
				$(nearbyReg[i] + ' span.noti.not-ok').append(ok);
				toggleHideShow(iconNotOK, iconOK)
			}
		}
	});
})


$(document).ready( () => {
	// Handle Hide/Show 2 form
	$('.login-form').show();
	$('.register-form').hide();

	$('.login-form .SignUp').click( () => {
		$('.login-form').hide();
		$('.register-form').show();
	});

	$('.register-form .Login').click( () => {
		$('.login-form').show();
		$('.register-form').hide();
	});

	
});

function checkRegisterInfo() {

}