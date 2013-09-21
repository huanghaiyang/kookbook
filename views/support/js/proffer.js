Ext.require(["Ext.grid.*", "Ext.data.*"]);
Ext.onReady(function() {
	Ext.QuickTips.init();

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
			fieldLabel : '材料商',
			name : 'fullName',
			allowBlank : true,
			id : 'fullName'
		}, {
			fieldLabel : '联系人',
			name : 'contactPerson',
			allowBlank : true,
			id : 'contactPerson'
		}, {
			fieldLabel : '添加时间从',
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
						fullName_LIKE_STRING : Ext.getCmp('fullName')
								.getValue(),
						contactPerson_LIKE_STRING : Ext.getCmp('contactPerson')
								.getValue(),
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
	}).render("profferdata");

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

	Ext.define('Position', {
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

	var store_position = Ext.create('Ext.data.Store', {
		model : "Position",
		proxy : {
			type : "ajax",
			url : "./JXY/js/combobox/position.js",
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
			name : 'fullName',
			mapping : 'fullName'
		}, {
			name : 'phone',
			mapping : 'phone'
		}, {
			name : 'address',
			mapping : 'address'
		}, {
			name : 'contactPerson',
			mapping : 'contactPerson'
		}, {
			name : 'sex',
			mapping : 'sex'
		}, {
			name : 'others',
			mapping : 'others'
		}, {
			name : 'mail',
			mapping : 'mail'
		}, {
			name : 'postcode',
			mapping : 'postcode'
		}, {
			name : 'webset',
			mapping : 'webset'
		}, {
			name : 'fax',
			mapping : 'fax'
		}, {
			name : 'position',
			mapping : 'position'
		}, {
			name : 'profferId',
			mapping : 'profferId'
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
	Ext.define("MyData", {
		extend : "Ext.data.Model",

		fields : ["id", {
			name : "profferId",
			mapping : "profferId"
		}, {
			name : "fullName",
			mapping : "fullName"
		}, {
			name : "sex",
			type : "string",
			mapping : "sex"
		}, {
			name : "phone",
			type : "string",
			mapping : "phone"
		}, {
			name : "address",
			type : "string",
			mapping : "address"
		}, {
			name : "others",
			type : "string",
			mapping : "others"
		}, {
			name : "contactPerson",
			type : "string",
			mapping : "contactPerson"
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
			url : "proffer_infos.do",
			reader : {
				type : "json",
				root : "items",
				totalProperty : 'totalCount'
			}
		},
		autoLoad : true
	});
	var editForm = new Ext.FormPanel({
		labelWidth : 35,
		layout : 'column',
		floating : false,
		bodyStyle : 'padding:5px 5px 0',
		draggable : false,
		defaults : {
			width : 230
		},
		defaultType : 'textfield',
		reader : new Ext.data.JsonReader({
			root : 'items',
			model : 'back'
		}),
		items : [{
			xtype : 'hidden',
			name : 'profferId'
		}, {
			fieldLabel : '材料商',
			name : 'fullName',
			allowBlank : false,
			blankText : "名称不能为空!"
		}, {
			fieldLabel : '电话',
			name : 'phone',
			allowBlank : true
		}, {
			fieldLabel : '地址',
			name : 'address',
			allowBlank : true
		}, {
			fieldLabel : '必要联系人',
			name : 'contactPerson',
			allowBlank : true
		}, {
			xtype : 'combobox',
			fieldLabel : '性别',
			store : store_sex,
			displayField : 'text',
			valueField : 'sex',
			name : 'sex'
		}, {
			xtype : 'combobox',
			fieldLabel : '联系人职务',
			store : store_position,
			displayField : 'text',
			valueField : 'name',
			name : 'position'
		}, {
			fieldLabel : '邮箱地址',
			name : 'mail',
			allowBlank : true
		}, {
			fieldLabel : '邮编',
			name : 'postcode',
			allowBlank : true
		}, {
			fieldLabel : '网址',
			name : 'webset',
			allowBlank : true
		}, {
			fieldLabel : '传真',
			name : 'fax',
			allowBlank : true
		}, {
			fieldLabel : '备注',
			name : 'others',
			allowBlank : true
		}],

		buttons : [{
			text : '修改',
			type : 'submit',
			handler : function() {
				if (editForm.form.isValid()) {
					editForm.form.doAction('submit', {
						url : 'proffer_update.do',
						method : 'post',
						params : {
							'profferId' : editForm.down('[name=profferId]')
									.getValue()
						},
						success : function(form, action) {
							Ext.Msg.alert("提示信息", action.result.msg);
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
			text : '重置',
			handler : function() {
				editForm.getForm().reset();
			}
		}]
	}).render("profferdata");
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
			flex : 1,
			text : "材料商",
			dataIndex : "fullName",
			sortable : true,
			renderer : function change(val) {
				return '<span style="color:red;font-weight:bold;" class="bold" >'
						+ val + '</span>';
			}
		}, {
			text : "电话",
			dataIndex : "phone",
			flex : 1,

			sortable : true
		}, {
			text : "地址",
			flex : 1,

			dataIndex : "address",
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
			text : "联系人",
			dataIndex : "contactPerson",
			sortable : true
		}, {
			text : "创建日期",
			dataIndex : "createDate",
			sortable : true,
			renderer : Ext.util.Format.dateRenderer('Y-m-d')
		}, {
			text : "备注",
			dataIndex : "others",
			sortable : true
		}, {
			text : '操作',
			xtype : 'actioncolumn',
			items : [{
				icon : 'JXY/images/delete.gif', // Use a URL in the
				// icon config
				tooltip : '删除材料供货商',
				iconCls : 'delete',
				handler : function(grid, rowIndex, colIndex) {
					var rec = store.getAt(rowIndex);
					function showResult(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								url : 'proffer_delete.do',
								params : {
									profferId : rec.get("id")
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
					Ext.MessageBox
							.confirm('提示信息', '真的要删除一个材料供货商么?', showResult);
				}
			}]
		}],
		title : "材料供货商信息",
		renderTo : "profferdata",
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
					url : 'proffer_info.do',
					closable : true,
					floating : true,
					frame : true,
					title : '添加材料供货商信息',
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
						fieldLabel : '材料商',
						name : 'proffer.fullName',
						allowBlank : false,
						blankText : "名称不能为空!"
					}, {
						fieldLabel : '电话',
						name : 'proffer.phone',
						allowBlank : true
					}, {
						fieldLabel : '地址',
						name : 'proffer.address',
						allowBlank : true
					}, {
						fieldLabel : '必要联系人',
						name : 'proffer.contactPerson',
						allowBlank : true,
						blankText : "请输入必要联系人"
					}, {
						xtype : 'combobox',
						fieldLabel : '性别',
						blankText : '请选择联系人性别',
						store : store_sex,
						displayField : 'text',
						valueField : 'sex',
						name : 'proffer.sex'
					}, {
						xtype : 'combobox',
						fieldLabel : '联系人职务',
						blankText : '请选择联系人职务',
						store : store_position,
						displayField : 'text',
						valueField : 'name',
						name : 'proffer.position'
					}, {
						fieldLabel : '邮箱地址',
						name : 'proffer.mail',
						allowBlank : true
					}, {
						fieldLabel : '邮编',
						name : 'proffer.postcode',
						allowBlank : true
					}, {
						fieldLabel : '网址',
						name : 'proffer.webset',
						allowBlank : true
					}, {
						fieldLabel : '传真',
						name : 'proffer.fax',
						allowBlank : true
					}, {
						fieldLabel : '创建时间',
						name : 'proffer.createDate',
						xtype : 'datefield',
						readOnly : false,
						format : 'Y-m-d H:i;s'
					}, {
						fieldLabel : '备注',
						xtype : 'textareafield',
						name : 'proffer.others',
						anchor : '80%',
						height : 40,
						allowBlank : true
					}],

					buttons : [{
						text : '保存',
						type : 'submit',
						handler : function() {
							if (adminForm.form.isValid()) {
								adminForm.form.doAction('submit', {
									url : 'proffer_save.do',// 'login.jsp',
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
				}).render("profferdata");
			}
		}, {
			text : '导出为Excel',
			handler : function() {
				Ext.Msg.alert("下载提示",
						"<a href='excel_list.do?flag=proffer'>点击此处下载xls文件</a>");
			}
		}]
	});
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
		editForm.form.load({
			url : 'proffer_info_detail.do',
			waitMsg : '正在载入数据...',
			params : {
				'profferId' : id
			},
			success : function(form, action) {
			},
			failure : function(form, action) {
				Ext.MessageBox.alert('提示信息', '材料商信息载入失败');
			}
		});
	}

});
