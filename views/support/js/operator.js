Ext.require(["Ext.grid.*", "Ext.data.*"]);
Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.define('State', {
		extend : 'Ext.data.Model',
		autoLoad : false,
		fields : [{
			type : 'string',
			name : 'text'
		}, {
			type : 'string',
			name : 'sex'
		}]
	});

	var store_sex = Ext.create('Ext.data.Store', {
		model : "State",
		proxy : {
			type : "ajax",
			url : "./JXY/js/combobox/sex.js",
			reader : {
				type : "json"
			}
		},
		autoLoad : true
	});

	Ext.define('back', {
		extend : 'Ext.data.Model',
		autoLoad : false,
		fields : [{
			name : 'name',
			mapping : 'name'
		}, {
			name : 'home',
			mapping : 'home'
		}, {
			name : 'phone',
			mapping : 'phone'
		}, {
			name : 'sex',
			mapping : 'sex'
		}, {
			name : 'others',
			mapping : 'others'
		}]
	});

	var searchForm = new Ext.FormPanel({
		labelWidth : 35,
		layout : 'column',
		floating : false,
		bodyStyle : 'padding:5px 5px 0',
		draggable : false,
		defaults : {
			width : 230
		},
		defaultType : 'textfield',
		items : [{
			fieldLabel : '操作员名称',
			name : 'name',
			allowBlank : true,
			id : 'name',
			id : 'name'
		}, {
			xtype : 'combobox',
			fieldLabel : '性别',
			store : store_sex,
			displayField : 'text',
			valueField : 'sex',
			name : 'sex',
			id : 'sex'
		}, {
			fieldLabel : '创建时间从',
			name : 'createDate',
			xtype : 'datefield',
			readOnly : false,
			format : 'Y-m-d H:i:s',
			allowBlank : true,
			id : 'createDateFrom'
		}, {
			fieldLabel : '到',
			name : 'createDate',
			xtype : 'datefield',
			readOnly : false,
			format : 'Y-m-d H:i:s',
			allowBlank : true,
			id : 'createDateTo'
		}],

		buttons : [{
			text : '查询',
			type : 'submit',
			handler : function() {
				store.on('beforeload', function() {
					store.proxy.extraParams = {
						name_LIKE_STRING : Ext.getCmp('name').getValue(),
						sex_EQ_INT : Ext.getCmp('sex').getValue(),
						createDate_GT_DATE : Ext.getCmp('createDateFrom')
								.getValue(),
						createDate_LT_DATE : Ext.getCmp('createDateTo')
								.getValue()
					};
				});
				store.load({
					params : {
						start : 0,
						limit : 10
					}
				});
			}
		}, {
			text : '重置',
			handler : function() {
				searchForm.getForm().reset();
			}
		}]
	}).render("operatordata");
	Ext.define("MyData", {
		extend : "Ext.data.Model",

		fields : ["id", {
			name : "id",
			mapping : "id"
		}, {
			name : "name",
			mapping : "name"
		}, {
			name : "sex",
			type : "string",
			mapping : "sex"
		}, {
			name : "phone",
			type : "string",
			mapping : "phone"
		}, {
			name : "home",
			type : "string",
			mapping : "home"
		}, {
			name : "others",
			type : "string",
			mapping : "others"
		}, {
			name : "createDate",
			mapping : "createDate",
			type : "date",
			dateFormat : 'Y-m-d H:i:s'
		}]
	});
	var store = Ext.create("Ext.data.Store", {
		pageSize : 10,
		model : "MyData",
		proxy : {
			type : "ajax",
			url : "operator_infos.do",
			reader : {
				type : "json",
				root : "items",
				totalProperty : 'totalCount'
			}
		},
		autoLoad : true
	});
	var grid = Ext.create("Ext.grid.Panel", {
		store : store,
		selType : 'checkboxmodel',
		selModel : {
			mode : 'id', // or SINGLE, SIMPLE ... review API for
			// Ext.selection.CheckboxModel
			checkOnly : false
		// or false to allow checkbox selection on click anywhere in row
		},
		layout : "fit",
		columns : [{
			text : "操作员名称",
			flex : 1,
			dataIndex : "name",
			sortable : true,
			renderer : function change(val) {
				return '<span style="color:red;font-weight:bold;" class="bold" >'
						+ val + '</span>';
			}
		}, {
			text : "电话",
			flex : 1,
			dataIndex : "phone",
			sortable : true
		}, {
			text : "地址",
			flex : 1,
			dataIndex : "home",
			sortable : true
		}, {
			text : "性别",
			flex : 1,
			dataIndex : "sex",
			sortable : false,
			renderer : function(v) {
				if (v == 1) {
					return "男";
				} else {
					return "女";
				}
			}
		}, {
			text : "创建日期",
			dataIndex : "createDate",
			sortable : true,
			flex : 1,
			renderer : Ext.util.Format.dateRenderer('Y-m-d')
		}, {
			text : "备注",
			flex : 1,
			dataIndex : "others",
			sortable : true
		}, {
			text : '操作',
			flex : 1,
			xtype : 'actioncolumn',
			items : [{
				icon : 'JXY/images/delete.gif', // Use a URL in the
				// icon config
				tooltip : '删除操作员',
				iconCls : 'delete',
				handler : function(grid, rowIndex, colIndex) {
					var rec = store.getAt(rowIndex);
					function showResult(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								url : 'operator_delete.do',
								params : {
									id : rec.get("id")
								},
								method : 'POST',
								callback : function(options, success, response) {
									if (success) {
										var responseJson = Ext.JSON
												.decode(response.responseText);
										Ext.Msg.alert("提示信息", responseJson.msg);
										store.load({
											params : {
												start : 0,
												limit : 10
											}
										});
									} else {
										Ext.Msg.confirm('失败',
												'请求超时或网络故障,错误编号：['
														+ response.status
														+ ']是否要重新发送？',
												function(btn) {
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
					Ext.MessageBox.confirm('提示信息', '真的要删除一个操作员么?', showResult);
				}
			}, {
				icon : 'JXY/images/application_view_list.png', // Use a URL
				tooltip : '修改操作员信息',
				iconCls : 'view',
				handler : function(grid, rowIndex, colIndex) {
					var rec = store.getAt(rowIndex);
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
							fieldLabel : '操作员',
							name : 'name',
							allowBlank : false,
							blankText : "名称不能为空!"
						}, {
							fieldLabel : '密码',
							name : 'password',
							inputType : "password",
							allowblank : false
						}, {
							fieldLabel : '电话',
							name : 'phone',
							allowBlank : true
						}, {
							fieldLabel : '地址',
							name : 'home',
							allowBlank : true
						}, {
							xtype : 'combobox',
							fieldLabel : '性别',
							store : store_sex,
							displayField : 'text',
							valueField : 'sex',
							name : 'sex',
							allowblank : false
						}, {
							fieldLabel : '备注',
							name : 'others',
							allowBlank : true
						}],

						buttons : [{
							text : '更新',
							type : 'submit',
							handler : function() {
								if (updateForm.form.isValid()) {
									updateForm.form.doAction('submit', {
										url : 'operator_update.do',
										method : 'post',
										params : {
											'id' : rec.get("id")
										},
										success : function(form, action) {
											Ext.Msg.alert("提示信息",
													action.result.msg);
											updateForm.close();
											store.load({
												params : {
													start : 0,
													limit : 10
												}
											});
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
					}).render("operatordata");
					updateForm.form.load({
						url : 'operator_info.do',
						waitMsg : '正在载入数据...',
						params : {
							'id' : rec.get("id")
						},
						success : function(form, action) {
						},
						failure : function(form, action) {
							Ext.MessageBox.alert('提示信息', '操作员信息载入失败');
						}
					});
				}
			}]
		}],
		title : "操作员信息",
		renderTo : "operatordata",
		trackMouseOver : true, // 鼠标特效
		autoScroll : true,
		stateful : true,
		stateId : 'stateGrid',
		viewConfig : {
			columnsText : "显示/隐藏列",
			sortAscText : "正序排列",
			sortDescText : "倒序排列",
			forceFit : true,
			stripeRows : true
		},
		bbar : new Ext.PagingToolbar({
			store : store, // 数据源
			displayInfo : true,
			displayMsg : '当前记录 {0} -- {1} 条 共 {2} 条记录',
			emptyMsg : "暂无数据显示",
			prevText : "上一页",
			nextText : "下一页",
			refreshText : "刷新",
			lastText : "最后页",
			firstText : "第一页",
			beforePageText : "当前页",
			afterPageText : "共{0}页"
		}),
		tbar : // 工具条
		[{
			text : '刷新',
			cls : 'refresh',
			handler : function(btn, pressed) {// 重置查询条件
				store.load({
					params : {
						start : 0,
						limit : 10
					}
				});
			}
		}, {
			text : '添加',
			cls : 'refresh',
			handler : function(btn, pressed) {// 重置查询条件
				var adminForm = new Ext.FormPanel({
					labelWidth : 75, // label settings here cascade
					url : 'operator_info.do',
					closable : true,
					floating : true,
					frame : true,
					title : '添加操作员信息',
					bodyStyle : 'padding:5px 5px 0',
					width : 350,
					x : 340,
					y : 100,
					draggable : true,
					defaults : {
						width : 230
					},
					defaultType : 'textfield',
					items : [{
						fieldLabel : '操作员名称',
						name : 'operator.name',
						allowBlank : false,
						blankText : "名称不能为空!"
					}, {
						fieldLabel : '密码',
						name : 'operator.password',
						allowBlank : false,
						inputType : "password",
						blankText : "密码不能为空！"
					}, {
						fieldLabel : '电话',
						name : 'operator.phone',
						allowBlank : true
					}, {
						fieldLabel : '地址',
						name : 'operator.home',
						allowBlank : true
					}, {
						xtype : 'combobox',
						fieldLabel : '性别',
						store : store_sex,
						displayField : 'text',
						allowblank : false,
						valueField : 'sex',
						name : 'operator.sex'
					}, {
						fieldLabel : '创建时间',
						name : 'operator.createDate',
						xtype : 'datefield',
						readOnly : false,
						format : 'Y-m-d H:i;s'
					}, {
						fieldLabel : '备注',
						name : 'operator.others',
						allowBlank : true
					}],

					buttons : [{
						text : '保存',
						type : 'submit',
						handler : function() {
							if (adminForm.form.isValid()) {
								adminForm.form.doAction('submit', {
									url : 'operator_save.do',// 'login.jsp',
									method : 'post',
									params : '',
									success : function(form, action) {
										Ext.Msg
												.alert("提示信息",
														action.result.msg);
										adminForm.close();
										store.load({
											params : {
												start : 0,
												limit : 10
											}
										});
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
							adminForm.close();
						}
					}]
				}).render("operatordata");
			}
		}]
	});

});
