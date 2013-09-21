Ext.define('bookSection', {
	extend: 'Ext.data.Model',
	autoLoad: false,
	fields: ["_id", {
			name: 'name',
			mapping: 'name'
		}, {
			name: 'secName',
			mapping: 'secName'
		}, {
			name: 'instruction',
			mapping: 'instruction'
		}, {
			name: 'content',
			mapping: 'content'
		}
	]
});
// 显示添加书籍章节表单

function showBookSectionUpdateForm(id) {
	var updateRecommandForm = Ext.create('Ext.form.Panel', {
		labelWidth: 75,
		closable: true,
		floating: true,
		frame: true,
		title: '添加书籍章节',
		width: 400,
		fieldDefaults: {
			labelAlign: 'left',
			msgTarget: 'side'
		},
		defaults: {
			anchor: '100%',
			xtype: 'field'
		},
		draggable: true,
		x: 0,
		y: 0,
		maskDisabled: true,
		id: "bookSectionUpdateForm",
		reader: new Ext.data.JsonReader({
			root: 'item',
			model: 'bookSection'
		}),
		items: [{
				fieldLabel: '章节名称',
				name: 'name',
				allowBlank: true
			}, {
				fieldLabel: '副标题',
				name: 'secName',
				allowBlank: true
			}, {
				fieldLabel: '小节或节选',
				name: 'instruction',
				xtype: 'htmleditor',
				allowBlank: true
			}, {
				fieldLabel: '内容',
				name: 'content',
				xtype: 'htmleditor',
				allowBlank: true
			}
		],
		buttons: [{
				text: '保存',
				type: 'submit',
				handler: function() {
					if (this.up("form").getForm().isValid()) {
						this.up("form").getForm().doAction('submit', {
							url: '/support/book/addSection',
							method: 'post',
							params: {
								'bookid': id
							},
							success: function(form, action) {
								if (action.result.error)
									Ext.Msg.alert("提示信息", action.result.error.message);
								else {
									Ext.Msg
										.alert("提示信息",
										"操作成功!");
									Ext.getCmp("bookSectionUpdateForm").close();
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
					Ext.getCmp("bookSectionUpdateForm").close();
				}
			}
		]
	}).render("bookDiv");
	// 加载章节信息
	Ext.getCmp("bookSectionUpdateForm").form.load({
		url: '/support/getBookRecommandedInfo',
		waitMsg: '正在载入数据...',
		params: {
			'id': id
		},
		success: function(form, action) {
			var responseJson = Ext.JSON
				.decode(action.response.responseText);
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