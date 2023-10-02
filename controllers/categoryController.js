const Category = require('../models/categoryModel')      //import   //..  to go one step-out

//to pass data in the category model

exports.postCategory = async (req, res) => {
    let category = new Category({
        category_name: req.body.category_name

    })

    // check for unique category or check if category is exist in the database

    Category.findOne({
        category_name: category.category_name  //here it check if the category_name field of CategoryModel matches the value of category.category_name
    })                                       //this line creates the comparision of category model with the category name present in "category" which was obtained from user
        .then(async (categories) => {       //.then is used to perform the immediate next work after promise 

            if (categories) {
                return res.status(400).json({ error: 'category must be unique' })
            }
            else {
                c = await category.save()
                if (!c) {
                    return res.status(400).json({ error: 'something went wrong' })
                }
                res.send(category)

            }
        })

        .catch(err => console.log(err))
}

// to show all category
exports.allCategory = async (req, res) => {
    const category = await Category.find()
    if (!category) {
        return res.status(400).json({ error: 'something went wront' })    //key and value 
    }
    res.send(category)
}

//  to show single data
exports.categoryDetails = async (req, res) => {
    const category = await Category.findById(req.params.id)  //here params is used to get the data of specific parameter, in this case it is 'id'.
    if (!category) {
        return res.status(400).json({ error: 'somwthing went wrong' })
    }
    res.send(category)
}

//delete category
exports.deleteCategory = (req, res) => {
    Category.findByIdAndDelete(req.params.id)
        .then(category => {
            if (!category) {
                return res.status(403).json({ error: 'category not found' })

            }
            else {
                return res.status(200).json({ message: 'category deleted' })
            }
        })
        .catch(err => {
            return res.status(400).json({ error: err })
        })
}

//update category
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id,
            { category_name: req.body.category_name },
            { new: true }
        )
        if (!category) {
            return res.status(403).json({ error: 'category not found' })
        }
        res.send(category)
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}
