package com.roy.mybatis;

import java.lang.reflect.Proxy;

public class MyDefaultSqlSession implements MySqlSession {
	
	private MyExecutor executor = new MyBaseExecutor();

	@Override
	public <T> T selectOne(String var1) {
		
		return executor.query(var1);
	}

	@Override
	public <T> T getMapper(Class<T> var1) {
		
		return (T)Proxy.newProxyInstance(var1.getClassLoader(), new Class[]{var1}, new MyMapperProxy(this));
	}

}
