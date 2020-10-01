# webapp

Technology stack used for this application is MySQL and Node JS

### Installation
```
Install Node JS 
Install MySQL
```
### Running the Web application

To install application
```
npm install 
```
To Test application 
```
npm run test 
```

To run the application 
```
node app.js
```

### About the application
```
POST - Public API without authentication 
http://{APP_URL}/v1/user 
```

User sign_up  using email_address, password, first_name, last_name
Only one account can be created using one email_address. 

```
PUT - API with user authentication using Basic Auth
http://{APP_URL}/v1/user/self
```
User can update the information 

```
GET - API with user authentication using Basic Auth
http://{APP_URL}/v1/user/self
```
User sign in using authentication credentials user_name and password. 

