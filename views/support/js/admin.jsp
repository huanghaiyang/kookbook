<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">

		<title>My JSP 'admin.jsp' starting page</title>

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<style type="text/css">
.bold:hover {
	cursor: pointer;
}

.x-grid-row-over .x-grid-cell-inner {
	font-weight: bold;
}

.delete:hover,.view:hover {
	CURSOR: pointer;
}
</style>
	</head>
	<script type="text/javascript" src="ext-4.0/locale/ext-lang-zh_CN.js"></script>
	<script type="text/javascript" src="JXY/js/admin.js"></script>
	<body>
		<div id="admindata"></div>
	</body>
</html>
