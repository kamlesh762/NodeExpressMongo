const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const req = require("express/lib/request");
const res = require("express/lib/response");
const bcrypt = require("bcryptjs");


require("./db/conn");
const Register = require('./models/registers');
const async = require("hbs/lib/async");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public" );
const template_path = path.join(__dirname, "../templates/views" );
const partials_path = path.join(__dirname, "../templates/partials" );

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("register")
});

app.get('/register', (req, res) => {
    res.render('register');
});

//create a new  user in our database
app.post('/register', async (req, res) => {
    try {
        
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword) {

          const registerEmployee = new Register({

                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    gender: req.body.gender,
                    phone: req.body.phone,
                    age: req.body.age,
                    password: req.body.password,
                    confirmpassword: req.body.confirmpassword

          })
          
          console.log("the success part" + registerEmployee);

          const token = await registerEmployee.generateAuthToken();
          console.log("the token part" + token);

          const registered = await registerEmployee.save();
          res.status(201).render('register');

        } else {
            res.send('Password are not matching');
        }


    } catch (error) {
        res.status(400).send(error);
    }
});

// login check

app.post('/login', async(req, res) => {
    try {
         
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});

        const isMatch = bcrypt.compare(password, useremail.password);
        
        if(isMatch){
            res.status(201).render('register');
        }else{
            res.send('Invalid Password Details');
        }
        

    } catch (error) {
        res.status(400).send('Invalid Login Details')
    }
});

const securePassword = async (password) => {

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const passwordmatch = await bcrypt.compare(password, passwordHash);
    console.log(passwordmatch);

}

securePassword('123456');

// const jwt = require("jsonwebtoken");

// const createToken = async() => {
//     const token = await jwt.sign({_id:"629f3ca47dd7163e9fb2d138"}, "mynameiskamleshyadavnodejsdeveloperandreactjsdeveloper", {
//         expiresIn:"2 seconds"
//     });
//     console.log(token);
    
//     const userVer = await jwt.verify(token, "mynameiskamleshyadavnodejsdeveloperandreactjsdeveloper");
//     console.log(userVer);

// }

// createToken();

app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
})