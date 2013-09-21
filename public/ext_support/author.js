Ext.require(["Ext.grid.*", "Ext.data.*"]);
Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.define('sex', {
		extend: 'Ext.data.Model',
		autoLoad: false,
		fields: [{
			type: 'string',
			name: 'text'
		}, {
			type: 'string',
			name: 'sex'
		}]
	});

	Ext.define('author', {
		extend: 'Ext.data.Model',
		autoLoad: false,
		fields: ["_id", {
			name: 'name',
			mapping: 'name'
		}, {
			name: 'secName',
			mapping: 'secName'
		}, {
			name: 'email',
			mapping: 'email'
		}, {
			name: 'website',
			mapping: 'website'
		}, {
			name: 'memo',
			mapping: 'memo'
		}, {
			name: 'introduction',
			mapping: 'introduction'
		}, {
			name: 'country',
			mapping: 'address.country'
		}, {
			name: 'province',
			mapping: 'address.province'
		}, {
			name: 'city',
			mapping: 'address.city'
		}]
	});

	var store_sex = Ext.create('Ext.data.Store', {
		model: "sex",
		proxy: {
			type: "ajax",
			url: "/ext_support/combobox/sex.js",
			reader: {
				type: "json"
			}
		},
		autoLoad: true
	});

	var searchForm = new Ext.FormPanel({
		labelWidth: 35,
		layout: 'column',
		floating: false,
		bodyStyle: 'padding:5px 5px 5px 5px',
		draggable: false,
		id: "searchForm",
		defaults: {
			width: 230
		},
		defaultType: 'textfield',
		items: [{
			fieldLabel: '作者姓名',
			name: 'name',
			allowBlank: true,
			id: 'name'
		}, {
			fieldLabel: '笔名',
			name: 'secName',
			allowBlank: true,
			id: 'secName'
		}, {
			xtype: 'combobox',
			fieldLabel: '性别',
			store: store_sex,
			displayField: 'text',
			valueField: 'sex',
			name: 'sex',
			id: 'sex',
			allowBlank: true
		}],

		buttons: [{
			text: '查询',
			type: 'submit',
			handler: function() {
				store.on('beforeload', function() {
					store.proxy.extraParams = {
						name_like: Ext.getCmp('name')
							.getValue(),
						secName_like: Ext.getCmp('secName')
							.getValue(),
						sex_equal: Ext.getCmp('sex').getValue()
					};
				});
				store.load({
					params: {
						start: 0,
						limit: 10
					}
				});
			}
		}, {
			text: '重置',
			handler: function() {
				Ext.getCmp("searchForm").getForm().reset();
			}
		}]
	}).render("authorDiv");
	Ext.define("authorData", {
		extend: "Ext.data.Model",

		fields: ["id", {
			name: "id",
			mapping: "id"
		}, {
			name: "name",
			mapping: "name"
		}, {
			name: "secName",
			mapping: "secName"
		}, {
			name: "sex",
			type: "string"
		}, {
			name: 'email',
			mapping: 'email'
		}, {
			name: 'website',
			mapping: 'website'
		}]
	});
	var store = Ext.create("Ext.data.Store", {
		pageSize: 10,
		model: "authorData",
		proxy: {
			type: "ajax",
			url: "/support/listAuthorAllByJson_bk",
			reader: {
				type: "json",
				root: "items",
				totalProperty: 'totalCount'
			}
		},
		autoLoad: true
	});
	var grid = Ext.create("Ext.grid.Panel", {
		store: store,
		selType: 'checkboxmodel',
		selModel: {
			mode: 'id', // or SINGLE, SIMPLE ... review API for
			// Ext.selection.CheckboxModel
			checkOnly: false
			// or false to allow checkbox selection on click anywhere in row
		},
		layout: "fit",
		columns: [{
			text: "作者名称",
			flex: 1,

			dataIndex: "name",
			sortable: true,
			renderer: function change(val) {
				return '<span style="color:red;font-weight:bold;" class="bold" >' + val + '</span>';
			}
		}, {
			text: "笔名",
			flex: 1,
			dataIndex: "secName",
			sortable: true
		}, {
			text: "性别",
			flex: 1,
			dataIndex: "sex",
			sortable: false,
			renderer: function(v) {
				if (v == 1) {
					return "男";
				} else if (v == 0) {
					return "女";
				} else {
					return "【未填写】";
				}
			}
		}, {
			text: "电子邮件",
			flex: 1,
			dataIndex: "email",
			sortable: true
		}, {
			text: "作品网址",
			flex: 1,
			dataIndex: "website",
			sortable: true
		}, {
			text: '操作',
			flex: 1,

			xtype: 'actioncolumn',
			items: [{
				icon: '/ext_support/images/delete.gif', // Use a URL in the
				// icon config
				tooltip: '删除作者信息',
				iconCls: 'delete',
				handler: function(grid, rowIndex, colIndex) {
					var rec = store.getAt(rowIndex);

					function showResult(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								url: '/support/deleteOneAuthor',
								params: {
									id: rec.get("id")
								},
								method: 'POST',
								callback: function(options, success, response) {
									if (success) {
										var responseJson = Ext.JSON
											.decode(response.responseText);
										if (responseJson.error)
											Ext.MessageBox.alert("提示信息", responseJson.error.message);
										if (responseJson.success == "true") {
											Ext.Msg.alert("提示信息", "作者信息删除成功!");
											store.load({
												params: {
													start: 0,
													limit: 10
												}
											});
										}
									} else {
										Ext.Msg.confirm('失败',
											'请求超时或网络故障,错误编号：[' + response.status + ']是否要重新发送？', function(btn) {
												if (btn == 'yes') {
													Ext.Ajax
														.request(options);
												}
											});
									}
								}
							});
						}
					}
					Ext.MessageBox.confirm('提示信息', '真的要删除一个作者信息么?', showResult);
				}
			}, {
				icon: '/ext_support/images/application_view_list.png', // Use a URL
				// in the
				tooltip: '修改作者信息',
				iconCls: 'view',
				handler: function(grid, rowIndex, colIndex) {
					var rec = store.getAt(rowIndex);
					showUpdateForm(rec.get("id"));
				}
			}]
		}],
		title: "书籍作者信息",
		renderTo: "authorDiv",
		trackMouseOver: true, // 鼠标特效
		autoScroll: true,
		stateful: true,
		stateId: 'stateGrid',
		viewConfig: {
			columnsText: "显示/隐藏列",
			sortAscText: "正序排列",
			sortDescText: "倒序排列",
			forceFit: true,
			stripeRows: true
		},
		bbar: new Ext.PagingToolbar({
			store: store, // 数据源
			displayInfo: true,
			displayMsg: '当前记录 {0} -- {1} 条 共 {2} 条记录',
			emptyMsg: "暂无数据显示",
			prevText: "上一页",
			nextText: "下一页",
			refreshText: "刷新",
			lastText: "最后页",
			firstText: "第一页",
			beforePageText: "当前页",
			afterPageText: "共{0}页"
		}),
		tbar: // 工具条
		[{
			text: '刷新',
			cls: 'refresh',
			handler: function(btn, pressed) { // 重置查询条件
				store.load({
					params: {
						start: 0,
						limit: 10
					}
				});
			}
		}, {
			text: '添加',
			cls: 'refresh',
			handler: function(btn, pressed) { // 重置查询条件
				var addForm = new Ext.FormPanel({
					labelWidth: 75, // label settings here cascade
					url: '/support/authorAdd',
					closable: true,
					floating: true,
					frame: true,
					title: '添加作者信息',
					bodyStyle: 'padding:5px 5px 0',
					width: 350,
					x: 340,
					y: 100,
					draggable: true,
					defaults: {
						width: 230
					},
					id: "addForm",
					defaultType: 'textfield',
					items: [{
						fieldLabel: '作者名称',
						name: 'name',
						allowBlank: false,
						blankText: "作者名称不能为空!"
					}, {
						fieldLabel: '笔名',
						name: 'secName',
						allowBlank: true
					}, {
						xtype: 'combobox',
						fieldLabel: '性别',
						store: store_sex,
						displayField: 'text',
						valueField: 'sex',
						name: 'sex',
						allowBlank: true
					}, {
						fieldLabel: '电子邮件',
						name: 'email',
						allowBlank: true
					}, {
						fieldLabel: '作品网址',
						name: 'website',
						allowBlank: true
					}, {
						fieldLabel: '国家或地区',
						name: 'country',
						allowBlank: true
					}, {
						fieldLabel: '州省',
						name: 'province',
						allowBlank: true
					}, {
						fieldLabel: '县市',
						name: 'city',
						allowBlank: true
					}, {
						fieldLabel: '人物简介',
						name: 'introduction',
						allowBlank: true,
						xtype: "textarea"
					}, {
						fieldLabel: '详细信息',
						name: 'memo',
						allowBlank: true,
						xtype: "textarea"
					}],

					buttons: [{
						text: '保存',
						type: 'submit',
						handler: function() {
							if (this.up("form").getForm().isValid()) {
								this.up("form").getForm().doAction('submit', {
									url: '/support/authorAdd',
									method: 'post',
									params: '',
									success: function(form, action) {
										if (action.result.error)
											Ext.Msg.alert("提示信息", action.result.error.message);
										else {
											Ext.Msg
												.alert("提示信息",
													"操作成功!");
											Ext.getCmp("addForm").close();
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
							Ext.getCmp("addForm").close();
						}
					}]
				}).render("authorDiv");
			}
		}]
	});
	// gid双击事件显示管理员的详细信息
	grid.addListener("itemdblclick", onclick, this);

	function onclick() {
		var id;
		var Model = grid.getSelectionModel();
		var sels = Model.getSelection();
		if (typeof(sels) != 'undefined') {
			var len = sels.length;
			for (var i = 0; i < len; i++) {
				id = sels[i].data.id;
			}
		}
		showUpdateForm(id);
	}

	function showUpdateForm(id) {
		var updateForm = new Ext.FormPanel({
			labelWidth: 75, // label settings here cascade
			autoload: '/support/getOneAuthorInfo',
			closable: true,
			floating: true,
			frame: true,
			title: '修改作者信息',
			bodyStyle: 'padding:5px 5px 0',
			width: 350,
			x: 340,
			y: 100,
			draggable: true,
			maskDisabled: true,
			id: "updateForm",
			defaults: {
				width: 230
			},
			defaultType: 'textfield',
			reader: new Ext.data.JsonReader({
				root: 'item',
				model: 'author'
			}),
			items: [{
				fieldLabel: '作者名称',
				name: 'name',
				allowBlank: false
			}, {
				fieldLabel: '笔名',
				name: 'secName',
				allowBlank: true
			}, {
				xtype: 'combobox',
				fieldLabel: '性别',
				store: store_sex,
				displayField: 'text',
				valueField: 'sex',
				name: 'sex',
				id: 'b_sex'
			}, {
				fieldLabel: '电子邮件',
				name: 'email',
				allowBlank: true
			}, {
				fieldLabel: '作品网址',
				name: 'website',
				allowBlank: true
			}, {
				fieldLabel: '国家或地区',
				name: 'country',
				allowBlank: true
			}, {
				fieldLabel: '州省',
				name: 'province',
				allowBlank: true
			}, {
				fieldLabel: '县市',
				name: 'city',
				allowBlank: true
			}, {
				fieldLabel: '人物简介',
				name: 'introduction',
				allowBlank: true,
				xtype: "textarea"
			}, {
				fieldLabel: '详细信息',
				name: 'memo',
				allowBlank: true,
				xtype: "textarea"
			}],
			buttons: [{
				text: '更新',
				type: 'submit',
				handler: function() {
					if (this.up("form").getForm().isValid()) {
						this.up("form").getForm().doAction('submit', {
							url: '/support/updateOneAuthorInfo',
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
									Ext.getCmp("updateForm").close();
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
					Ext.getCmp("updateForm").close();
				}
			}]
		}).render("authorDiv");
		Ext.getCmp("updateForm").form.load({
			url: '/support/getOneAuthorInfo',
			waitMsg: '正在载入数据...',
			params: {
				'id': id
			},
			success: function(form, action) {
				var responseJson = Ext.JSON
					.decode(action.response.responseText);
				var b_sex = Ext.getCmp("b_sex");
				var sex = responseJson.item.sex;

				if (sex == 1) {
					b_sex.setValue(sex);
					b_sex.setRawValue('男');
				} else if (sex == 0) {
					b_sex.setRawValue('女');
					b_sex.setValue(sex);
				}
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
});