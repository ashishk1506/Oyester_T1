# 
## Oyester's Node CURD API

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

- routings for registration page & login Page
- CRUD routing operation
- using JWT token as cookies to secure endpoints 

## TechStack
- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [mysql] - database managment
- [heroku] - deployment platform

## Usage
Use the endpoint https://oyesters.herokuapp.com/ to make requests

Route table



|  METHOD      |Endpoint                     |Key                      | Description
|----------------|-------------------------------|-----------------------------|------------------------|
|GET|    /       |  | homepage
|POST       |/registration            |      username, password | new user registration| 
|GET          |/login|login_username,login_password| registered user login|
|GET|/posts            |-         |get all the posts for the user|
|GET         |/posts/:id         |-           |get post by id for the user|
|POST         |/posts|post|create new post
|PUT         |/posts/:id         |   post        |upadate post based on id
|DELETE         |/posts/:id|-|delete post based on id
|GET        |/logout|-| logs out the user

