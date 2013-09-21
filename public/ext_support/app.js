Ext.Loader.setConfig( {
	enabled : true
});
Ext.application( {
	name : 'kookbook',
	appFolder : '/ext_support',
	controllers : [ 'Menu' ],
	autoCreateViewport : true
});