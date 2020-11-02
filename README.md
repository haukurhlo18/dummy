# Dummy API

Dummy API for matartorg

## Install stuff

```bash
npm install
```

## Start API

```
node index.js
```

## Use API

Now you can use the API at http://localhost:9060

You can play around with the routes and do stuff

## Routes

```
GET:    /users
POST:   /users
GET:    /users/{id}
PUT:    /users/{id}

GET:    /restaurants
POST:   /restaurants

GET:    /companies
POST:   /companies
GET:    /companies/{id}
PUT:    /companies/{id}
GET:    /companies/{id}/restaurants

POST:   /menu-groups

GET:    /menus
POST:   /menus

POST:   /meals
```

## Example usage

**Create user**

In terminal
```bash
curl -XPOST "http://localhost:9060/users" -H 'Content-Type: application/json' -d'{"name": "Kalli Johnson", "ssn": "1946151684", "email": "kalli@kassagerdin.is", "phone": "5885522", "bio": "Fun to be alive", "comment": "Love dates", "language": "is" }'
```

In JavaScript
```js
const payload = {
    name: "Kalli Johnson",
    ssn: "1809922519",
    email: "kalli@kassagerdin.is",
    phone: "5885522",
    bio: "Fun to be alive",
    comment: "Love dates",
    language: "is"
};

const response = await fetch('http://localhost:9060/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
```

**Update user**

User id required in path

In terminal
```bash
curl -XPUT "http://localhost:9060/users/19c246c2-9ae8-40e2-886d-6a98af51d463" -H 'Content-Type: application/json' -d'{"name": "Seth McMayor", "email": "kalli@bilabudin.is", "phone": "5812345" }'
```

In JavaScript
```js
const payload = {
    name: "Seth McMayor",
    email: "kalli@bilabudin.is",
    phone: "5812345"
};

const response = await fetch('http://localhost:9060/users/19c246c2-9ae8-40e2-886d-6a98af51d463', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
```
