Ext.define("JXY.controller.Menu", {
	extend : "Ext.app.Controller",
	refs : [{
		ref : "JXYmenu",
		selector : "JXYtablepanel"
	}, {
		ref : "tabPanel",
		selector : "JXYtablepanel"
	}],
	init : function() {
		this.control({
			"JXYmenu" : {
				itemmousedown : this.loadMenu
			}
		});
	},
	loadMenu : function(selModel, record) {
		if (record.get("leaf")) {
			var panel = Ext.getCmp(record.get("id"));
			if (!panel) {
				panel = {
					title : "" + record.get("text"),
					layout : "fit",
					iconCls : "tabs",
					autoLoad : {
						url : "JXY/js/" + record.get("id") + ".jsp",
						scripts : true
					},
					closable : true
				};
				this.openTab(panel, record.get("id"));
			} else {
				var main = Ext.getCmp("content-panel");
				main.setActiveTab(panel);
			}
		}
	},
	openTab : function(panel, id) {
		var o = (typeof panel == "string" ? panel : id || panel.id);
		var main = Ext.getCmp("content-panel");
		var tab = main.getComponent(o);
		if (tab) {
			main.setActiveTab(tab);
		} else {
			if (typeof panel != "string") {
				panel.id = o;
				var p = main.add(panel);
				main.setActiveTab(p);
			}
		}
	}
});
