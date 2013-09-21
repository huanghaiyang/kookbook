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

	var store_proffer = Ext.create('Ext.data.Store', {
		model : "material",
		proxy : {
			type : "ajax",
			url : "material_get.do",
			reader : {
				type : "json",
				root : "items"
			}
		},
		pageSize : 100000,
		autoLoad : true
	});
	var updateForm = new Ext.FormPanel({
		labelWidth : 75, // label settings here cascade
		closable : true,
		floating : true,
		frame : true,
		title : '增加库存',
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
			emptyText : '请填写数量信息'
		}, {
			xtype : 'combobox',
			fieldLabel : '材料',
			store : store_proffer,
			displayField : 'name',
			valueField : 'mid',
			name : 'mid'
		}, {
			fieldLabel : '备注',
			name : 'others'
		}],

		buttons : [{
			text : '增加',
			type : 'submit',
			handler : function() {
				if (updateForm.form.isValid()) {
					updateForm.form.doAction('submit', {
						url : 'stock_save.do',
						method : 'post',
						params : {},
						success : function(form, action) {
							Ext.Msg.alert("提示信息", action.result.msg);
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
	}).render("instock_data");

});