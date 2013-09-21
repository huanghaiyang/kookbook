var isNewBookStore = Ext.create('Ext.data.Store', {
	fields: ['text', 'name'],
	data: [{
			"text": "是",
			"name": true
		}, {
			"text": "否",
			"name": "false"
		}
	]
});
Ext.define('expressBook', {
	extend: 'Ext.data.Model',
	autoLoad: false,
	fields: ["_id", {
			name: 'expressDate',
			mapping: 'expressDate'
		}
	]
});

function showExpressUpdateForm(id) {
	var updateExpressForm = Ext.create('Ext.form.Panel', {
		labelWidth: 75,
		closable: true,
		floating: true,
		frame: true,
		title: '修改图书速递信息',
		width: 400,
		fieldDefaults: {
			labelAlign: 'left',
			msgTarget: 'side'
		},
		defaults: {
			anchor: '100%'
		},
		draggable: true,
		x: 200,
		y: 100,
		maskDisabled: true,
		id: "updateExpressForm",
		reader: new Ext.data.JsonReader({
			root: 'item',
			model: 'expressBook'
		}),
		items: [{
				xtype: "combobox",
				fieldLabel: "状态",
				store: isNewBookStore,
				displayField: 'text',
				valueField: 'name',
				name: 'isNewBook',
				allowBlank: true,
				id: 'b_isNewBook'
			}, {
				fieldLabel: '速递日期',
				name: 'expressDate',
				xtype: 'datefield',
				allowBlank: true
			}
		],
		buttons: [{
				text: '速递到首页',
				type: 'submit',
				handler: function() {
					if (this.up("form").getForm().isValid()) {
						this.up("form").getForm().doAction('submit', {
							url: '/support/setBookExpress',
							method: 'post',
							params: {
								'id': id
							},
							success: function(form, action) {
								if (action.result.error)
									Ext.Msg.alert("提示信息", action.result.error.message);
								else {
									Ext.Msg
										.alert("提示信息",
										"操作成功!");
									Ext.getCmp("updateExpressForm").close();
									store.load({
										params: {
											start: 0,
											limit: 10
										}
									});
								}
							},
							failure: function(form, action) {
								if (action.result.error)
									Ext.Msg.alert("提示信息", action.result.error.message);
								else
									Ext.Msg.alert("提示信息", "对不起，数据提交失败");
							}
						});
					}
				}
			}, {
				text: '取消',
				handler: function() {
					Ext.getCmp("updateExpressForm").close();
				}
			}
		]
	}).render("bookDiv");
	Ext.getCmp("updateExpressForm").form.load({
		url: '/support/getBookExpressInfo',
		waitMsg: '正在载入数据...',
		params: {
			'id': id
		},
		success: function(form, action) {
			var responseJson = Ext.JSON
				.decode(action.response.responseText);

			var b_isNewBook = Ext.getCmp("b_isNewBook");
			var isNewBook = responseJson.item.isNewBook;
			b_isNewBook.setValue(isNewBook);
			if (isNewBook)
				b_isNewBook.setRawValue('是');
			else
				b_isNewBook.setRawValue('否');
		},
		failure: function(form, action) {
			var responseJson = Ext.JSON
				.decode(action.response.responseText);
			if (responseJson.error)
				Ext.Msg.alert("提示信息", responseJson.error.message);
			else
				Ext.MessageBox.alert('提示信息', '当前图书信息载入失败');
		}
	});
}