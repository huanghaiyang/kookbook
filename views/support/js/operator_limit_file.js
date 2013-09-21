Ext.require(['Ext.data.*', 'Ext.grid.*']);
Ext.onReady(function() {
	var searchForm = new Ext.FormPanel({
		layout : 'column',
		floating : false,
		bodyStyle : 'padding:5px 5px 0',
		draggable : false,
		html : '注意，每一个权限节点都会对应一个JS文件，JS文件主要指系统操作人员功能性操作的的具体页面，操作员登陆，系统初始化菜单树时，需要加载这些JS文件。因此，管理员在赋予操作员操作权限时，JS权限节点必不可少'
	}).render("limit_file_data");
	Ext.define('limitType', {
		extend : 'Ext.data.Model',
		autoLoad : false,
		fields : [{
			type : 'string',
			name : 'text'
		}, {
			type : 'string',
			name : 'name'
		}]
	});
	var store_limitType = Ext.create('Ext.data.Store', {
		model : "limitType",
		proxy : {
			type : "ajax",
			url : "./JXY/js/combobox/limitType.js",
			reader : {
				type : "json"
			}
		},
		autoLoad : true
	});
	Ext.define('limit', {
		extend : 'Ext.data.Model',
		fields : ['code', {
			name : 'name',
			mapping : 'name'
		}, {
			name : 'purpose',
			mapping : 'purpose'
		}, {
			name : 'groupful',
			mapping : 'groupful'
		}, {
			name : 'fileid',
			mapping : 'fileid'
		}]
	});

	var limits = Ext.create('Ext.data.Store', {
		storeId : 'code',
		model : 'limit',
		sorters : ['name', 'purpose', 'groupful', 'fileid', 'code'],
		groupField : 'groupful',
		proxy : {
			type : "ajax",
			url : "./JXY/js/combobox/limit.js",
			reader : {
				type : "json"
			}
		},
		autoLoad : true,
		pageSize : 10000
	});

	var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
		groupHeaderTpl : '权限父节点: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
				+ '<font color="black">适于</font><font color="red">{name}人员</font>'
				+ '->' + '<font title="如：入库权限-RKQX">编号请以节点名称大写缩写命名<font>'
	});

	var grid = Ext.create('Ext.grid.Panel', {
		renderTo : 'limit_file_data',
		collapsible : true,
		iconCls : 'icon-grid',
		frame : true,
		store : limits,
		title : '权限节点',
		features : [groupingFeature],
		columns : [{
			text : '编号',
			flex : 1,
			dataIndex : 'code'
		}, {
			text : '节点名称',
			flex : 1,
			dataIndex : 'name'
		}, {
			text : '文件Id（索引）',
			flex : 1,
			dataIndex : 'fileid'
		}, {
			text : '父节点',
			flex : 1,
			dataIndex : 'groupful'
		}, {
			text : '描述',
			flex : 1,
			dataIndex : 'purpose'
		}, {
			text : '操作',
			flex : 1,

			xtype : 'actioncolumn',
			items : [{
				icon : 'JXY/images/delete.gif', // Use a URL in the
				tooltip : '删除权限节点',
				iconCls : 'delete',
				handler : function(grid, rowIndex, colIndex) {
					var rec = limits.getAt(rowIndex);
					function showResult(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								url : 'limit_delete.do',
								params : {
									code : rec.get("code")
								},
								method : 'POST',
								callback : function(options, success, response) {
									if (success) {
										var responseJson = Ext.JSON
												.decode(response.responseText);
										Ext.Msg.alert("提示信息", responseJson.msg);
										limits.load();
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
							'真的要删除此权限节点么，删除权限节点可能会造成系统无法运行，删除前请先备份权限文件?',
							showResult);
				}
			}, {
				icon : 'JXY/images/application_view_list.png', // Use
				tooltip : '修改权限节点信息',
				iconCls : 'view',
				handler : function(grid, rowIndex, colIndex) {
					var rec = limits.getAt(rowIndex);
					var updateForm = new Ext.FormPanel({
						labelWidth : 75, // label settings here
						closable : true,
						floating : true,
						frame : true,
						title : '修改权限节点信息',
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
							model : 'limit'
						}),
						items : [{
							fieldLabel : '权限编号',
							name : 'code',
							allowBlank : false,
							blankText : "编号不能为空!"
						}, {
							fieldLabel : '权限名称',
							name : 'name',
							allowBlank : false,
							blankText : "名称不能为空!"
						}, {
							fieldLabel : '文件Id',
							name : 'fileid',
							allowBlank : false,
							blankText : "文件Id不能为空！"
						}, {
							xtype : 'combobox',
							fieldLabel : '权限父节点',
							store : store_limitType,
							displayField : 'text',
							valueField : 'name',
							allowBlank : false,
							name : 'groupful'
						}, {
							fieldLabel : '权限说明（目的）',
							name : 'purpose',
							blankText : "说明不能为空！",
							allowBlank : false,
							xtype : 'textareafield',
							anchor : '80%',
							height : 40
						}],
						buttons : [{
							text : '更新',
							type : 'submit',
							handler : function() {
								if (updateForm.form.isValid()) {
									updateForm.form.doAction('submit', {
										url : 'limit_update.do',
										method : 'post',
										params : {
											'codeid' : rec.get("code")
										},
										success : function(form, action) {
											Ext.Msg.alert("提示信息",
													action.result.msg);
											updateForm.close();
											limits.load();
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
					}).render("limit_file_data");
					updateForm.form.load({
						url : 'limit_info.do',
						waitMsg : '正在载入数据...',
						params : {
							'code' : rec.get("code")
						},
						success : function(form, action) {
						},
						failure : function(form, action) {
							Ext.MessageBox.alert('提示信息', '权限信息载入失败');
						}
					});
				}
			}]
		}],
		tbar : // 工具条
		[{
			text : '刷新',
			cls : 'refresh',
			handler : function(btn, pressed) {// 重置查询条件
				limits.load();
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
					title : '添加权限节点',
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
						fieldLabel : '权限编号',
						name : 'limit.code',
						allowBlank : false,
						blankText : "编号不能为空!"
					}, {
						fieldLabel : '权限名称',
						name : 'limit.name',
						allowBlank : false,
						blankText : "名称不能为空!"
					}, {
						fieldLabel : '文件Id',
						name : 'limit.fileid',
						allowBlank : false,
						blankText : "文件Id不能为空！"
					}, {
						xtype : 'combobox',
						fieldLabel : '权限父节点',
						store : store_limitType,
						displayField : 'text',
						valueField : 'name',
						allowBlank : false,
						name : 'limit.groupful'
					}, {
						fieldLabel : '权限说明（目的）',
						name : 'limit.purpose',
						blankText : "说明不能为空！",
						allowBlank : false,
						xtype : 'textareafield',
						anchor : '80%',
						height : 40
					}],

					buttons : [{
						text : '保存',
						type : 'submit',
						handler : function() {
							if (adminForm.form.isValid()) {
								adminForm.form.doAction('submit', {
									url : 'limit_save.do',// 'login.jsp',
									method : 'post',
									params : '',
									success : function(form, action) {
										Ext.Msg
												.alert("提示信息",
														action.result.msg);
										adminForm.close();
										limits.load();
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
				}).render("limit_file_data");
			}
		}, {
			text : '导出权限文件',
			handler : function() {
				Ext.Msg
						.alert(
								"下载提示",
								"<a href='limit_download.do' algin='center'  title='导出权限文件到本地，以防文件丢失？: )'>点击导出权限文件</a>");
			}
		}],
		fbar : ['->']
	});
});
