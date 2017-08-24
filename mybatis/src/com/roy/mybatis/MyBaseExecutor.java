package com.roy.mybatis;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class MyBaseExecutor implements MyExecutor {

	@Override
	public <T> T query(String statement) {
		
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		
		try{
			conn = DriverManager.getConnection(Constants.CONN_URL,Constants.CONN_USERNAME,Constants.CONN_PASSWORD);
			ps = conn.prepareStatement(statement);
			rs = ps.executeQuery();
			
			Subject s = null;
			if(rs.next()){
				s = new Subject();
				s.setId(rs.getString("id"));
				s.setCode(rs.getInt("code"));
				s.setName(rs.getString("name"));
			}
			return (T)s;
		}catch(Exception e){
			System.out.println(e.getMessage());
		}
		
		return null;
	}

}
