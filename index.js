const uuid = require('uuid');
const express = require('express')
const app = express()

const create = {
    number: (length) => {
        return Math.floor((Math.random() * Math.pow(10, length)));
    },
    user: () => {
        return {
            id: uuid.v4(),
            name: 'Haukur Hlöðversson',
            ssn: create.number(10).toString(),
            email: 'haukur@stefna.is',
            phone: create.number(7).toString(),
            bio: 'Hello bello',
            comment: 'This is a comment',
            language: 'is',
            image: 'http://ru.is',
            created_at: '2020-10-28T18:53:32.318Z',
            updated_at: '2020-10-28T18:53:32.318Z',
        }
    },
    users: (quantity = 10) => {
        const users = [];

        for (let i = quantity; i > 0; i--) {
            users.push(create.user());
        }
        return users;
    },
    contact: () => {
        return {
            id: uuid.v4(),
            address: 'Kaffistræti 7',
            postal_code: '104',
            email: 'john@smith.com',
            phone: create.number(7).toString(),
            created_at: '2020-10-28T19:28:53.165Z',
            updated_at: '2020-10-28T19:28:53.165Z',
        };
    },
    restaurant: () => {
        return {
            id: uuid.v4(),
            name: 'Matarkofinn',
            contact: create.contact(),
            created_at: '2020-10-28T19:32:46.729Z',
            updated_at: '2020-10-28T19:32:46.729Z',
        }
    },
    restaurants: (quantity = 10) => {
        const restaurants = [];

        for (let i = quantity; i > 0; i--) {
            restaurants.push(create.restaurant());
        }
        return restaurants;
    },
    menugroup: () => {
        return {
            id: uuid.v4(),
            name: "Hádegismatur",
            time_of_day: "12:00",
            deadline: create.number(8),
            type: "open",
            period_price: 20000,
            default_price: 1000,
            period_start: "2020-10-28T19:37:01.027Z",
            period_end: "2020-10-28T19:37:01.027Z",
            archive: true,
            created_at: "2020-10-28T19:37:01.027Z",
            updated_at: "2020-10-28T19:37:01.027Z"
        }
    },
    menugroups: (quantity = 10) => {
        const menugroups = [];

        for (let i = quantity; i > 0; i--) {
            menugroups.push(create.restaurant());
        }
        return menugroups;
    }
}

const users = create.users(12);
const restaurants = create.restaurants(2);


app.get('/', function (req, res) {
    res.send({ message: 'Hello World' });
})

app.get('/users', function (req, res) {
    res.send(users);
})

app.get('/users/:id', function (req, res) {
    const id = req.params.id;
    const user = users.filter(user => user.id === id);
    if (!user.length) {
        return res.status(404).send({ error: 404, message: 'User not found' });
    }
    res.send(user);
})

app.post('/users', function (req, res) {
    const user = {
        id: uuid.v4(),
        ...req.body,
        created_at: (new Date('October 15, 1996 05:35:32')).toISOString(),
        updated_at: (new Date('October 15, 1996 05:35:32')).toISOString(),
    };
    users.push(user);
    res.send(user);
})

app.put('/users/:id', function (req, res) {
    const id = req.params.id;
    const user = users.filter(user => user.id === id);
    if (!user.length) {
        return res.status(404).send({ error: 404, message: 'User not found' });
    }
    user.push(req.body);
    res.send(user);
})

app.get('/restaurants', function (req, res) {
    res.send(restaurants);
})

app.listen(9060)
