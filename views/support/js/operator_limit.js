Ext.require(['*']);
Ext.onReady(function() {
	Ext.QuickTips.init();

	var storeTree = Ext.create('Ext.data.TreeStore', {
		autoLoad : false,
		root : {
			text : '操作员权限',
			id : 'root',
			expanded : true,
			leaf : false,
			checked : false
		},
		folderSort : true
	});

	var store2 = Ext.create('Ext.data.TreeStore', {
		autoLoad : false,
		root : {
			text : '操作员权限',
			id : 'root2',
			expanded : true,
			leaf : false,
			checked : false
		},
		folderSort : true
	});

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
		groupField : 'roleFlag',
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
	}).render("operator_limit_data");
	var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
		groupHeaderTpl : ' {roleFlag} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
	});
	var grid = Ext.create("Ext.grid.Panel", {
		store : store,
		features : [groupingFeature],
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
			text : "创建日期",
			dataIndex : "createDate",
			sortable : true,
			flex : 1,
			renderer : Ext.util.Format.dateRenderer('Y-m-d')
		}, {
			text : '操作',
			flex : 1,
			xtype : 'actioncolumn',
			items : [{
				icon : 'JXY/images/application_view_list.png',
				tooltip : '修改管理员权限',
				iconCls : 'view',
				handler : function(grid, rowIndex, colIndex) {
					var rec = store.getAt(rowIndex);
					storeTree.setProxy({
						type : 'ajax',
						url : 'limitOperator_getLimitInfo_all.do'
					});
					storeTree.on('beforeload', function() {
						storeTree.proxy.extraParams = {
							id : rec.get('id')
						};
					});
					storeTree.load({
						callback : function(r, options, success) {
							store2.setProxy({
								type : 'ajax',
								url : 'limitOperator_getOperatorLimit_all.do'
							});
							store2.on('beforeload', function() {
								store2.proxy.extraParams = {
									id : rec.get('id')
								};
							});
							store2.load();
						}
					});

					var treePanel = new Ext.FormPanel({
						width : 502,
						height : 500,
						x : 300,
						y : 30,
						store : store2,
						floating : true,
						draggable : true,
						closable : true,
						renderTo : 'operator_limit_data',
						title : '操作员权限',
						layout : 'column',
						items : [{
							xtype : 'treepanel',
							id : 'tree',
							store : storeTree,
							width : 250,
							height : 430,
							title : '可分配权限',
							autoScroll : true,
							viewConfig : {
								plugins : {
									ptype : 'treeviewdragdrop',
									appendOnly : true
								},
								onCheckboxChange : function(e, t) {
									var item = e.getTarget(this
											.getItemSelector(), this
											.getTargetEl());
									var record;
									if (item) {
										record = this.getRecord(item);
										var check = !record.get('checked');
										record.set('checked', check);
										if (check) {
											record.bubble(function(parentNode) {
												if ('操作员权限' != parentNode
														.get('text')) {
													parentNode.set('checked',
															true);
												}
											});
											record.cascadeBy(function(node) {
												node.set('checked', true);
											});
										} else {
											record.cascadeBy(function(node) {
												node.set('checked', false);
											});
											record.bubble(function(parentNode) {
												if ('操作员权限' != parentNode
														.get('text')) {
													var flag = true;
													for (var i = 0; i < parentNode.childNodes.length; i++) {
														var child = parentNode.childNodes[i];
														if (child
																.get('checked')) {
															flag = false;
															continue;
														}
													}
													if (flag) {
														parentNode.set(
																'checked',
																false);
													}
												}
											});
										}
									}
								}
							}
						}, {
							xtype : 'treepanel',
							id : 'tree2',
							store : store2,
							width : 250,
							height : 430,
							title : '已分配权限',
							viewConfig : {
								plugins : {
									ptype : 'treeviewdragdrop',
									appendOnly : true
								},
								onCheckboxChange : function(e, t) {
									var item = e.getTarget(this
											.getItemSelector(), this
											.getTargetEl()), record;
									if (item) {
										record = this.getRecord(item);
										var check = !record.get('checked');
										record.set('checked', check);
										if (check) {
											record.bubble(function(parentNode) {
												if ('操作员权限' != parentNode
														.get('text')) {
													parentNode.set('checked',
															true);
												}
											});
											record.cascadeBy(function(node) {
												node.set('checked', true);
											});
										} else {
											record.cascadeBy(function(node) {
												node.set('checked', false);
											});
											record.bubble(function(parentNode) {
												if ('操作员权限' != parentNode
														.get('text')) {
													var flag = true;
													for (var i = 0; i < parentNode.childNodes.length; i++) {
														var child = parentNode.childNodes[i];
														if (child
																.get('checked')) {
															flag = false;
															continue;
														}
													}
													if (flag) {
														parentNode.set(
																'checked',
																false);
													}
												}
											});
										}
									}
								}
							}
						}],
						buttons : [{
							text : '确认',
							type : 'submit',
							handler : function() {
								var checkedNodes = Ext.getCmp('tree2')
										.getChecked();
								var checkedIds = [];
								for (var i = 0; i < checkedNodes.length; i++) {
									if (checkedNodes[i].hasChildNodes()) {
									} else {
										checkedIds.push(checkedNodes[i]
												.get("id"));
									}
								}
								// 更新操作员的权限文件
								Ext.Ajax.request({
									url : 'limitOperator_update.do',
									params : {
										ids : checkedIds,
										id : rec.get('id')
									},
									timeout : 60000,
									success : function(response) {
										var json = Ext.JSON
												.decode(response.responseText);
										Ext.Msg.alert("消息提示", json.msg);
									},
									failure : function() {
										Ext.Msg.alert("消息提示", "错误，请联系管理员");
									}
								});

							}
						}, {
							text : '移除',
							handler : function() {
								var checkedNodes = Ext.getCmp('tree2')
										.getChecked();
								for (var i = 0; i < checkedNodes.length; i++) {
									if (checkedNodes[i].hasChildNodes()) {
									} else {
										checkedNodes[i].remove();
									}
								}
							}
						}]
					});
				}
			}]
		}],
		title : "操作员信息",
		renderTo : "operator_limit_data",
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
