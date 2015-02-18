<xsql>
	<uxsql_query driver='sqlite' db_name='configuration'>INSERT INTO serialport (port, enable, baudrate, databits, parity, stopbits, handshake, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?);</uxsql_query>
		<uxsql_parameter type="text" http_post='port'>0</uxsql_parameter>
		<uxsql_parameter type="int" http_post='enable'></uxsql_parameter>
		<uxsql_parameter type="int" http_post='baudrate'></uxsql_parameter>
		<uxsql_parameter type="int" http_post='databits'></uxsql_parameter>	
		<uxsql_parameter type="int" http_post='parity'></uxsql_parameter>	
		<uxsql_parameter type="int" http_post='stopbits'></uxsql_parameter>	
		<uxsql_parameter type="int" http_post='handshake'></uxsql_parameter>
		<uxsql_parameter type="text" http_post='note'></uxsql_parameter>	
		
</xsql>
