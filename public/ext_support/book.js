Ext.require(["Ext.grid.*", "Ext.data.*"]);
Ext.onReady(function() {
	Ext.QuickTips.init();
	function booleanRenderer(val) {
		if (val == true)
			return "是";
		else if (val = false)
			return '否';
		else
			return '【未定义】';
	}
	Ext.define('catas', {
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
	var store_parent = Ext.create('Ext.data.Store', {
		model: "catas",
		proxy: {
			type: "ajax",
			url: "/support/getCategraySimple",
			method: "get",
			reader: {
				type: "json"
			}
		},
		autoLoad: false
	});
	var store_publicCompany = Ext.create('Ext.data.Store', {
		model: "catas",
		proxy: {
			type: "ajax",
			url: "/support/getPublicCompanySimple",
			method: "get",
			reader: {
				type: "json"
			}
		},
		autoLoad: false
	});

	Ext.define('authors', {
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
	var store_authors = Ext.create('Ext.data.Store', {
		model: "authors",
		proxy: {
			type: "ajax",
			url: "/support/getAuthorsSimple",
			method: "get",
			reader: {
				type: "json"
			}
		},
		autoLoad: false
	});
	Ext.define('book', {
		extend: 'Ext.data.Model',
		autoLoad: false,
		fields: ["_id", {
				name: 'name',
				mapping: 'name'
			}, {
				name: 'ename',
				mapping: 'ename'
			}, {
				name: 'storeNumber',
				mapping: 'storeNumber'
			}, {
				name: 'ISBN',
				mapping: 'ISBN'
			}, {
				name: 'price',
				mapping: 'price'
			}, {
				name: 'bookVersion',
				mapping: 'bookVersion'
			}, {
				name: 'discount',
				mapping: 'discount'
			}, {
				name: 'secDiscount',
				mapping: 'secDiscount'
			}, {
				name: 'forwardSaleDate',
				mapping: 'forwardSaleDate'
			}, {
				name: 'publicDate',
				mapping: 'publicDate'
			}, {
				name: 'pageNumber',
				mapping: 'pageNumber'
			}, {
				name: 'keyword',
				mapping: 'keyword'
			}, {
				name: 'memo',
				mapping: 'memo'
			}
		]
	});


	var isStored = Ext.create('Ext.data.Store', {
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
	var isBandingStore = Ext.create('Ext.data.Store', {
		fields: ['text', 'name'],
		data: [{
				"text": "精装",
				"name": 1
			}, {
				"text": "套装",
				"name": 2
			}, {
				"text": "平装",
				"name": 0
			}
		]
	});
	var imageType = Ext.create('Ext.data.Store', {
		fields: ['text', 'name'],
		data: [{
				"text": "封面",
				"name": "bookface"
			}, {
				"text": "内容快照",
				"name": "booksnap"
			}
		]
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
				fieldLabel: '类别名称',
				name: 'name',
				allowBlank: true,
				id: 'name'
			}, {
				fieldLabel: '笔名',
				name: 'ename',
				allowBlank: true,
				id: 'ename'
			}, {
				fieldLabel: '是否有库存',
				name: 'isStore',
				allowBlank: true,
				id: 'isStore',
				xtype: 'combobox',
				store: isStored,
				displayField: 'text',
				valueField: 'name'
			}, {
				fieldLabel: 'ISBN',
				name: 'ISBN',
				allowBlank: true,
				id: 'ISBN'
			}, {
				xtype: 'combobox',
				fieldLabel: '所属分类',
				store: store_parent,
				displayField: 'name',
				valueField: 'id',
				name: 'pid',
				allowBlank: true,
				id: "search_pid"
			}, {
				xtype: 'combobox',
				fieldLabel: '作者',
				store: store_authors,
				displayField: 'name',
				valueField: 'id',
				name: 'aid',
				allowBlank: true,
				id: "search_aid"
			}, {
				fieldLabel: '是否是推荐书籍',
				name: 'isRecommanded',
				allowBlank: true,
				id: 'isRecommanded',
				xtype: 'combobox',
				store: isStored,
				displayField: 'text',
				valueField: 'name'
			}, {
				fieldLabel: '是否是新书速递',
				name: 'isNewBook',
				allowBlank: true,
				id: 'isNewBook',
				xtype: 'combobox',
				store: isStored,
				displayField: 'text',
				valueField: 'name'
			}, {
				fieldLabel: '是否是热门书籍',
				name: 'isHot',
				allowBlank: true,
				id: 'isHot',
				xtype: 'combobox',
				store: isStored,
				displayField: 'text',
				valueField: 'name'
			}
		],

		buttons: [{
				text: '查询',
				type: 'submit',
				handler: function() {
					store.on('beforeload', function() {
						store.proxy.extraParams = {
							name_like: Ext.getCmp('name')
								.getValue(),
							ename_like: Ext.getCmp('ename')
								.getValue(),
							pid_equal: Ext.getCmp('search_pid').getValue(),
							aid_equal: Ext.getCmp('search_aid').getValue(),
							ISBN_like: Ext.getCmp('ISBN')
								.getValue(),
							isStore_equal: Ext.getCmp('isStore')
								.getValue(),
							isHot_equal: Ext.getCmp('isHot')
								.getValue(),
							isRecommanded_equal: Ext.getCmp('isRecommanded')
								.getValue(),
							isNewBook_equal: Ext.getCmp('isNewBook')
								.getValue()
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
	}).render("bookDiv");
	Ext.define("bookData", {
		extend: "Ext.data.Model",

		fields: ["id", {
				name: "id",
				mapping: "id"
			}, {
				name: "name",
				mapping: "name"
			}, {
				name: "ename",
				mapping: "ename"
			}, {
				name: "isStore",
				mapping: 'isStore'
			}, {
				name: "storeNumber",
				mapping: "storeNumber"
			}, {
				name: "bookVersion",
				mapping: "bookVersion"
			}, {
				name: "price",
				mapping: "price"
			}, {
				name: "ISBN",
				mapping: "ISBN"
			}, {
				name: 'isNewBook',
				mapping: 'isNewBook'
			}, {
				name: "isRecommanded",
				mapping: 'isRecommanded'
			}, {
				name: "isHot",
				mapping: 'isHot'
			}
		]
	});
	var store = Ext.create("Ext.data.Store", {
		pageSize: 10,
		model: "bookData",
		proxy: {
			type: "ajax",
			url: "/support/listbooksAllByJson_bk",
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
				text: "书籍名称",
				flex: 1,

				dataIndex: "name",
				sortable: true,
				renderer: function change(val) {
					return '<span style="color:red;font-weight:bold;" class="bold" >' + val + '</span>';
				}
			}, {
				text: "英文名称",
				flex: 1,
				dataIndex: "ename",
				sortable: true
			}, {
				text: "是否速递到首页",
				flex: 1,
				dataIndex: "isNewBook",
				sortable: true,
				renderer: booleanRenderer
			}, {
				text: "是否首页推荐",
				flex: 1,
				dataIndex: "isRecommanded",
				sortable: true,
				renderer: booleanRenderer
			}, {
				text: "是否热门书籍",
				flex: 1,
				dataIndex: "isHot",
				sortable: true,
				renderer: booleanRenderer
			}, {
				text: "价格",
				flex: 1,
				dataIndex: "price",
				sortable: true
			}, {
				text: "是否库存",
				flex: 1,
				dataIndex: "isStore",
				sortable: true,
				renderer: booleanRenderer
			}, {
				text: "库存数量",
				flex: 1,
				dataIndex: "storeNumber",
				sortable: true
			}, {
				text: "版本",
				flex: 1,
				dataIndex: "bookVersion",
				sortable: true
			}, {
				text: "ISBN",
				flex: 1,
				dataIndex: "ISBN",
				sortable: true
			}, {
				text: '操作',
				flex: 2,

				xtype: 'actioncolumn',
				items: [{
						icon: '/ext_support/images/delete.gif', // Use a URL in the
						// icon config
						tooltip: '删除书籍信息',
						iconCls: 'delete',
						handler: function(grid, rowIndex, colIndex) {
							var rec = store.getAt(rowIndex);

							function showResult(btn) {
								if (btn == 'yes') {
									Ext.Ajax.request({
										url: '/support/deleteOneBook',
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
													Ext.Msg.alert("提示信息", "书籍信息删除成功!");
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
							Ext.MessageBox.confirm('提示信息', '真的要删除一个书籍信息么?', showResult);
						}
					}, {
						icon: '/ext_support/images/application_view_list.png', // Use a URL
						// in the
						tooltip: '修改书籍信息',
						iconCls: 'view',
						handler: function(grid, rowIndex, colIndex) {
							var rec = store.getAt(rowIndex);
							showUpdateForm(rec.get("id"));
						}
					}, {
						icon: '/ext_support/images/label_new-red.png', // Use a URL
						// in the
						tooltip: '新书速递',
						iconCls: 'view',
						handler: function(grid, rowIndex, colIndex) {
							var rec = store.getAt(rowIndex);
							showExpressUpdateForm(rec.get("id"));
						}
					}, {
						icon: '/ext_support/images/thumb-up.png', // Use a URL
						// in the
						tooltip: '推荐书籍',
						iconCls: 'view',
						handler: function(grid, rowIndex, colIndex) {
							var rec = store.getAt(rowIndex);
							showRecommanedUpdateForm(rec.get("id"));
						}
					}, {
						icon: '/ext_support/images/section_write.png', // Use a URL
						// in the
						tooltip: '编写章节',
						iconCls: 'view',
						handler: function(grid, rowIndex, colIndex) {
							var rec = store.getAt(rowIndex);
							showBookSectionUpdateForm(rec.get("id"));
							showBookSectionGrid(rec.get("id"));
						}
					}, {
						icon: '/ext_support/images/burn.png', // Use a URL
						// in the
						tooltip: '热门书籍',
						iconCls: 'view',
						handler: function(grid, rowIndex, colIndex) {
							var rec = store.getAt(rowIndex);
							showHotUpdateForm(rec.get("id"));
						}
					}, {
						tooltip: '上传图片',
						icon: '/ext_support/images/upload.png', // Use a URL
						handler: function(grid, rowIndex, colIndex) {
							var rec = store.getAt(rowIndex);
							Ext.create('Ext.form.Panel', {
								renderTo: 'bookDiv',
								width: 400,
								frame: true,
								floating: true,
								x: 300,
								y: 100,
								closable: true,
								draggable: true,
								title: '书籍相关图片上传',
								bodyPadding: '10 10 0',

								defaults: {
									anchor: '100%',
									allowBlank: false,
									labelAlign: 'left',
									msgTarget: 'side',
									labelWidth: 80
								},

								items: [{
										xtype: 'textfield',
										fieldLabel: '名称',
										name: "name"
									}, {
										xtype: "combobox",
										fieldLabel: "是否使用",
										store: isCurrentUsed,
										displayField: 'text',
										valueField: 'name',
										name: 'isCurrentUsed',
										allowBlank: true
									}, {
										xtype: "combobox",
										fieldLabel: "使用类型",
										store: imageType,
										displayField: 'text',
										valueField: 'name',
										name: 'type',
										allowBlank: false
									}, {
										xtype: 'filefield',
										id: 'fileUrl',
										emptyText: '选择图片',
										fieldLabel: '地址',
										name: 'filepath',
										buttonText: '',
										buttonConfig: {
											iconCls: 'upload-icon',
											text: 'select'
										}
									}, {
										xtype: 'textarea',
										fieldLabel: '备注',
										name: "memo",
										allowBlank: true
									}
								],

								buttons: [{
										text: '上传',
										handler: function() {
											var form = this.up('form').getForm();
											if (form.isValid()) {
												form.submit({
													url: '/support/uploadBookImage',
													waitMsg: '正在上传图片',
													params: {
														bookid: rec.get("id")
													},
													success: function(fp, o) {
														if (o.result.success == 'true')
															Ext.MessageBox.alert('提示信息', "图片上传成功!");
														else
															Ext.MessageBox.alert('提示信息', "图片上传失败!");
													}
												});
											}
										}
									}, {
										text: '重置',
										handler: function() {
											this.up('form').getForm().reset();
										}
									}
								]
							});
						}
					}, {
						tooltip: '查看书籍图片信息',
						icon: '/ext_support/images/acdsee-classic.png',
						handler: function(grid, rowIndex, colIndex) {
							var rec = store.getAt(rowIndex);
							Ext.Ajax.request({
								url: '/support/getOneBookImages',
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
				]
			}
		],
		title: "书籍信息",
		renderTo: "bookDiv",
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
					var addForm = Ext.create('Ext.form.Panel', {
						labelWidth: 75, // label settings here cascade
						autoload: '/support/bookAdd',
						closable: true,
						draggable: true,
						floating: true,
						frame: true,
						title: '添加图书信息',
						width: 600,
						fieldDefaults: {
							labelAlign: 'left',
							msgTarget: 'side'
						},
						defaults: {
							anchor: '100%'
						},
						x: 200,
						y: 0,
						maskDisabled: true,
						id: "addForm",
						items: [{
								layout: 'column',
								border: false,
								items: [{
										columnWidth: .5,
										border: false,
										layout: 'anchor',
										defaultType: 'textfield',
										items: [{
												fieldLabel: '书籍名称',
												name: 'name',
												allowBlank: false,
												blankText: "书籍名称不能为空!"
											}, {
												fieldLabel: '英文名称',
												name: 'ename',
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
												fieldLabel: "是否库存",
												store: isStored,
												displayField: 'text',
												valueField: 'name',
												name: 'isStore',
												allowBlank: true
											}, {
												fieldLabel: '库存数量',
												name: 'storeNumber',
												allowBlank: true
											}
										]
									}, {
										columnWidth: .5,
										border: false,
										layout: 'anchor',
										defaultType: 'textfield',
										items: [{
												fieldLabel: 'ISBN',
												name: 'ISBN',
												allowBlank: true
											}, {
												fieldLabel: '版本',
												name: 'bookVersion',
												allowBlank: true
											}
										]
									}, {
										columnWidth: .5,
										border: false,
										layout: 'anchor',
										defaultType: 'textfield',
										items: [{
												fieldLabel: '定价',
												name: 'price',
												allowBlank: true
											}, {
												fieldLabel: '折扣',
												name: 'discount',
												allowBlank: true
											}
										]
									}, {
										columnWidth: .5,
										border: false,
										layout: 'anchor',
										defaultType: 'textfield',
										items: [{
												fieldLabel: '折上折',
												name: 'secDiscount',
												allowBlank: true
											}, {
												fieldLabel: '铺货日期',
												name: 'publicDate',
												xtype: 'datefield',
												allowBlank: true
											}
										]
									}, {
										columnWidth: .5,
										border: false,
										layout: 'anchor',
										defaultType: 'textfield',
										items: [{
												fieldLabel: '预售日期',
												name: 'forwardSaleDate',
												xtype: 'datefield',
												allowBlank: true
											}, {
												fieldLabel: '页数',
												name: 'pageNumber',
												allowBlank: true,
											}
										]
									}, {
										columnWidth: .5,
										border: false,
										layout: 'anchor',
										defaultType: 'textfield',
										items: [{
												fieldLabel: '关键字',
												name: 'keyword',
												allowBlank: true,
											}, {
												xtype: "combobox",
												fieldLabel: "装帧",
												store: isBandingStore,
												displayField: 'text',
												valueField: 'name',
												name: 'banding',
												allowBlank: true
											}
										]
									}
								]
							}, {
								xtype: 'tabpanel',
								plain: true,
								activeTab: 0,
								height: 235,
								defaults: {
									bodyStyle: 'padding:10px'
								},
								items: [{
										title: '作者信息',
										defaults: {
											width: 230
										},
										defaultType: 'textfield',

										items: [{
												xtype: 'combobox',
												fieldLabel: '书籍作者',
												store: store_authors,
												displayField: 'name',
												valueField: 'id',
												name: 'aid',
												width: 500,
												allowBlank: true,
												multiSelect: true
											}
										]
									}, {
										title: '译者信息',
										defaults: {
											width: 230
										},
										defaultType: 'textfield',

										items: []
									}, {
										title: '图书分类',
										defaults: {
											width: 230
										},
										defaultType: 'textfield',

										items: [{
												xtype: 'combobox',
												fieldLabel: '所属分类',
												store: store_parent,
												displayField: 'name',
												valueField: 'id',
												name: 'cid',
												allowBlank: true
											}
										]
									}, {
										title: '出版公司',
										defaults: {
											width: 230
										},
										defaultType: 'textfield',

										items: [{
												xtype: 'combobox',
												fieldLabel: '出版社',
												store: store_publicCompany,
												displayField: 'name',
												valueField: 'id',
												name: 'comid',
												allowBlank: true,
												multiSelect: true
											}
										]
									}, {
										cls: 'x-plain',
										title: '详细信息',
										layout: 'fit',
										items: {
											xtype: 'htmleditor',
											name: 'memo',
											fieldLabel: '详细信息'
										}
									}
								]
							}
						],

						buttons: [{
								text: '保存',
								type: 'submit',
								handler: function() {
									if (this.up("form").getForm().isValid()) {
										this.up("form").getForm().doAction('submit', {
											url: '/support/bookAdd',
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
							}
						]
					}).render("bookDiv");
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
		var updateForm = Ext.create('Ext.form.Panel', {
			labelWidth: 75, // label settings here cascade
			autoload: '/support/getOneBookInfo',
			closable: true,
			floating: true,
			frame: true,
			title: '修改图书信息',
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
			y: 0,
			maskDisabled: true,
			id: "updateForm",
			reader: new Ext.data.JsonReader({
				root: 'item',
				model: 'book'
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
									fieldLabel: '书籍名称',
									name: 'name',
									allowBlank: false,
									blankText: "书籍名称不能为空!"
								}, {
									fieldLabel: '英文名称',
									name: 'ename',
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
									fieldLabel: "是否库存",
									store: isStored,
									displayField: 'text',
									valueField: 'name',
									name: 'isStore',
									allowBlank: true,
									id: 'b_isStore'
								}, {
									fieldLabel: '库存数量',
									name: 'storeNumber',
									allowBlank: true
								}
							]
						}, {
							columnWidth: .5,
							border: false,
							layout: 'anchor',
							defaultType: 'textfield',
							items: [{
									fieldLabel: 'ISBN',
									name: 'ISBN',
									allowBlank: true
								}, {
									fieldLabel: '版本',
									name: 'bookVersion',
									allowBlank: true
								}
							]
						}, {
							columnWidth: .5,
							border: false,
							layout: 'anchor',
							defaultType: 'textfield',
							items: [{
									fieldLabel: '定价',
									name: 'price',
									allowBlank: true
								}, {
									fieldLabel: '折扣',
									name: 'discount',
									allowBlank: true
								}
							]
						}, {
							columnWidth: .5,
							border: false,
							layout: 'anchor',
							defaultType: 'textfield',
							items: [{
									fieldLabel: '折上折',
									name: 'secDiscount',
									allowBlank: true
								}, {
									fieldLabel: '铺货日期',
									name: 'publicDate',
									xtype: 'datefield',
									allowBlank: true
								}
							]
						}, {
							columnWidth: .5,
							border: false,
							layout: 'anchor',
							defaultType: 'textfield',
							items: [{
									fieldLabel: '预售日期',
									name: 'forwardSaleDate',
									xtype: 'datefield',
									allowBlank: true
								}, {
									fieldLabel: '页数',
									name: 'pageNumber',
									allowBlank: true,
								}
							]
						}, {
							columnWidth: .5,
							border: false,
							layout: 'anchor',
							defaultType: 'textfield',
							items: [{
									fieldLabel: '关键字',
									name: 'keyword',
									allowBlank: true,
								}, {
									xtype: "combobox",
									fieldLabel: "装帧",
									store: isBandingStore,
									displayField: 'text',
									valueField: 'name',
									name: 'banding',
									allowBlank: true,
									id: 'b_isBanding'
								}
							]
						}
					]
				}, {
					xtype: 'tabpanel',
					plain: true,
					activeTab: 0,
					height: 235,
					defaults: {
						bodyStyle: 'padding:10px'
					},
					items: [{
							title: '作者信息',
							defaults: {
								width: 230
							},
							defaultType: 'textfield',

							items: [{
									xtype: 'combobox',
									fieldLabel: '书籍作者',
									store: store_authors,
									displayField: 'name',
									valueField: 'id',
									name: 'aid',
									allowBlank: true,
									multiSelect: true,
									id: 'b_authorId',
									width: 500
								}
							]
						}, {
							title: '译者信息',
							defaults: {
								width: 230
							},
							defaultType: 'textfield',

							items: []
						}, {
							title: '图书分类',
							defaults: {
								width: 230
							},
							defaultType: 'textfield',

							items: [{
									xtype: 'combobox',
									fieldLabel: '所属分类',
									store: store_parent,
									displayField: 'name',
									valueField: 'id',
									name: 'cid',
									allowBlank: true,
									id: 'b_categarayId',
									autoload: true,
								}
							]
						}, {
							title: '出版公司',
							defaults: {
								width: 230
							},
							defaultType: 'textfield',

							items: [{
									xtype: 'combobox',
									fieldLabel: '出版社',
									store: store_publicCompany,
									displayField: 'name',
									valueField: 'id',
									name: 'comid',
									allowBlank: true,
									multiSelect: true,
									id: "b_comid"
								}
							]
						}, {
							cls: 'x-plain',
							title: '详细信息',
							layout: 'fit',
							items: {
								xtype: 'htmleditor',
								name: 'memo',
								fieldLabel: '详细信息'
							}
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
								url: '/support/updateOneBookInfo',
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
		}).render("bookDiv");
		Ext.getCmp("updateForm").form.load({
			url: '/support/getOneBookInfo',
			waitMsg: '正在载入数据...',
			params: {
				'id': id
			},
			success: function(form, action) {
				var responseJson = Ext.JSON
					.decode(action.response.responseText);
				// 图书分类
				if (responseJson.item.bookCategray[0]) {
					var pid = responseJson.item.bookCategray[0]._id;
					var pname = responseJson.item.bookCategray[0].name;
					var catagray = Ext.getCmp("b_categarayId");
					catagray.setValue(pid);
					catagray.setRawValue(pname);
				}

				// 作者信息
				var authors = responseJson.item.authors;
				var ids = [];
				var names = [];
				for (var i = 0; i < authors.length; i++) {
					ids.push(authors[i]._id);
					names.push(authors[i].name);
				}
				var author = Ext.getCmp("b_authorId");
				author.setValue(ids);
				author.setRawValue(names);

				// 出版社信息
				var coms = responseJson.item.publicCompany;
				var ids = [];
				var names = [];
				for (var i = 0; i < coms.length; i++) {
					ids.push(coms[i]._id);
					names.push(coms[i].name);
				}
				var com = Ext.getCmp("b_comid");
				com.setValue(ids);
				com.setRawValue(names);


				// 是否有库存
				var b_isStore = Ext.getCmp("b_isStore");
				var isStore = responseJson.item.isStore;
				b_isStore.setValue(isStore);
				if (isStore)
					b_isStore.setRawValue('是');
				else
					b_isStore.setRawValue('否');

				// 装帧类型
				var b_isBanding = Ext.getCmp("b_isBanding");
				var isBanding = responseJson.item.banding;
				b_isBanding.setValue(isBanding);
				if (isBanding == 0)
					b_isBanding.setRawValue('平装');
				else if (isBanding == 1)
					b_isBanding.setRawValue('精装');
				else if (isBanding == 2)
					b_isBanding.setRawValue('套装');
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