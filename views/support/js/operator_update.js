Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.define('back', {
		extend : 'Ext.data.Model',
		autoLoad : false,
		fields : [{
			name : 'home',
			mapping : 'home'
		}, {
			name : 'phone',
			mapping : 'phone'
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
			fieldLabel : '密码',
			name : 'password',
			inputType : "password"
		}, {
			fieldLabel : '电话',
			name : 'phone',
			allowBlank : true
		}, {
			fieldLabel : '地址',
			name : 'home',
			allowBlank : true
		}],

		buttons : [{
			text : '更新',
			type : 'submit',
			handler : function() {
				if (updateForm.form.isValid()) {
					updateForm.form.doAction('submit', {
						url : 'operator_update_self.do',
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
	}).render("operator_data");
	updateForm.form.load({
		url : 'operator_info_self.do',
		waitMsg : '正在载入数据...',
		params : {},
		success : function(form, action) {
		},
		failure : function(form, action) {
			Ext.MessageBox.alert('提示信息', '个人信息载入失败');
		}
	});

});