Ext.require(["Ext.grid.*", "Ext.data.*"]);
Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.define('books', {
		extend: 'Ext.data.Model',
		fields: [{
				type: 'string',
				name: 'name'
			}, {
				type: 'string',
				name: 'id'
			}
		]
	});

	var isCurrentUsed = Ext.create('Ext.data.Store', {
		fields: ['text', 'name'],
		data: [{
				"text": "是",
				"name": true
			}, {
				"text": "否",
				"name": false
			}
		]
	});

	Ext.define('file', {
		extend: 'Ext.data.Model',
		autoLoad: false,
		fields: ["_id", {
				name: 'name',
				mapping: 'name'
			}, {
				name: 'useType',
				mapping: 'useType'
			}, {
				name: 'url',
				mapping: "url"
			}, {
				name: "filetype",
				mapping: 'filetype'
			}, {
				name: 'filesize',
				mapping: 'filesize'
			}, {
				name: 'memo',
				mapping: 'memo'
			}, {
				name: 'randomNumber',
				mapping: 'randomNumber'
			}, {
				name: 'randomNumber',
				mapping: 'randomNumber'
			}, {
				name: 'uploadDate',
				mapping: 'uploadDate'
			}
		]
	});

	var store_parent = Ext.create('Ext.data.Store', {
		model: "books",
		proxy: {
			type: "ajax",
			url: "/support/getBooksSimple",
			method: "get",
			reader: {
				type: "json"
			}
		},
		autoLoad: false
	});

	var searchForm = new Ext.FormPanel({
		labelWidth: 35,
		layout: 'column',
		floating: false,
		bodyStyle: 'padding:5px 5px 5px 5px',
		draggable: false,
		id: 'searchForm',
		defaults: {
			width: 230
		},
		defaultType: 'textfield',
		items: [{
				xtype: 'combobox',
				fieldLabel: '所属图书',
				store: store_parent,
				displayField: 'name',
				valueField: 'id',
				name: 'pid',
				allowBlank: true,
				id: "search_pid"
			}
		],

		buttons: [{
				text: '查询',
				type: 'submit',
				handler: function() {
					store.on('beforeload', function() {
						store.proxy.extraParams = {
							pid_equal: Ext.getCmp('search_pid').getValue()
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
					Ext.getCmp('searchForm').getForm().reset();
				}
			}
		]
	}).render("imgDiv");
	Ext.define("imgData", {
		extend: "Ext.data.Model",

		fields: ["id", {
				name: "id",
				mapping: "id"
			}, {
				name: 'isCurrentUsed',
				mapping: 'isCurrentUsed'
			}, {
				name: 'useType',
				mapping: 'useType'
			}, {
				name: 'filename',
				mapping: 'filename'
			}, {
				name: 'url',
				mapping: "url"
			}, {
				name: "filetype",
				mapping: 'filetype'
			}, {
				name: 'name',
				mapping: 'name'
			}
		]
	});
	var store = Ext.create("Ext.data.Store", {
		pageSize: 10,
		model: "imgData",
		proxy: {
			type: "ajax",
			url: "/support/listUploadImgsAllByJson_bk",
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
				text: "图片名称",
				flex: 1,

				dataIndex: "name",
				sortable: true,
				renderer: function change(val) {
					return '<span style="color:red;font-weight:bold;" class="bold" >' + val + '</span>';
				}
			}, {
				text: "路径",
				flex: 1,
				dataIndex: 'url',
				sortable: false,
				renderer: function change(val) {
					return unescape(val);
				}
			}, {
				text: "存储名称",
				flex: 1,
				dataIndex: 'filename',
				sortable: true,
				renderer: function change(val) {
					return unescape(val);
				}
			}, {
				text: "使用类型",
				flex: 1,
				dataIndex: 'useType',
				sortable: true
			}, {
				text: "是否使用",
				flex: 1,
				dataIndex: 'isCurrentUsed',
				sortable: true,
				renderer: function change(val) {
					if (val == true)
						return "是";
					else if (val == false)
						return "否";
				}
			}, {
				text: "文件类型",
				flex: 1,
				dataIndex: 'filetype',
				sortable: true
			}, {
				text: '操作',
				flex: 1,

				xtype: 'actioncolumn',
				items: [{
						icon: '/ext_support/images/delete.gif', // Use a URL in the
						// icon config
						tooltip: '删除图片',
						iconCls: 'delete',
						handler: function(grid, rowIndex, colIndex) {
							var rec = store.getAt(rowIndex);

							function showResult(btn) {
								if (btn == 'yes') {
									Ext.Ajax.request({
										url: '/support/deleteOneBookImg',
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
													Ext.Msg.alert("提示信息", "图片删除成功!");
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
							Ext.MessageBox.confirm('提示信息', '真的要删除此图片么?', showResult);
						}
					}, {
						icon: '/ext_support/images/application_view_list.png', // Use a URL
						// in the
						tooltip: '修改图片信息',
						iconCls: 'view',
						handler: function(grid, rowIndex, colIndex) {
							var rec = store.getAt(rowIndex);
							showUpdateForm(rec.get("id"));
						}
					}
				]
			}
		],
		title: "图片信息",
		renderTo: "imgDiv",
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
			}
		]
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
			autoload: '/support/getOneBookInfo',
			closable: true,
			floating: true,
			frame: true,
			title: '修改图片信息',
			width: 600,
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
			id: "updateForm",
			reader: new Ext.data.JsonReader({
				root: 'item',
				model: 'file'
			}),
			items: [{
					layout: 'column',
					border: false,
					items: [{
							columnWidth: .5,
							border: false,
							layout: 'anchor',
							defaultType: 'textfield',
							items: [{
									fieldLabel: '名称',
									name: 'name',
									allowBlank: false,
									blankText: "名称不能为空!"
								}, {
									fieldLabel: '本地名称',
									name: 'filename',
									id: "b_filename",
									allowBlank: true
								}
							]
						}, {
							columnWidth: .5,
							border: false,
							layout: 'anchor',
							defaultType: 'textfield',
							items: [{
									xtype: "combobox",
									fieldLabel: "当前是否使用",
									store: isCurrentUsed,
									displayField: 'text',
									valueField: 'name',
									name: 'isCurrentUsed',
									allowBlank: true,
									id: 'b_isCurrentUsed'
								}, {
									fieldLabel: '使用类型',
									name: 'useType',
									allowBlank: true
								}
							]
						}, {
							columnWidth: .5,
							border: false,
							layout: 'anchor',
							defaultType: 'textfield',
							items: [{
									fieldLabel: '本地路径',
									name: 'url',
									allowBlank: true
								}, {
									fieldLabel: '文件大小',
									name: 'filesize',
									allowBlank: true
								}
							]
						}, {
							columnWidth: .5,
							border: false,
							layout: 'anchor',
							defaultType: 'textfield',
							items: [{
									fieldLabel: '扩展名',
									name: 'type',
									allowBlank: true
								}, {
									fieldLabel: 'mime类型',
									name: 'filetype',
									allowBlank: true
								}
							]
						}, {
							columnWidth: .5,
							border: false,
							layout: 'anchor',
							defaultType: 'textfield',
							items: [{
									fieldLabel: '所属书籍名称',
									name: 'bookname',
									allowBlank: true,
									id: 'b_bookname'
								}, {
									name: 'bookid',
									xtype: 'hidden',
									allowBlank: true,
									id: 'b_bookid'
								}
							]
						}, {
							columnWidth: .5,
							border: false,
							layout: 'anchor',
							defaultType: 'textfield',
							items: [{
									fieldLabel: '上传日期',
									name: 'uploadDate',
									xtype: 'datefield',
									allowBlank: true
								}
							]
						}
					]
				}
			],
			buttons: [{
					text: '更新',
					type: 'submit',
					handler: function() {
						if (this.up("form").getForm().isValid()) {
							this.up("form").getForm().doAction('submit', {
								url: '/support/updateOneBookImg',
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
				}
			]
		}).render("imgDiv");
		Ext.getCmp("updateForm").form.load({
			url: '/support/getOneBookImgInfo',
			waitMsg: '正在载入数据...',
			params: {
				'id': id
			},
			success: function(form, action) {
				var responseJson = Ext.JSON
					.decode(action.response.responseText);
				var iscurrentused = responseJson.item.isCurrentUsed;
				var b_isCurrentUsed = Ext.getCmp("b_isCurrentUsed");
				b_isCurrentUsed.setValue(iscurrentused);
				if (iscurrentused == true)
					b_isCurrentUsed.setRawValue("是");
				else
					b_isCurrentUsed.setRawValue("否");
				var filename = responseJson.item.filename;
				Ext.getCmp("b_filename").setValue(unescape(filename));
				var bookname = responseJson.item.book[0].name;
				var bookid = responseJson.item.book[0]._id;
				Ext.getCmp("b_bookname").setValue(unescape(bookname));
				Ext.getCmp("b_bookid").setValue(unescape(bookid));
			},
			failure: function(form, action) {
				var responseJson = Ext.JSON
					.decode(action.response.responseText);
				if (responseJson.error)
					Ext.Msg.alert("提示信息", responseJson.error.message);
				else
					Ext.MessageBox.alert('提示信息', '当前图片信息载入失败');
			}
		});
	}
});