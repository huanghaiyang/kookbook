Ext.require(["Ext.grid.*", "Ext.data.*"]);
Ext.onReady(function() {
	Ext.QuickTips.init();

	Ext.define('material', {
		extend : 'Ext.data.Model',
		autoLoad : false,
		fields : [{
			type : 'string',
			name : 'name'
		}, {
			type : 'string',
			name : 'mid'
		}]
	});
	var store_material = Ext.create('Ext.data.Store', {
		model : "material",
		proxy : {
			type : "ajax",
			url : "material_get.do",
			reader : {
				type : "json",
				root : "items"
			}
		},
		pageSize : 100000
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
			name : "code",
			mapping : "code"
		}, {
			name : "materialname",
			mapping : "materialname"
		}, {
			name : "number",
			mapping : "number"
		}, {
			name : "flag",
			mapping : "flag"
		}, {
			name : "exportFlag",
			mapping : "exportFlag"
		}, {
			name : "others",
			type : "string",
			mapping : "others"
		}, {
			name : "exportDate",
			mapping : "exportDate",
			type : "date",
			dateFormat : 'Y-m-d H:i:s'
		}]
	});
	var store = Ext.create("Ext.data.Store", {
		pageSize : 10,
		model : "MyData",
		proxy : {
			type : "ajax",
			url : "exportBill_infos.do",
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
			text : "添加人员",
			flex : 1,
			dataIndex : "operator",
			sortable : true,
			renderer : function change(val) {
				return '<span style="color:red;font-weight:bold;" class="bold" >'
						+ val + '</span>';
			}
		}, {
			text : "消耗单编号",
			flex : 1,
			dataIndex : "code",
			sortable : true
		}, {
			text : "材料名称",
			flex : 1,
			dataIndex : "materialname",
			sortable : true,
			renderer : function change(val) {
				return '<span style="color:red;font-weight:bold;" class="bold" >'
						+ val + '</span>';
			}
		}, {
			text : "消耗数量",
			dataIndex : "number",
			flex : 1,
			sortable : true
		}, {
			text : "材料出单日期",
			dataIndex : "exportDate",
			flex : 1,
			sortable : true,
			renderer : Ext.util.Format.dateRenderer('Y-m-d')
		}, {
			text : "备注",
			flex : 1,
			dataIndex : "others",
			sortable : true
		}, {
			text : "流转状态",
			dataIndex : "flag",
			sortable : true,
			flex : 1,
			renderer : function(v) {
				if (v == 1) {
					return "管理员已批复";
				}
				if (v == 0) {
					return "正在批复中";
				}
				if (v == 2) {
					return "已退回";
				}
			}
		}, {
			text : "是否出库",
			flex : 1,
			dataIndex : "exportFlag",
			sortable : true,
			renderer : function(v) {
				if (v == 1) {
					return "已出库";
				}
				if (v == 0) {
					return "未出库";
				}
			}
		}, {
			text : '操作',
			xtype : 'actioncolumn',
			items : [{
				icon : 'JXY/images/delete.gif', // Use a URL in the
				// icon config
				tooltip : '删除材料消耗清单',
				iconCls : 'delete',
				handler : function(grid, rowIndex, colIndex) {
					var rec = store.getAt(rowIndex);
					function showResult(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								url : 'exportBill_delete.do',
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
					Ext.MessageBox.confirm('提示信息', '真的要删除此条材料消耗清单么?',
							showResult);
				}
			}, {

				icon : 'JXY/images/bsp19hez.bmp', // Use a URL in the
				// icon config
				tooltip : '材料出库',
				iconCls : 'export',
				handler : function(grid, rowIndex, colIndex) {
					var rec = store.getAt(rowIndex);
					function showResult(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								url : 'exportBill_save_export.do',
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
					Ext.MessageBox.confirm('提示信息', '按照此材料清单出库?', showResult);
				}
			}]
		}],
		title : "材料消耗清单",
		renderTo : "export_bill_data",
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
					closable : true,
					floating : true,
					frame : true,
					title : '添加材料消耗清单',
					bodyStyle : 'padding:5px 5px 0',
					draggable : true,
					defaults : {
						width : 230
					},
					defaultType : 'textfield',
					items : [{
						fieldLabel : '清单编号',
						name : 'bill.code',
						allowBlank : true
					}, {
						xtype : 'combobox',
						fieldLabel : '消耗材料',
						store : store_material,
						displayField : 'name',
						valueField : 'mid',
						name : 'mid',
						listeners : {
							change : function() {
								var totalnumber = Ext.getCmp('totalnumber');
								Ext.Ajax.request({
									url : 'stock_get_number.do',
									params : {
										mid : this.value
									},
									method : 'POST',
									callback : function(options, success,
											response) {
										if (success) {
											var responseJson = Ext.JSON
													.decode(response.responseText);
											totalnumber
													.setValue(responseJson.number);
										} else {
											totalnumber.setValue('现在无法统计...');
										}
									}
								});

							}
						}
					}, {
						fieldLabel : '库存剩余数量',
						id : 'totalnumber',
						name : 'bill.totalMoney',
						allowBlank : false,
						disabled : true
					}, {
						fieldLabel : '创建时间',
						name : 'bill.exportDate',
						xtype : 'datefield',
						readOnly : false,
						format : 'Y-m-d H:i;s'
					}, {
						fieldLabel : '数量',
						name : 'bill.number',
						allowBlank : true
					}, {
						fieldLabel : '备注',
						name : 'bill.others',
						allowBlank : true
					}],

					buttons : [{
						text : '保存',
						type : 'submit',
						handler : function() {
							if (adminForm.form.isValid()) {
								adminForm.form.doAction('submit', {
									url : 'exportBill_save.do',// 'login.jsp',
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
				}).render("export_bill_data");
			}
		}]
	});

});
