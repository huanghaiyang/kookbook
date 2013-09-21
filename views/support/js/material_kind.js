Ext.require(["Ext.grid.*", "Ext.data.*"]);
Ext.onReady(function() {
	Ext.QuickTips.init();

	Ext.define('back', {
		extend : 'Ext.data.Model',
		autoLoad : false,
		fields : [{
			name : 'fullName',
			mapping : 'fullName'
		}, {
			name : 'code',
			mapping : 'code'
		}, {
			name : 'others',
			mapping : 'others'
		}]
	});
	Ext.define("MyData", {
		extend : "Ext.data.Model",

		fields : ["id", {
			name : "id",
			mapping : "id"
		}, {
			name : 'operator',
			mapping : 'operator'
		}, {
			name : "fullName",
			mapping : "fullName"
		}, {
			name : "code",
			mapping : "code"
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
			url : "materialKind_infos.do",
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
			text : "操作员",
			width : 100,
			flex : 1,
			dataIndex : "operator",
			sortable : true,
			renderer : function change(val) {
				return '<span style="color:red;font-weight:bold;" class="bold" >'
						+ val + '</span>';
			}
		}, {
			text : "材料类别名称",
			width : 100,
			flex : 1,
			dataIndex : "fullName",
			sortable : true,
			renderer : function change(val) {
				return '<span style="color:red;font-weight:bold;" class="bold" >'
						+ val + '</span>';
			}
		}, {
			text : "编号",
			width : 100,
			flex : 1,
			dataIndex : "code",
			sortable : true
		}, {
			text : "创建日期",
			width : 100,
			flex : 1,
			dataIndex : "createDate",
			sortable : true,
			renderer : Ext.util.Format.dateRenderer('Y-m-d')
		}, {
			text : "备注",
			width : 100,
			flex : 1,
			dataIndex : "others",
			sortable : true
		}, {
			text : '操作',
			width : 100,
			flex : 1,
			xtype : 'actioncolumn',
			items : [{
				icon : 'JXY/images/delete.gif', // Use a URL in the
				// icon config
				tooltip : '删除材料类别',
				iconCls : 'delete',
				handler : function(grid, rowIndex, colIndex) {
					var rec = store.getAt(rowIndex);
					function showResult(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								url : 'materialKind_delete.do',
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
				tooltip : '修改材料类别信息',
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
							fieldLabel : '材料类别名称',
							name : 'fullName',
							allowBlank : false,
							blankText : "名称不能为空!"
						}, {
							fieldLabel : '编号',
							name : 'code',
							allowBlank : true
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
										url : 'materialKind_update.do',
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
					}).render("material_kinddata");
					updateForm.form.load({
						url : 'materialKind_info.do',
						waitMsg : '正在载入数据...',
						params : {
							'id' : rec.get("id")
						},
						success : function(form, action) {
						},
						failure : function(form, action) {
							Ext.MessageBox.alert('提示信息', '材料类别信息载入失败');
						}
					});
				}
			}]
		}],
		title : "材料类别信息",
		renderTo : "material_kinddata",
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
					url : 'materialKind_info.do',
					closable : true,
					floating : true,
					frame : true,
					title : '添加材料类别信息',
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
						fieldLabel : '材料类别名称',
						name : 'kind.fullName',
						allowBlank : false,
						blankText : "名称不能为空!"
					}, {
						fieldLabel : '编号',
						name : 'kind.code',
						allowBlank : true
					}, {
						fieldLabel : '创建时间',
						name : 'kind.createDate',
						xtype : 'datefield',
						readOnly : false,
						format : 'Y-m-d H:i;s'
					}, {
						fieldLabel : '备注',
						name : 'kind.others',
						allowBlank : true
					}],

					buttons : [{
						text : '保存',
						type : 'submit',
						handler : function() {
							if (adminForm.form.isValid()) {
								adminForm.form.doAction('submit', {
									url : 'materialKind_save.do',// 'login.jsp',
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
				}).render("material_kinddata");
			}
		}, {
			text : '导出为Excel',
			handler : function() {
				Ext.Msg
						.alert("下载提示",
								"<a href='excel_list.do?flag=material_kind'>点击此处下载xls文件</a>");
			}
		}]
	});

});
