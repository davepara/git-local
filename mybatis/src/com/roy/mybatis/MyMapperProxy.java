package com.roy.mybatis;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class MyMapperProxy implements InvocationHandler {

	private MySqlSession sqlSession;
	
	public MyMapperProxy(){
		
	}
	
	public MyMapperProxy(MySqlSession session){
		sqlSession = session;
	}
	
	@Override
	public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
		String mapperClass = method.getDeclaringClass().getName();
		if(SubjectMapperXml.NAMESPACE.equals(mapperClass)){
			String methodName = method.getName();
			String originSql = SubjectMapperXml.getMethodSql(methodName);
			String formatSql = String.format(originSql, String.valueOf(args[0]));
			return sqlSession.selectOne(formatSql);
		}
		return null;
	}

}
