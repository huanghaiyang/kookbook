Ext.require(["Ext.grid.*", "Ext.data.*"]);
Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.define('com', {
		extend: 'Ext.data.Model',
		autoLoad: false,
		fields: ["_id", {
				name: 'name',
				mapping: 'name'
			}, {
				name: 'website',
				mapping: 'website'
			}, {
				name: 'introduction',
				mapping: 'introduction'
			}, {
				name: 'phone',
				mapping: 'phone'
			}, {
				name: 'telephone',
				mapping: 'telephone'
			}, {
				name: 'email',
				mapping: 'email'
			}
		]
	});
	var comSearchForm = new Ext.FormPanel({
		labelWidth: 35,
		layout: 'column',
		floating: false,
		bodyStyle: 'padding:5px 5px 5px 5px',
		draggable: false,
		id: 'comSearchForm',
		defaults: {
			width: 230
		},
		defaultType: 'textfield',
		items: [{
				fieldLabel: '名称',
				name: 'name',
				allowBlank: true,
				id: 'name'
			}
		],

		buttons: [{
				text: '查询',
				type: 'submit',
				handler: function() {
					store.on('beforeload', function() {
						store.proxy.extraParams = {
							name_like: Ext.getCmp('name')
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
					Ext.getCmp('comSearchForm').getForm().reset();
				}
			}
		]
	}).render("publicCompanyDiv");
	Ext.define("comData", {
		extend: "Ext.data.Model",

		fields: ["id", {
				name: "id",
				mapping: "id"
			}, {
				name: 'name',
				mapping: 'name'
			}, {
				name: 'website',
				mapping: 'website'
			}, {
				name: 'introduction',
				mapping: 'introduction'
			}, {
				name: 'phone',
				mapping: 'phone'
			}, {
				name: 'telephone',
				mapping: 'telephone'
			}, {
				name: 'email',
				mapping: 'email'
			}
		]
	});
	var store = Ext.create("Ext.data.Store", {
		pageSize: 10,
		model: "comData",
		proxy: {
			type: "ajax",
			url: "/support/listPublicCompanysAllByJson_bk",
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
				text: "出版社名称",
				flex: 1,

				dataIndex: "name",
				sortable: true,
				renderer: function change(val) {
					return '<span style="color:red;font-weight:bold;" class="bold" >' + val + '</span>';
				}
			}, {
				text: "电子邮件",
				flex: 1,
				dataIndex: "email",
				sortable: true
			}, {
				text: "座机电话",
				flex: 1,
				dataIndex: "phone",
				sortable: true
			}, {
				text: "移动电话",
				flex: 1,
				dataIndex: "telephone",
				sortable: true
			}, {
				text: "简介",
				flex: 1,
				dataIndex: "introduction",
				sortable: true
			}, {
				text: '操作',
				flex: 2,

				xtype: 'actioncolumn',
				items: [{
						icon: '/ext_support/images/delete.gif', // Use a URL in the
						// icon config
						tooltip: '删除出版社信息',
						iconCls: 'delete',
						handler: function(grid, rowIndex, colIndex) {
							var rec = store.getAt(rowIndex);

							function showResult(btn) {
								if (btn == 'yes') {
									Ext.Ajax.request({
										url: '/support/deleteOnePublicCompany',
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
													Ext.Msg.alert("提示信息", "出版社信息删除成功!");
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
							Ext.MessageBox.confirm('提示信息', '真的要删除一个出版社信息么?', showResult);
						}
					}, {
						icon: '/ext_support/images/application_view_list.png', // Use a URL
						// in the
						tooltip: '修改出版社信息',
						iconCls: 'view',
						handler: function(grid, rowIndex, colIndex) {
							var rec = store.getAt(rowIndex);
							showComUpdateForm(rec.get("id"));
						}
					}
				]
			}
		],
		title: "出版社信息",
		renderTo: "publicCompanyDiv",
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
					var addComForm = Ext.create('Ext.form.Panel', {
						labelWidth: 75, // label settings here cascade
						autoload: '/support/publicCompanyAdd',
						closable: true,
						draggable: true,
						floating: true,
						frame: true,
						title: '添加出版社信息',
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
						id: "addComForm",
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
												fieldLabel: '电子邮件',
												name: 'email',
												allowBlank: true
											}, {
												fieldLabel: '简介',
												name: 'introduction',
												allowBlank: true
											}
										]
									}, {
										columnWidth: .5,
										border: false,
										layout: 'anchor',
										defaultType: 'textfield',
										items: [{
												fieldLabel: '座机',
												name: 'phone',
												allowBlank: true
											}, {
												fieldLabel: '移动电话',
												name: 'telephone',
												allowBlank: true
											}
										]
									}, {
										columnWidth: .5,
										border: false,
										layout: 'anchor',
										defaultType: 'textfield',
										items: [{
												fieldLabel: '国家',
												name: 'country',
												allowBlank: true
											}, {
												fieldLabel: '州省',
												name: 'province',
												allowBlank: true
											}
										]
									}, {
										columnWidth: .5,
										border: false,
										layout: 'anchor',
										defaultType: 'textfield',
										items: [{
												fieldLabel: '县市',
												name: 'city',
												allowBlank: true
											}, {
												fieldLabel: '详细地址',
												name: 'detail',
												allowBlank: true
											}
										]
									}, {
										columnWidth: .5,
										border: false,
										layout: 'anchor',
										defaultType: 'textfield',
										items: [{
												fieldLabel: '邮编',
												name: 'postcode',
												allowBlank: true
											}, {
												fieldLabel: '创立年代',
												name: 'foundDate',
												xtype: 'datefield',
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
											url: '/support/publicCompanyAdd',
											method: 'post',
											params: '',
											success: function(form, action) {
												if (action.result.error)
													Ext.Msg.alert("提示信息", action.result.error.message);
												else {
													Ext.Msg
														.alert("提示信息",
														"操作成功!");
													Ext.getCmp("addComForm").close();
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
									Ext.getCmp("addComForm").close();
								}
							}
						]
					}).render("publicCompanyDiv");
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
		showComUpdateForm(id);
	}

	function showComUpdateForm(id) {
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
			id: "updateComForm",
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
								url: '/support/updateOnePublicCompanyInfo',
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
										Ext.getCmp("updateComForm").close();
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
						Ext.getCmp("updateComForm").close();
					}
				}
			]
		}).render("publicCompanyDiv");
		Ext.getCmp("updateComForm").form.load({
			url: '/support/getOnePublicCompanyInfo',
			waitMsg: '正在载入数据...',
			params: {
				'id': id
			},
			success: function(form, action) {},
			failure: function(form, action) {
				var responseJson = Ext.JSON
					.decode(action.response.responseText);
				if (responseJson.error)
					Ext.Msg.alert("提示信息", responseJson.error.message);
				else
					Ext.MessageBox.alert('提示信息', '当前出版社信息载入失败');
			}
		});
	}
});