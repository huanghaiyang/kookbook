[{
	"text" : "人员信息管理",
	"id" : "man",
	"iconCls" : "manage",
	"leaf" : false,
	"children" : [{
		"text" : "管理员信息",
		"id" : "admin",
		"iconCls" : "manage",
		"leaf" : true
	}, {
		"text" : "材料商管理",
		"id" : "proffer",
		"iconCls" : "manage",
		"leaf" : true
	}, {
		"text" : "操作员管理",
		"id" : "operator",
		"iconCls" : "manage",
		"leaf" : true
	}, {
		"text" : "修改个人信息",
		"id" : "admin_update",
		"iconCls" : "manage",
		"leaf" : true
	}]
}, {
	"text" : "材料类别管理",
	"id" : "_material_",
	"iconCls" : "_material_",
	"leaf" : false,
	"children" : [{
		"text" : "材料类别",
		"id" : "material_kind",
		"iconCls" : "material_kind",
		"leaf" : true
	}]
}, {
	"text" : "材料管理",
	"id" : "_material",
	"iconCls" : "manage",
	"leaf" : false,
	"children" : [{
		"text" : "材料",
		"id" : "material",
		"iconCls" : "manage",
		"leaf" : true
	}]
}, {
	"text" : "库存管理",
	"id" : "stocks",
	"iconCls" : "manage",
	"leaf" : false,
	"children" : [{
		"text" : "增加库存",
		"id" : "instock",
		"iconCls" : "manage",
		"leaf" : true
	}, {
		"text" : "查看库存",
		"id" : "stocktotal",
		"iconCls" : "manage",
		"leaf" : true
	}, {
		"text" : "入库记录",
		"id" : "stockhistory",
		"iconCls" : "manage",
		"leaf" : true
	}, {
		"text" : "出库记录",
		"id" : "stock_out_history",
		"iconCls" : "manage",
		"leaf" : true
	}]
}, {
	"text" : "材料采购",
	"id" : "_import",
	"iconCls" : "manage",
	"leaf" : false,
	"children" : [{
		"text" : "材料采购批复任务",
		"id" : "import_bill_admin",
		"iconCls" : "manage",
		"leaf" : true
	}]
}, {
	"text" : "材料消耗",
	"id" : "_export",
	"iconCls" : "manage",
	"leaf" : false,
	"children" : [{
		"text" : "材料消耗批复任务",
		"id" : "export_bill_admin",
		"iconCls" : "manage",
		"leaf" : true
	}]
}, {
	"text" : "基本设置",
	"id" : "baseset",
	"iconCls" : "manage",
	"leaf" : false,
	"children" : [{
		"text" : "操作员权限",
		"id" : "operator_limit",
		"iconCls" : "manage",
		"leaf" : true
	}, {
		"text" : "权限节点文件设置",
		"id" : "operator_limit_file",
		"iconCls" : "manage",
		"leaf" : true
	}]
}]