Ext.define('kookbook.view.Header', {
	extend : 'Ext.Component',
	initComponent : function() {
		Ext.applyIf(this, {
			xtype : 'box',
			cls : 'header',
			region : 'north',
			contentEl:'north',
			height : 30
		});
		this.callParent(arguments);
	}
});