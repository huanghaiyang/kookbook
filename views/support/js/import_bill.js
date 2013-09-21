Ext.require(["Ext.grid.*", "Ext.data.*"]);
Ext.onReady(function() {
	Ext.QuickTips.init();

	Ext.define('proffer', {
		extend : 'Ext.data.Model',
		autoLoad : false,
		fields : [{
			type : 'string',
			name : 'name'
		}, {
			type : 'string',
			name : 'id'
		}]
	});

	var store_proffer = Ext.create('Ext.data.Store', {
		model : "proffer",
		proxy : {
			type : "ajax",
			url : "proffer_get.do",
			reader : {
				type : "json",
				root : "items"
			}
		},
		pageSize : 100000
	});

	Ext.define('material', {
		extend : 'Ext.data.Model',
		autoLoad : false,
		fields : [{
			type : 'string',
			name : 'name'
		}, {
			type : 'string',
			name : 'id'
		}]
	});
	var store_material = Ext.create('Ext.data.Store', {
		model : "material",
		proxy : {
			type : "ajax",
			url : "material_get_proffer.do",
			reader : new Ext.data.JsonReader({
				type : "json",
				root : "items"
			}, [{
				name : "id"
			}, {
				name : "name"
			}])
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
			name : "flag",
			mapping : "flag"
		}, {
			name : "proffer",
			mapping : "proffer"
		}, {
			name : "materialname",
			mapping : "materialname"
		}, {
			name : "number",
			mapping : "number"
		}, {
			name : "importPrice",
			mapping : "importPrice"
		}, {
			name : "totalMoney",
			mapping : "totalMoney"
		}, {
			name : "others",
			type : "string",
			mapping : "others"
		}, {
			name : "importDate",
			mapping : "importDate",
			type : "date",
			dateFormat : 'Y-m-d H:i:s'
		}]
	});
	var store = Ext.create("Ext.data.Store", {
		pageSize : 10,
		model : "MyData",
		proxy : {
			type : "ajax",
			url : "importBill_infos.do",
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
			text : "编号",
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
			text : "供应商",
			flex : 1,
			dataIndex : "proffer",
			sortable : true,
			renderer : function change(val) {
				return '<span style="color:red;font-weight:bold;" class="bold" >'
						+ val + '</span>';
			}
		}, {
			text : "采购单价",
			flex : 1,
			dataIndex : "importPrice",
			sortable : true
		}, {
			text : "采购数量",
			flex : 1,
			dataIndex : "number",
			sortable : true
		}, {
			text : "材料总价",
			flex : 1,
			dataIndex : "totalMoney",
			sortable : true
		}, {
			text : "采购日期",
			flex : 1,
			dataIndex : "importDate",
			sortable : true,
			renderer : Ext.util.Format.dateRenderer('Y-m-d')
		}, {
			text : "备注",
			flex : 1,
			dataIndex : "others",
			sortable : true
		}, {
			text : "流转状态",
			flex : 1,
			dataIndex : "flag",
			sortable : false,
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
			text : '操作',
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
								url : 'importBill_delete.do',
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
					Ext.MessageBox.confirm('提示信息', '真的要删除此条采购清单么?', showResult);
				}
			}]
		}],
		title : "材料采购清单",
		renderTo : "import_bill_data",
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
					title : '添加材料采购清单',
					bodyStyle : 'padding:5px 5px 0',
					draggable : true,
					defaults : {
						width : 230
					},
					defaultType : 'textfield',
					items : [{
						fieldLabel : '编号',
						name : 'bill.code',
						allowBlank : true
					}, {
						xtype : 'combobox',
						fieldLabel : '供应商',
						store : store_proffer,
						displayField : 'name',
						queryMode : 'remote',
						valueField : 'id',
						name : 'profferId',
						id : 'profferCombo',
						listeners : {
							'select' : function() {
								var macom = Ext.getCmp('macom');
								macom.clearValue();
								store_material.load({
									params : {
										profferId : this.value
									}
								});
							}
						}
					}, {
						xtype : 'combobox',
						fieldLabel : '材料',
						queryMode : 'local',
						store : store_material,
						id : 'macom',
						displayField : 'name',
						valueField : 'id',
						name : 'mid',
						listeners : {
							change : function() {
								var money = Ext.getCmp('money');
								var importPrice = Ext.getCmp('importPrice');
								money.setValue(this.value
										* importPrice.getValue());
							}
						}
					}, {
						fieldLabel : '创建时间',
						name : 'bill.importDate',
						xtype : 'datefield',
						readOnly : false,
						format : 'Y-m-d H:i;s'
					}, {
						fieldLabel : '单价',
						name : 'bill.importPrice',
						allowBlank : true,
						id : 'importPrice'
					}, {
						fieldLabel : '数量',
						name : 'bill.number',
						allowBlank : true
					}, {
						fieldLabel : '总价',
						id : 'money',
						name : 'bill.totalMoney',
						allowBlank : false,
						disabled : true
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
									url : 'importBill_save.do',// 'login.jsp',
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
				}).render("import_bill_data");
			}
		}]
	});

});
