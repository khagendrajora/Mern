const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE)
//     useNewUrlParser:true,          //to check url 
//     useUnifiedTopologu:true         //to check unified data    //we can also skip  line 4 and 5
// })
.then(()=> console.log('Database connected'))
.catch(err => console.log(err))