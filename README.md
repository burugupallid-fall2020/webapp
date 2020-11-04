# webapp

Technology stack used for this application is MySQL and Node JS

### Installation
```
Install Node JS 
Install MySQL
```
### Running the Web application

To install node packages for application
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

```
POST - Authenticated Route to post a question 
http://{APP_URL}/v1/question
```

```
POST - Authenticated Route to post a answer to question 
http://{APP_URL}/v1/question/{question_id}/answer
```

```
PUT - Authenticated Route to update a answer to a question 
http://{APP_URL}/v1​/question​/{question_id}​/answer​/{answer_id}
​
Update a question's answer
```

```
DELETE - Authenticated Route to delete a answer to a question
http://{APP_URL}/v1/question/{question_id}/answer/{answer_id}
Delete a question's answer
```

```
DELETE - Authenticated Route to delete a question
http://{APP_URL}/v1​/question​/{question_id}
Delete a question
```

```
PUT - Authenticated Route to Update a question with question id
http://{APP_URL}​/v1​/question​/{question_id}
```

```
POST - Authenticated Route Upload a file to question
http://{APP_URL}​/v1/question/{question_id}/file
```

```
POST - Authenticated Route Upload a file to a answer
http://{APP_URL}​/v1/question/{question_id}/answer/{answer_id}/file
```

```
DELETE - Authenticated Route delete a file to a answer
​http://{APP_URL}/v1​/question​/{question_id}​/file​/{file_id}
```


User sign in using authentication credentials user_name and password. 

