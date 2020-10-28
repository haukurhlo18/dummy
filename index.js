const uuid = require('uuid');
const express = require('express');
const app = express();
app.use(express.json());

const create = {
    tmpContacts: [],
    number: (length) => {
        return Math.floor((Math.random() * Math.pow(10, length)));
    },
    datetime: () => {
        return (new Date()).toISOString();
    },
    user: (data = {}) => {
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
            ...data,
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
    contact: (data = {}) => {
        const datetime = create.datetime();
        return {
            id: uuid.v4(),
            address: 'Kaffistræti 7',
            postal_code: '104',
            email: 'john@smith.com',
            phone: create.number(7).toString(),
            ...data,
            created_at: datetime,
            updated_at: datetime,
        };
    },
    subContact: (data) => {
        let contact;
        if (data.contact) {
            if (data.contact.id) {
                contact = create.contact(data.contact);
                create.tmpContacts.push(contact);
            }
        } else {
            contact = create.contact();
            create.tmpContacts.push(contact);
        }
        return contact;
    },
    company: (data = {}) => {
        const datetime = create.datetime();
        const sub = create.subContact(data);
        data.contact = sub ? sub : data.contact;

        return {
            id: uuid.v4(),
            name: 'Matarkofinn',
            ssn: create.datetime(10),
            contact: create.contact(),
            ...data,
            created_at: datetime,
            updated_at: datetime,
        }
    },
    companies: (quantity = 10) => {
        const companies = [];

        for (let i = quantity; i > 0; i--) {
            companies.push(create.company());
        }
        return companies;
    },
    restaurant: (data = {}) => {
        const datetime = create.datetime();
        const sub = create.subContact(data);
        data.contact = sub ? sub : data.contact;

        return {
            id: uuid.v4(),
            company_id: companies[0] ? companies[0].id : null,
            name: 'Matarkofinn',
            contact: create.contact(),
            ...data,
            created_at: datetime,
            updated_at: datetime,
        }
    },
    restaurants: (quantity = 10) => {
        const restaurants = [];

        for (let i = quantity; i > 0; i--) {
            restaurants.push(create.restaurant());
        }
        return restaurants;
    },
    menugroup: (data = {}) => {
        const datetime = create.datetime();
        return {
            id: uuid.v4(),
            name: "Hádegismatur",
            time_of_day: "12:00",
            deadline: create.number(8),
            type: "open",
            period_price: 20000,
            default_price: 1000,
            period_start: "2020-10-28",
            period_end: "2020-10-28",
            archive: true,
            ...data,
            created_at: datetime,
            updated_at: datetime,
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

const getById = (resources, id) => {
    const resource = resources.filter(resource => resource.id === id);
    if (!resource.length) {
        return null;
    }
    return resource[0];
}

const exists = (resources, id) => {
    return getById(resources, id) !== null;
}

const users = create.users(12);
const companies = create.companies(4);
const restaurants = create.restaurants(5);
const contacts = create.tmpContacts;
const companyRestaurant = {};

restaurants.forEach((restaurant, i) => {
    const pos = i % companies.length;
    const company = companies[pos];
    restaurant.company_id = company.id;
    if (!companyRestaurant[company.id]) {
        companyRestaurant[company.id] = [restaurant.id];
    } else {
        companyRestaurant[company.id].push(restaurant.id);
    }
});

app.get('/', function (req, res) {
    res.send({ message: 'Hello World' });
});

app.get('/users', function (req, res) {
    res.send(users);
});

app.get('/users/:id', function (req, res) {
    const user = users.filter(user => user.id === req.params.id);
    if (!user.length) {
        return res.status(404).send({ error: 404, message: 'User not found' });
    }
    res.send(user);
});

app.post('/users', function (req, res) {
    const user = create.user(req.body);
    users.push(user);
    res.send(user);
});

app.put('/users/:id', function (req, res) {
    const user = users.filter(user => user.id === req.params.id);
    if (!user.length) {
        return res.status(404).send({ error: 404, message: 'User not found' });
    }
    user[0] = Object.assign(user[0], req.body);
    res.send(user[0]);
});

app.get('/restaurants', function (req, res) {
    res.send(restaurants);
});

app.post('/restaurants', function (req, res) {
    const restaurant = create.restaurant(req.body);
    res.send(restaurant);
});

app.get('/companies', function (req, res) {
    res.send(companies);
});

app.post('/companies', function (req, res) {
    const company = create.company(req.body);
    res.send(company);
});

app.get('/companies/:id', function (req, res) {
    const company = getById(companies, req.params.id);
    if (!company) {
        return res.status(404).send({ error: 404, message: 'Company not found' });
    }
    res.send(company);
});

app.put('/companies/:id', function (req, res) {
    const company = companies.filter(c => c.id === req.params.id);
    if (!company.length) {
        return res.status(404).send({ error: 404, message: 'Company not found' });
    }
    company[0] = Object.assign(company[0], req.body);
    res.send(company[0]);
});

app.get('/companies/:id/restaurants', function (req, res) {
    const company = getById(companies, req.params.id);
    if (!company) {
        return res.status(404).send({ error: 404, message: 'Company not found' });
    }
    const rest = restaurants.filter(restaurant => companyRestaurant[company.id].includes(restaurant.id));
    res.send(rest);
});


app.listen(9060)
