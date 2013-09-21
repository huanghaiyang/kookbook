Ext.require(["Ext.grid.*", "Ext.data.*"]);
Ext.onReady(function() {
	Ext.QuickTips.init();

	Ext.define("MyData", {
		extend : "Ext.data.Model",

		fields : ["id", {
			name : "id",
			mapping : "id"
		}, {
			name : "materialname",
			mapping : "materialname"
		}, {
			name : "number",
			mapping : "number"
		}]
	});
	var store = Ext.create("Ext.data.Store", {
		pageSize : 10,
		model : "MyData",
		proxy : {
			type : "ajax",
			url : "stock_infos_total.do",
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
			text : "材料名称",
			dataIndex : "materialname",
			sortable : true,
			renderer : function change(val) {
				return '<span style="color:red;font-weight:bold;" class="bold" >'
						+ val + '</span>';
			}
		}, {
			text : "数量",
			dataIndex : "number",
			sortable : true
		}, {
			text : '操作',
			width : 50,
			xtype : 'actioncolumn',
			items : [{
				icon : 'JXY/images/application_view_list.png', // Use a URL
				tooltip : '材料出库',
				iconCls : 'view',
				handler : function(grid, rowIndex, colIndex) {
					var rec = store.getAt(rowIndex);
					var updateForm = new Ext.FormPanel({
						labelWidth : 75, // label settings here cascade
						closable : true,
						floating : false,
						frame : true,
						title : '材料出库',
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
						items : [{
							fieldLabel : '数量',
							name : 'number',
							allowBlank : true
						}, {
							fieldLabel : '备注',
							name : 'others',
							allowBlank : true
						}],

						buttons : [{
							text : '出库',
							type : 'submit',
							handler : function() {
								if (updateForm.form.isValid()) {
									updateForm.form.doAction('submit', {
										url : 'stock_save_out.do',
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
					}).render("totaldata");
				}
			}]
		}],
		title : "库存信息",
		renderTo : "totaldata",
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
