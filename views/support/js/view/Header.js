Ext.define('JXY.view.Header', {
	extend : 'Ext.Component',
	initComponent : function() {
		Ext.applyIf(this, {
			xtype : 'box',
			cls : 'header',
			region : 'north',
			html : '<h2>进销存管理系统</h2>',
			height : 30
		});
		this.callParent(arguments);
	}
});