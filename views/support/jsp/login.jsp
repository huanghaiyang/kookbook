<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">

		<title>My JSP 'login.jsp' starting page</title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
<style type="text/css">
		body{
				color: #262626;
	background: #f4f4f4;
		}
		#ti{
			position:fixed;
			height:20px;
			left:38%;
			top:30%;
			font-size:30px;
		}
	</style>
	</head>
<link rel="stylesheet" type="text/css" href="ext-4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="JXY/css/header.css" />
	<script type="text/javascript" src="ext-4.0/ext-all.js"></script>
	<script type="text/javascript" src="ext-4.0/bootstrap.js"></script>
	<script type="text/javascript" src="JXY/jsp/login.js"></script>
	
	<body>
	
	<div id="ti">
		欢迎来到进销存管理系统
	</div>
	</body>
</html>
