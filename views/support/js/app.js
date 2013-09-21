Ext.Loader.setConfig( {
	enabled : true
});
Ext.application( {
	name : 'JXY',
	appFolder : 'JXY/js',
	controllers : [ 'Menu' ],
	autoCreateViewport : true
});