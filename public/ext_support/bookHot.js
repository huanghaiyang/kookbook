var isHotStore = Ext.create('Ext.data.Store', {
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
Ext.define('hotBook', {
	extend: 'Ext.data.Model',
	autoLoad: false,
	fields: ["_id", {
			name: 'hotDate',
			mapping: 'hotDate'
		}
	]
});

function showHotUpdateForm(id) {
	var updateHotForm = Ext.create('Ext.form.Panel', {
		labelWidth: 75,
		closable: true,
		floating: true,
		frame: true,
		title: '修改热门图书信息',
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
		id: "updateHotForm",
		reader: new Ext.data.JsonReader({
			root: 'item',
			model: 'hotBook'
		}),
		items: [{
				xtype: "combobox",
				fieldLabel: "状态",
				store: isNewBookStore,
				displayField: 'text',
				valueField: 'name',
				name: 'isHot',
				allowBlank: true,
				id: 'b_isHot'
			}, {
				fieldLabel: '热门季节',
				name: 'hotDate',
				xtype: 'datefield',
				allowBlank: true
			}
		],
		buttons: [{
				text: '首页热门',
				type: 'submit',
				handler: function() {
					if (this.up("form").getForm().isValid()) {
						this.up("form").getForm().doAction('submit', {
							url: '/support/setBookHot',
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
									Ext.getCmp("updateHotForm").close();
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
					Ext.getCmp("updateHotForm").close();
				}
			}
		]
	}).render("bookDiv");
	Ext.getCmp("updateHotForm").form.load({
		url: '/support/getBookHotInfo',
		waitMsg: '正在载入数据...',
		params: {
			'id': id
		},
		success: function(form, action) {
			var responseJson = Ext.JSON
				.decode(action.response.responseText);

			var b_isHot = Ext.getCmp("b_isHot");
			var isHot = responseJson.item.isHot;
			b_isHot.setValue(isHot);
			if (isHot)
				b_isHot.setRawValue('是');
			else
				b_isHot.setRawValue('否');
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