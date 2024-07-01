const userModel = require('../models/user');
const { isEmpty } = require('lodash');

const createUser = (req, res) => {
    let response = {
        status: "error",
        code: "200",
        message: "",
        data: [],
        error: null
    }
    const user_detail = {
        name: 12344,
        email: "mhaveer95@yopmail.com",
        password: "testpass123",

    }
    userModel.create(user_detail).then(result => {
        console.log(result, 'result');
        response.status = 'success';
        response.data = result;
        return res.json(response);

    }).catch(err => {
        response.message = "User not created";
        response.error = err['errors'];
        return res.json(response);
    });

}

const login = (req, res) => {
    let response = {
        status: "error",
        code: "200",
        message: "",
        data: [],
        error: null
    }
    console.log(req.body);
    if (isEmpty(req.body.email) || isEmpty(req.body.password)) {
        response.message = 'Invalid Inputs';
        return res.json(response);
    }

    userModel.findOne({ email: req.body.email, password: req.body.password }).then(result => {
        if (isEmpty(result)) {
            response.message = 'user not found';
            return res.json(response);
        }

        response.status = 'success';
        response.data = result;
        return res.json(response);

    }).catch(err => {
        response.message = "User not found";
        response.error = err['errors'];
        return res.json(response);
    });

}

const addProudct = (req, res) => {
    let list = require('../public/productlist.json')
    let response = {
        status: "error",
        code: "200",
        message: "",
        data: [],
        error: null
    }
    const products_detail = {
        name: "Hp laptop",
        description: "Hp pavilion",
        price: "67000",
    }

}

module.exports = { createUser,login, addProudct };