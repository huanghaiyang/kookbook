Ext.onReady(function() {
	Ext.QuickTips.init();

	var simple = new Ext.FormPanel({
		labelWidth: 30,
		baseCls: 'x-plain',
		defaults: {},
		defaultType: 'textfield',

		items: [{
			fieldLabel: '帐户',
			name: 'adminname',
			allowBlank: false,
			blankText: '帐户不能为空'
		}, {
			inputType: 'password',
			fieldLabel: '密码',
			name: 'password',
			allowBlank: false,
			blankText: '密码不能为空',
			enableKeyEvents: true,
			listeners: {
				keyup: function(btn, e) {
					if (e.getKey() == 13) {
						simpleFormSubmit();
					}
				}
			}
		}],

		buttons: [{
			text: '登录系统',
			type: 'submit',
			handler: function() {
				simpleFormSubmit();
			}
		}]
	});

	function simpleFormSubmit() {
		if (simple.form.isValid()) {
			simple.form.doAction('submit', {
				url: '/support/adminLogin', // 'login.jsp',
				method: 'post',
				params: '',
				success: function(form, action) {
					if (action.result.error) {
						Ext.Msg.alert("提示信息", action.result.error);
					} else {
						window.location = "index";
					}
				},
				failure: function(form, action) {
					Ext.Msg.alert("提示信息", action.result.error);
				}
			});
		}
	}
	win = new Ext.Window({
		id: 'win',
		title: '管理员登陆',
		layout: 'fit',
		width: 300,
		height: 150,
		plain: true,
		bodyStyle: 'padding:5px;',
		maximizable: false,
		closeAction: 'close',
		closable: false,
		collapsible: true,
		plain: true,
		buttonAlign: 'center',
		items: simple,
		draggable: false
	});
	win.show();
});