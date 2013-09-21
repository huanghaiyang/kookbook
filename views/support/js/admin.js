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

	Ext.define('back', {
		extend : 'Ext.data.Model',
		autoLoad : false,
		fields : [{
			name : 'username',
			mapping : 'username'
		}, {
			name : 'nickname',
			mapping : 'nickname'
		}, {
			name : 'password',
			mapping : 'password'
		}, {
			name : 'sex',
			mapping : 'sex'
		}, {
			name : 'telephone',
			mapping : 'telephone'
		}, {
			name : 'address',
			mapping : 'address'
		}, {
			name : 'fax',
			mapping : 'fax'
		}, {
			name : 'localphone',
			mapping : 'localphone'
		}, {
			name : 'age',
			mappgin : 'age'
		}, {
			name : 'registDate',
			mapping : 'registDate'
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
			fieldLabel : '用户名',
			name : 'username',
			allowBlank : true,
			id : 'username'
		}, {
			fieldLabel : '昵称',
			name : 'nickname',
			allowBlank : true,
			id : 'nickname'
		}, {
			xtype : 'combobox',
			fieldLabel : '性别',
			store : store_sex,
			displayField : 'text',
			valueField : 'sex',
			name : 'sex',
			id : 'sex',
			allowBlank : true
		}, {
			fieldLabel : '注册时间从',
			name : 'registDate',
			xtype : 'datefield',
			readOnly : false,
			format : 'Y-m-d H:i:s',
			allowBlank : true,
			id : 'registDateFrom'
		}, {
			fieldLabel : '到',
			name : 'registDate',
			xtype : 'datefield',
			readOnly : false,
			format : 'Y-m-d H:i:s',
			allowBlank : true,
			id : 'registDateTo'
		}],

		buttons : [{
			text : '查询',
			type : 'submit',
			handler : function() {
				store.on('beforeload', function() {
					store.proxy.extraParams = {
						username_LIKE_STRING : Ext.getCmp('username')
								.getValue(),
						nickname_LIKE_STRING : Ext.getCmp('nickname')
								.getValue(),
						sex_EQ_INT : Ext.getCmp('sex').getValue(),
						registDate_GT_DATE : Ext.getCmp('registDateFrom')
								.getValue(),
						registDate_LT_DATE : Ext.getCmp('registDateTo')
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
	}).render("admindata");
	Ext.define("MyData", {
		extend : "Ext.data.Model",

		fields : ["id", {
			name : "id",
			mapping : "id"
		}, {
			name : "username",
			mapping : "username"
		}, {
			name : "sex",
			type : "string"
		}, {
			name : "level",
			type : "int"
		}, {
			name : "createDate",
			mapping : "createDate",
			type : "date",
			dateFormat : 'Y-m-d H:i:s'
		}, {
			name : "registDate",
			type : "date",
			dateFormat : 'Y-m-d H:i:s',
			mapping : "registDate"
		}]
	});
	var store = Ext.create("Ext.data.Store", {
		pageSize : 10,
		model : "MyData",
		proxy : {
			type : "ajax",
			url : "admin_infos.do",
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
			text : "用户名",
			flex : 1,

			dataIndex : "username",
			sortable : true,
			renderer : function change(val) {
				return '<span style="color:red;font-weight:bold;" class="bold" >'
						+ val + '</span>';
			}
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
			text : "管理员级别",
			flex : 1,
			dataIndex : "level",
			sortable : false,
			renderer : function(v) {
				if (v == 1) {
					return "超级管理员";
				} else {
					return "普通管理员";
				}
			}
		}, {
			text : "创建日期",
			dataIndex : "createDate",
			sortable : true,
			flex : 1,

			renderer : Ext.util.Format.dateRenderer('Y-m-d')
		}, {
			text : "注册日期",
			dataIndex : "registDate",
			flex : 1,

			sortable : true,
			renderer : Ext.util.Format.dateRenderer('Y-m-d')
		}, {
			text : '操作',
			flex : 1,

			xtype : 'actioncolumn',
			items : [{
				icon : 'JXY/images/delete.gif', // Use a URL in the
				// icon config
				tooltip : '删除管理员',
				iconCls : 'delete',
				handler : function(grid, rowIndex, colIndex) {
					var rec = store.getAt(rowIndex);
					function showResult(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								url : 'admin_delete.do',
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
					Ext.MessageBox.confirm('提示信息', '真的要删除一个管理员么?', showResult);
				}
			}, {
				icon : 'JXY/images/application_view_list.png', // Use a URL
				// in the
				tooltip : '修改管理员信息',
				iconCls : 'view',
				handler : function(grid, rowIndex, colIndex) {
					var rec = store.getAt(rowIndex);
					var updateForm = new Ext.FormPanel({
						labelWidth : 75, // label settings here cascade
						autoload : 'admin_info.do',
						closable : true,
						floating : true,
						frame : true,
						title : '修改管理员信息',
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
							fieldLabel : '用户名',
							name : 'username',
							allowBlank : false
						}, {
							fieldLabel : '昵称',
							name : 'nickname',
							allowBlank : false
						}, {
							fieldLabel : '密码',
							name : 'password',
							inputType : "password"
						}, {
							xtype : 'combobox',
							fieldLabel : '性别',
							store : store_sex,
							displayField : 'text',
							valueField : 'sex',
							name : 'sex'
						}],
						buttons : [{
							text : '更新',
							type : 'submit',
							handler : function() {
								if (updateForm.form.isValid()) {
									updateForm.form.doAction('submit', {
										url : 'admin_update.do',
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
					}).render("admindata");
					updateForm.form.load({
						url : 'admin_info.do',
						waitMsg : '正在载入数据...',
						params : {
							'id' : rec.get("id")
						},
						success : function(form, action) {
						},
						failure : function(form, action) {
							Ext.MessageBox.alert('提示信息', '管理员信息载入失败');
						}
					});
				}
			}]
		}],
		title : "管理员信息",
		renderTo : "admindata",
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
					url : 'admin_info.do',
					closable : true,
					floating : true,
					frame : true,
					title : '添加管理员信息',
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
						fieldLabel : '用户名',
						name : 'user.username',
						allowBlank : false,
						blankText : "用户名不能为空!"
					}, {
						fieldLabel : '昵称',
						name : 'user.nickname',
						allowBlank : false,
						blankText : "昵称不能为空!"
					}, {
						fieldLabel : '密码',
						name : 'user.password',
						allowBlank : false,
						inputType : "password",
						blankText : "密码不能为空！"
					}, {
						xtype : 'combobox',
						fieldLabel : '性别',
						store : store_sex,
						displayField : 'text',
						valueField : 'sex',
						name : 'user.sex'
					}, {
						fieldLabel : '创建时间',
						name : 'user.createDate',
						xtype : 'datefield',
						readOnly : false,
						format : 'Y-m-d H:i;s'
					}, {
						fieldLabel : '注册时间',
						name : 'user.registDate',
						xtype : 'datefield',
						readOnly : false,
						format : 'Y-m-d H:i:s'
					}],

					buttons : [{
						text : '保存',
						type : 'submit',
						handler : function() {
							if (adminForm.form.isValid()) {
								adminForm.form.doAction('submit', {
									url : 'admin_save.do',// 'login.jsp',
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
				}).render("admindata");
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
		var detailForm = new Ext.FormPanel({
			labelWidth : 75, // label settings here cascade
			closable : true,
			floating : true,
			frame : true,
			title : '管理员详细信息',
			bodyStyle : 'padding:5px 5px 0',
			width : 500,
			layout : 'column',
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

				fieldLabel : '用户名',
				name : 'username',
				allowBlank : false
			}, {
				fieldLabel : '昵称',
				name : 'nickname',
				allowBlank : false
			}, {
				fieldLabel : '密码',
				name : 'password',
				inputType : "password"
			}, {
				xtype : 'combobox',
				fieldLabel : '性别',
				store : store_sex,
				displayField : 'text',
				valueField : 'sex',
				name : 'sex'
			}, {
				fieldLabel : '地址',
				name : 'address',
				inputType : "address"
			}, {
				fieldLabel : '电话',
				name : 'localphone',
				inputType : "localphone"
			}],
			buttons : [{
				text : '关闭',
				handler : function() {
					detailForm.close();
				}
			}]
		}).render("admindata");
		detailForm.form.load({
			url : 'admin_info_detail.do',
			waitMsg : '正在载入数据...',
			params : {
				'id' : id
			},
			success : function(form, action) {
			},
			failure : function(form, action) {
				Ext.MessageBox.alert('提示信息', '管理员信息载入失败');
			}
		});

	}

});
