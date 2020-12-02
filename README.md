# Webapp-cloudwatch

Technology stack used for this application is MySQL & Node JS

### Installation
```
Install Node JS
Install MySQL & Sequelize
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
User sign in using authentication credentials user_name and password. 

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
```

```
DELETE - Authenticated Route to delete a answer to a question
http://{APP_URL}/v1/question/{question_id}/answer/{answer_id}
Delete a question's answer
```

```
DELETE - Authenticated Route to delete a question
http://{APP_URL}/v1​/question​/{question_id}
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
​http://{APP_URL}/v1​/question​/{question_id}​/answer/{answer_id}file​/{file_id}
```

```
DELETE - Authenticated Route delete a file to a question
​http://{APP_URL}/v1​/question​/{question_id}​/file​/{file_id}
```

```
DELETE - Public Route to get user information
​http://{APP_URL}/v1​/user​/{id}
```

```
GET - Public Route to get user information
​http://{APP_URL}/v1​/user​/{id}
```

```
GET - Get a question's answer
http://{APP_URL}/v1​/question​/{question_id}​/answer​/{answer_id}
```

```
GET - Get a question's answer
http://{APP_URL}/v1​/question​/{question_id}​/answer​/{answer_id}
```

```
GET - Get all questions 
​http://{APP_URL}/v1​/questions
```

```
GET - Get question using question id
http://{APP_URL}/v1/question/{question_id}
```
### Logging and Metrics

```
Utilised AWS SDK to upload application logs and metrics to AWS cloud Watch 
```

### SNS, Lambda and SES

```
Simple Notification Service to publish the topic and serverless function will be triggred to send email using Simple Email Service and Update as required under DybamoDB
```
