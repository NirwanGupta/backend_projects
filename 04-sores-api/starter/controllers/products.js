const Product = require(`../models/product`);

const getAllProductsStatic = async(req, res) => {
    const search = 'e';
    // const products = await Product.find({
    //     featured: true,
    //     name: {$regex: search, $options: 'i'},          //  name having 'e' in them will be displayed
    // });

    const products = await Product.find({})    //  sort name in alphabetical order     if '-name' sort in reverse alphabetical order
        .sort('name')
        .select('name price')
        .limit(10)      //      limits the data displayed on the page to 10
        .skip(5);       //      skips the first 5 data values and starts with the 6th entry rightaway

    //  const products = await Product.find({price: {$gt: 30}}).sort(`price`);      to get all the products whose price is greater than 30 in sorted order

    res.status(200).json({products, nbHits: products.length});
}

const getAllProducts = async(req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    const queryObject = {};

    if(featured) {
        queryObject.featured = (featured ==='true' ? true : false);
    }
    if(company) {
        queryObject.company = company;
    }
    if(name) {
        // queryObject.name = name;    //  complete name matches
        queryObject.name = {$regex: name, $options: 'i'};
    }

    //  numericFilters
    if(numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|>|<=|>=|=)\b/g;     //  syntax for regular exspression
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
        // console.log(filters);       //  price-$gt-30,rating-$gt-3

        const options = ['price', 'raating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if(options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
            }
        });
    }

    console.log(queryObject);
    //  we cannot sort it right here because we are still awaiting for .find() to complete 
    // const products = await Product.find(queryObject);
    //  so we update the code as followes

    let result = Product.find(queryObject);
    //  sort
    if(sort) {
        //  if user want to pass more than one argument in the sort, he does that using a ',', however the correct syntax for the sort          functionality to work is .sort(`name price`), i.e. a whitespace is necessary
        const sortList = sort.split(`,`).join(` `);
        result = result.sort(sortList);
        console.log(sort);
    }
    else {
        //  if the user did not enter the sort, then we want the data to be displayed in order of sorted time in which they were created i.e. 'createAt'
        result = result.sort(`createdAt`);
        //  but this will not work in our current data since all of the data is entered dynamically at the same time
    }

    //  select
    if(fields) {
        const fieldsList = fields.split(`,`).join(` `);
        result = result.select(fieldsList);
    }

    //  page, limit, skip
    const page = Number(req.query.page);
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1) * limit;

    result = result.skip(skip).limit(limit);
    //  23 responses
    //  7 7 7 2

    //  select property is used to make only the selected property to be displayed
    const products = await result;

    res.status(200).json({products, nbHits: products.length});
}

module.exports = {
    getAllProductsStatic,
    getAllProducts,
}