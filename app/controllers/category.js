let Category = require('../models/category');

exports.new = function(req, res) {
    res.render('category_admin', {
        title: 'shiningdan 后台分类录入页',
        category: {},
    });
}

exports.save = function(req, res) {
    let _category = req.body.category;
    let category = new Category(_category);

    category.save(function(err, category) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/category/list');
    })
}


exports.list = function(req, res) { 
    Category.fetch(function(err, categories) {
        if (err) {
            console.log(err);
        }
        res.render('categorylist', {
            title: 'ShiningDan 分类列表页',
            categories: categories,
        })
    })
}