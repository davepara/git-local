package com.roy.mybatis;

public interface MyExecutor {
	
	public <T> T query(String statement);
	
	
}
