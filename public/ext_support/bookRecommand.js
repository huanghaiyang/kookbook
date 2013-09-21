var isRecommandedStore = Ext.create('Ext.data.Store', {
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
Ext.define('recommandedBook', {
	extend: 'Ext.data.Model',
	autoLoad: false,
	fields: ["_id", {
			name: 'recommandedDate',
			mapping: 'recommandedDate'
		}
	]
});

function showRecommanedUpdateForm(id) {
	var updateRecommandForm = Ext.create('Ext.form.Panel', {
		labelWidth: 75,
		closable: true,
		floating: true,
		frame: true,
		title: '修改图书推荐信息',
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
		id: "updateRecommandForm",
		reader: new Ext.data.JsonReader({
			root: 'item',
			model: 'recommandedBook'
		}),
		items: [{
				xtype: "combobox",
				fieldLabel: "状态",
				store: isRecommandedStore,
				displayField: 'text',
				valueField: 'name',
				name: 'isRecommanded',
				allowBlank: true,
				id: 'b_isRecommanded'
			}, {
				fieldLabel: '推荐日期',
				name: 'recommandedDate',
				xtype: 'datefield',
				allowBlank: true
			}
		],
		buttons: [{
				text: '推荐到首页',
				type: 'submit',
				handler: function() {
					if (this.up("form").getForm().isValid()) {
						this.up("form").getForm().doAction('submit', {
							url: '/support/setBookRecommanded',
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
									Ext.getCmp("updateRecommandForm").close();
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
					Ext.getCmp("updateRecommandForm").close();
				}
			}
		]
	}).render("bookDiv");
	Ext.getCmp("updateRecommandForm").form.load({
		url: '/support/getBookRecommandedInfo',
		waitMsg: '正在载入数据...',
		params: {
			'id': id
		},
		success: function(form, action) {
			var responseJson = Ext.JSON
				.decode(action.response.responseText);

			var b_isRecommanded = Ext.getCmp("b_isRecommanded");
			var isRecommanded = responseJson.item.isRecommanded;
			b_isRecommanded.setValue(isRecommanded);
			if (isRecommanded)
				b_isRecommanded.setRawValue('是');
			else
				b_isRecommanded.setRawValue('否');
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