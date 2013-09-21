Ext.define('JXY.view.TabPanel', {
	extend : 'Ext.tab.Panel',
	initComponent : function() {
		Ext.apply(this, {
			id : 'content-panel',
			region : 'center',
			defaults : {
				autoScroll : true,
				bodyPadding : 10
			},
			activeTab : 0,
			border : false,
			plain : true,
			collapsible : true,
			items : [{
				id : 'HomePage',
				title : '首页',
				iconCls : 'home',
				autoLoad : 'JXY/jsp/home/home.jsp'
			}]
		});
		this.callParent(arguments);
	}
})