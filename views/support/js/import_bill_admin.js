Ext.require(["Ext.grid.*", "Ext.data.*"]);
Ext.onReady(function() {
	Ext.QuickTips.init();

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
			dataIndex : "operator",
			flex : 1,
			sortable : true,
			renderer : function change(val) {
				return '<span style="color:red;font-weight:bold;" class="bold" >'
						+ val + '</span>';
			}
		}, {
			text : "编号",
			dataIndex : "code",
			flex : 1,
			sortable : true
		}, {
			text : "材料名称",
			dataIndex : "materialname",
			flex : 1,
			sortable : true,
			renderer : function change(val) {
				return '<span style="color:red;font-weight:bold;" class="bold" >'
						+ val + '</span>';
			}
		}, {
			text : "供应商",
			dataIndex : "proffer",
			flex : 1,
			sortable : true,
			renderer : function change(val) {
				return '<span style="color:red;font-weight:bold;" class="bold" >'
						+ val + '</span>';
			}
		}, {
			text : "采购单价",
			dataIndex : "importPrice",
			flex : 1,
			sortable : true
		}, {
			text : "采购数量",
			dataIndex : "number",
			flex : 1,
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
			dataIndex : "others",
			flex : 1,
			sortable : true
		}, {
			text : "流转状态",
			flex : 1,
			dataIndex : "flag",
			sortable : false,
			renderer : function(v) {
				if (v == 1) {
					return '<span style="color:red;font-weight:bold; " class="bold" >管理员已批复</span>';
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
			xtype : 'actioncolumn',
			flex : 1,
			items : [{
				icon : 'JXY/images/02.png', // Use a URL in the
				// icon config
				tooltip : '批准采购清单',
				iconCls : 'approve',
				handler : function(grid, rowIndex, colIndex) {
					var rec = store.getAt(rowIndex);
					function showResult(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								url : 'importBill_update_approve.do',
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
					Ext.MessageBox.confirm('提示信息',
							'您将对此清单进行批复，批复之后，操作员将会按清单进行材料采购，确定么?', showResult);
				}
			}]
		}],
		title : "材料采购清单",
		renderTo : "import_bill_admin_data",
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
		}]
	});

});
