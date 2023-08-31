const express = require("express");
app = express();
const mysql = require('mysql');
//const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const axios = require('axios');
const crypto = require('crypto');



const PORT =  process.env.PORT || 2708
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form bodies

app.use(express.static("public"));
//app.use(express.static(path.join(__dirname, 'public')));

app.get("/",(req,res)=>{
    res.sendFile('./public/index.html');
})

// Create MariaDB connection
const connection = mysql.createConnection({
    host: '127.0.0.1.',
    user: 'root',
    password: '1234',
    database: 'skillaby_users'
  });
  
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to MariaDB:', err);
    } else {
      console.log('Connected to MariaDB');
    }
  });

app.post("/api/createUser",async (req,res)=>{
    console.log("API request to ROOT/api/sign_up");
    console.log("creating user")
    //const { email, password } = req.body

      // TalentLMS API credentials
const apiKey = 'm6pbIGSrJW67vENP4F5LEi3qJlZ4Bj';
const domain = "https://sksdd.talentlms.com"; // Use localhost and your port
    
    const proprietary_ID = crypto.randomUUID();

    

    var talentLMS_ID = null
    const { email, login, first_name, last_name, password } = req.body;
  

  const user = {
        first_name, last_name, email, login, password
  }

    
        const response = await axios.post(
          `https://testhappy.talentlms.com/api/v1/usersignup`,
          user,
          {
            headers: {
              Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
            },
          }
        );
      
      const responseData = await response;
       
      if (responseData.status == 200) {
        
        talentLMS_ID = responseData.data.id

         // Save user to MariaDB
 const query = "INSERT INTO users (email, password, talentLMS_ID, proprietary_ID, first_name, last_name, login) VALUES (?, ?, ?, ?, ?, ?, ?)";
 connection.query(query, [email, password, talentLMS_ID, proprietary_ID,first_name, last_name, login], (err, result) => {
   if (err) {
     console.error('Error creating user:', err);
     res.status(500).send('Kasutajakonto loomisel esines viga!');
   } else {
     console.log('User created:', result);
     res.sendFile(__dirname + '/public/success.html');
   }
 });
      } else {
        //res.send("User creation failed")
      }
 

})

app.get("/success",(req,res)=>{
  res.sendFile(__dirname + '/public/success.html');
})

app.listen(PORT,()=>{
    console.log(`App name [DEVELOPMENT] running @ http://localhost:${PORT}/`)
})