Ext.onReady(function() {
	Ext.QuickTips.init();

	Ext.define('State', {
		extend : 'Ext.data.Model',
		autoLoad : false,
		fields : [{
			type : 'string',
			name : 'text'
		}, {
			type : 'string',
			name : 'identity'
		}]
	});

	var store_identity = Ext.create('Ext.data.Store', {
		model : "State",
		proxy : {
			type : "ajax",
			url : "./JXY/js/combobox/identity.js",
			reader : {
				type : "json"
			}
		},
		autoLoad : true
	});

	var simple = new Ext.FormPanel({
		labelWidth : 30,
		baseCls : 'x-plain',
		defaults : {},
		defaultType : 'textfield',

		items : [{
			fieldLabel : '帐户',
			name : 'user.username',
			allowBlank : false,
			blankText : '帐户不能为空'
		}, {
			inputType : 'password',
			fieldLabel : '密码',
			name : 'user.password',
			allowBlank : false,
			blankText : '密码不能为空'
		}, {
			xtype : 'combobox',
			fieldLabel : '用户属性',
			emptyText : '请选择用户属性',
			store : store_identity,
			displayField : 'text',
			valueField : 'identity',
			name : 'identity'
		}],

		buttons : [{
			text : '登录系统',
			type : 'submit',
			handler : function() {
				if (simple.form.isValid()) {
					simple.form.doAction('submit', {
						url : 'admin_login.do',// 'login.jsp',
						method : 'post',
						params : '',
						success : function(form, action) {
							if (action.result.flag == "false") {
								Ext.Msg.alert("提示信息", action.result.msg);
							} else {
								window.location = action.result.index;
							}
						},
						failure : function() {
							Ext.Msg.alert("提示信息", "发生错误");
						}
					});
				}
			}
		}]
	});

	win = new Ext.Window({
		id : 'win',
		title : '用户登陆',
		layout : 'fit',
		width : 300,
		height : 150,
		plain : true,
		bodyStyle : 'padding:5px;',
		maximizable : false,
		closeAction : 'close',
		closable : false,
		collapsible : true,
		plain : true,
		buttonAlign : 'center',
		items : simple,
		draggable : false
	});
	win.show();
});