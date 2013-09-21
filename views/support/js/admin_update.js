Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.define('back', {
		extend : 'Ext.data.Model',
		autoLoad : false,
		fields : [{
			name : 'address',
			mapping : 'address'
		}, {
			name : 'username',
			mapping : 'username'
		}]
	});
	var updateForm = new Ext.FormPanel({
		labelWidth : 75, // label settings here cascade
		closable : true,
		floating : true,
		frame : true,
		title : '修改操作员信息',
		bodyStyle : 'padding:5px 5px 0',
		width : 350,
		x : 340,
		y : 100,
		draggable : true,
		maskDisabled : true,
		defaults : {
			width : 230
		},
		defaultType : 'textfield',
		reader : new Ext.data.JsonReader({
			root : 'items',
			model : 'back'
		}),
		items : [{
			fieldLabel : '账户名称',
			name : 'username',
			allowBlank : false
		}, {
			fieldLabel : '密码',
			name : 'password',
			inputType : "password",
			allowBlank : false
		}, {
			fieldLabel : '地址',
			name : 'address',
			allowBlank : true
		}],

		buttons : [{
			text : '更新',
			type : 'submit',
			handler : function() {
				if (updateForm.form.isValid()) {
					updateForm.form.doAction('submit', {
						url : 'admin_update_self.do',
						method : 'post',
						params : {},
						success : function(form, action) {
							Ext.Msg.alert("提示信息", action.result.msg);
							updateForm.close();
						},
						failure : function() {
							Ext.Msg.alert("提示信息", "对不起，数据提交失败");
						}
					});
				}
			}
		}, {
			text : '取消',
			handler : function() {
				updateForm.close();
			}
		}]
	}).render("admin_data");
	updateForm.form.load({
		url : 'admin_info_self.do',
		waitMsg : '正在载入数据...',
		params : {},
		success : function(form, action) {
		},
		failure : function(form, action) {
			Ext.MessageBox.alert('提示信息', '个人信息载入失败');
		}
	});

});