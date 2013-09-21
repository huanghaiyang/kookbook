Ext.define('kookbook.store.Menus', {
	extend : 'Ext.data.TreeStore',
	root : {
		expanded : true
	},
	proxy : {
		type : 'ajax',
		url : '/ext_support/MenuLoader.js'
	}
});
Ext.define('kookbook.view.South', {
	extend : 'Ext.Toolbar',
	initComponent : function() {
		Ext.apply(this, {
			id : "bottom",
			region : "south",
			height : 23,
			items : [
					"[<a href='javascript:logout();' id='href_back'>退出系统</a>]",
					'->',
					"技术支持:<a href='' target='_blank' style='text-decoration:none;'><font color='#0000FF'>@kookung</font></a>&nbsp;&nbsp;"]
		});
		this.callParent(arguments);
	}
})

function logout(){
	Ext.Ajax.request({
         waitMsg: '正在退出',
		  waitTitle: '提示',
		         url : '/support/adminLogout' ,
		         method : 'get' ,
		         success: function(response , options) {
		         var result = Ext.JSON.decode(response.responseText); 
		  if(result.error)
		  {
		    Ext.MessageBox.alert(result.error) ;
		    return ;
		  }
		  else if(result.success == "true")
		    window.location = "/support/adminLogin" ;
		},
		failure: function(response , options) {
		  Ext.MessageBox.alert("退出失败!") ;
		}
    }) ;
}