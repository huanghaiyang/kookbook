Ext.define('kookbook.view.Viewport', {
	extend : 'Ext.Viewport',
	layout : 'fit',
	hideBorders : true,
	requires : ['kookbook.view.Header', 'kookbook.view.Menu', 'kookbook.view.TabPanel',
			'kookbook.view.South'],
	initComponent : function() {
		var me = this;
		Ext.apply(me, {
			items : [{
				id : 'desk',
				layout : 'border',
				items : [Ext.create('kookbook.view.Header'),
						Ext.create('kookbook.view.Menu'),
						Ext.create('kookbook.view.TabPanel'),
						Ext.create('kookbook.view.South')]
			}]
		});
		me.callParent(arguments);
	}
})