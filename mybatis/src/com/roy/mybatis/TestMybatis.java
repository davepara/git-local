package com.roy.mybatis;

public class TestMybatis {

	public static void main(String[] args) {
		start();
	}
	
	public static void start(){
		
		MySqlSession session = new MyDefaultSqlSession();
		SubjectMapper mapper = session.getMapper(SubjectMapper.class);
		Subject subject = mapper.findById("11e6-ad65-ae9a5222-b632-73472f");
		System.out.println("subject:"+subject);
	}
}
