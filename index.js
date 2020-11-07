const uuid = require('uuid');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

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
            menu_groups: [],
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
            archived: false,
            ...data,
            created_at: datetime,
            updated_at: datetime,
        }
    },
    menu: (data = {}) => {
        const datetime = create.datetime();
        return {
            id: uuid.v4(),
            menu_group_id: uuid.v4(),
            registration_closes: datetime,
            price: create.number(4),
            headcount: create.number(2),
            date: "2020-10-28",
            meals: [],
            ...data,
            created_at: datetime,
            updated_at: datetime,
        }
    },
    meal: (data = {}) => {
        const datetime = create.datetime();
        return {
            id: uuid.v4(),
            name: 'Lasgna með hvítlausbrauði',
            description: '',
            ...data,
            created_at: datetime,
            updated_at: datetime,
        }
    },
}

const getById = (resources, id) => {
    const resource = resources.filter(resource => resource.id === id);
    if (!resource.length) {
        return null;
    }
    return resource[0];
}

const menuGroupExists = (id) => {
    for (let i = 0; i < restaurants.length; i++) {
        for (let j = 0; j < restaurants[i].menu_groups.length; j++) {
            if (restaurants[i].menu_groups[j].id === id) {
                return true;
            }
        }
    }
    return false;
}

const exists = (resources, id) => {
    return getById(resources, id) !== null;
}

const users = create.users(12);
const companies = create.companies(4);
const restaurants = create.restaurants(5);
const contacts = create.tmpContacts;
const companyRestaurant = {};
const menuGroups = {};
const menuMeals = {};


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
    const datetime = create.datetime();
    const user = users.filter(user => user.id === req.params.id);
    if (!user.length) {
        return res.status(404).send({ error: 404, message: 'User not found' });
    }
    user[0] = Object.assign(user[0], req.body, { updated_at: datetime });
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
    const datetime = create.datetime();
    const company = companies.filter(c => c.id === req.params.id);
    if (!company.length) {
        return res.status(404).send({ error: 404, message: 'Company not found' });
    }
    company[0] = Object.assign(company[0], req.body, { updated_at: datetime });
    res.send(company[0]);
});

app.post('/menu-groups', function (req, res) {
    const restaurant = getById(restaurants, req.query.restaurant_id);
    if (!restaurant) {
        return res.status(404).send({ error: 404, message: 'Restaurant not found' });
    }
    const menuGroup = create.menugroup(req.body);
    restaurant.menu_groups.push(menuGroup);
    if (!menuGroups[menuGroup.id]) {
        menuGroups[menuGroup.id] = [];
    }
    res.send(menuGroup);
});

app.put('/menu-groups/:id', function (req, res) {
    const datetime = create.datetime();
    const menuGroupId = req.params.id;

    let responseSent = false;
    restaurants.forEach(restaurant => {
        restaurant.menu_groups.forEach(group => {
            if (group.id === menuGroupId) {
                responseSent = true;
                group = Object.assign(group, req.body, { id: menuGroupId }, { updated_at: datetime });
                res.send(group);
            }
        });
    });
    if (!responseSent) {
        return res.status(404).send({ error: 404, message: 'Menu group not found' });
    }
});

app.get('/menus', function (req, res) {
    const menuGroupId = req.query.menu_group_id;
    if (menuGroupId) {
        if (!menuGroupExists(menuGroupId)) {
            return res.status(404).send({ error: 404, message: 'Menu group not found' });
        }
        const response = menuGroups[menuGroupId] ? menuGroups[menuGroupId] : [];
        return res.send(response);
    }

    let menus = [];
    for (const [key, subMenus] of Object.entries(menuGroups)) {
        menus = menus.concat(subMenus);
    }
    res.send(menus);
});

app.post('/menus', function (req, res) {
    const menuGroupId = req.query.menu_group_id;
    if (!menuGroups[menuGroupId]) {
        return res.status(404).send({ error: 404, message: 'Menu group not found' });
    }
    const menuGroup = create.menu({ menu_group_id: menuGroupId, ...req.body });
    menuGroups[menuGroupId].push(menuGroup);

    res.send(menuGroup);
});

app.put('/menus/:id', function (req, res) {
    const datetime = create.datetime();
    const menuId = req.params.id;

    let responseSent = false;
    for (const [key, menus] of Object.entries(menuGroups)) {
        menus.forEach(menu => {
            if (menu.id === menuId) {
                responseSent = true;
                menu = Object.assign(menu, req.body, { id: menuId }, { updated_at: datetime });
                res.send(menu);
            }
        });
    }
    if (!responseSent) {
        return res.status(404).send({ error: 404, message: 'Menu not found' });
    }
});

app.post('/meals', function (req, res) {
    const restaurantId = req.query.restaurant_id;
    const menuId = req.query.menu_id;

    let responseSent = false;
    for (const [key, group] of Object.entries(menuGroups)) {
        group.forEach(menu => {
           if (menu.id === menuId) {
               responseSent = true;
               const meal = create.meal(req.body);
               menu.meals.push(meal);
               res.send(meal);
           }
        });
    }
    if (!responseSent) {
        return res.status(404).send({ error: 404, message: 'Menu group not found' });
    }
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
