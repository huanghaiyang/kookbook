Ext.define('JXY.view.Viewport', {
	extend : 'Ext.Viewport',
	layout : 'fit',
	hideBorders : true,
	requires : ['JXY.view.Header', 'JXY.view.Menu', 'JXY.view.TabPanel',
			'JXY.view.South'],
	initComponent : function() {
		var me = this;
		Ext.apply(me, {
			items : [{
				id : 'desk',
				layout : 'border',
				items : [Ext.create('JXY.view.Header'),
						Ext.create('JXY.view.Menu'),
						Ext.create('JXY.view.TabPanel'),
						Ext.create('JXY.view.South')]
			}]
		});
		me.callParent(arguments);
	}
})