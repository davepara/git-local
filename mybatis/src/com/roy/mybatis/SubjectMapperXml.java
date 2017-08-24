package com.roy.mybatis;

import java.util.HashMap;
import java.util.Map;

public class SubjectMapperXml {

	public static final String NAMESPACE = "com.roy.mybatis.SubjectMapper";
	
	private static Map<String,Object> methodSqlMap = new HashMap<String,Object>();
	
	static{
		methodSqlMap.put("findById", "select * from subject where id = '%s'");
	}
	
	public static String getMethodSql(String methodName){
		return methodSqlMap.get(methodName).toString();
	}
}
