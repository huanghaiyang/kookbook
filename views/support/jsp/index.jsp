<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page language="java" import="entity.AdminUser"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	AdminUser adminuser=(AdminUser)session.getAttribute("adminuser");		
	if(adminuser==null){
		response.sendRedirect("../jsp/login.jsp");
	}else{
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">

		<title>进销存管理系统</title>
 <meta  http-equiv ="content-type"  content ="text/html; charset=utf-8" >
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<style type="text/css">
			#href_back:hover{
				font-weight:bold;
			}
		</style>
		<script src="jquery/jquery-1.7.js"></script>
	<link rel="stylesheet" type="text/css" href="ext-4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="JXY/css/header.css" />
	<script type="text/javascript" src="ext-4.0/ext-all.js"></script>
	<script type="text/javascript" src="ext-4.0/bootstrap.js"></script>
	<script type="text/javascript" src="JXY/js/app.js"></script>
	<script type="text/javascript">
	
	Ext.define('JXY.store.Menus', {
	extend : 'Ext.data.TreeStore',
	root : {
		expanded : true
	},
	proxy : {
		type : 'ajax',
		url : './JXY/js/MenuLoader.js'
	}
})
	Ext.define('JXY.view.South', {
	extend : 'Ext.Toolbar',
	initComponent : function() {
		Ext.apply(this, {
			id : "bottom",
			// frame:true,
			region : "south",
			height : 23,
			items : [
					"当前用户：<%=adminuser.getUsername() %>[<a href='javascript:logout();' id='href_back'>退出系统</a>]",
					'->',
					"技术支持:<a href='JXY/jsp/zhichi.jsp' target='_blank' style='text-decoration:none;'><font color='#0000FF'>边洋杰</font></a>&nbsp;&nbsp;"]
		});
		this.callParent(arguments);
		}
	})
	
	function logout(){
		$.ajax( {
					type : 'POST',
					url : '<%=basePath%>admin_logout.do?op=2',
					timeout: 10000,    
					async:false,
					dataType : 'json',
					success : function(json){
				 	   if(json!=null){
				 	   		if(json.flag=="true"){
				 	   			window.location="JXY/js/login.jsp";
			 	   			}if(json.flag=="false"){
				 	   			alert(json.msg);
			 	   			}
				 	   }
					}
				});
	}
	</script>
	<body>
	</body>
</html>
<%} %>
