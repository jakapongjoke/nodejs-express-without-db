# nodejs-express-without-db
nodejs-express-without-db 


<h1>HOW Does It work</h1>

<h2>Using Postman with Todolist Backend</h2>


<p>
<h3>1. Login to Get Authentication Token</h3>
<strong>Endpoint:</strong> POST /v1.0/login
<strong>Body (JSON):</strong>

Copy Token
Copy the authentication token received in the login response. You will use this token to authenticate subsequent requests.
</p>


<p>
<h3>2. View Todos for a User</h3>
<strong>Endpoint:</strong> GET /v1.0/todos/:user_id
<strong>Header:</strong>
<strong>Key:</strong> Authorization
<strong>Value:</strong> Bearer your-authentication-token
<strong>Replace :</strong> user_id with the actual user ID.
</p>

<p>
<h3>3. View Tasks for a User</h3>
<strong>Endpoint:</strong> GET /v1.0/viewlist/:user_id
<strong>Header:</strong>
<strong>Key:</strong> Authorization
<strong>Value:</strong> Bearer your-authentication-token
<strong>Replace :</strong> user_id with the actual user ID.
</p>


<p>
<h3>4. Update a Todo</h3>
<strong>Endpoint:</strong> PUT /v1.0/todos/:task_id
<strong>Header:</strong>
<strong>Key:</strong> Authorization
<strong>Value:</strong> Bearer your-authentication-token
</p>

<p>
<h3>5. Delete a Todo</h3>
<strong>Endpoint:</strong>  DELETE /v1.0/todos/:task_id
<strong>Header:</strong> 
<strong>Key:</strong>  Authorization
<strong>Value:</strong>   Bearer your-authentication-token</p>