const mysql=require('mysql2');

const connection=mysql.createPool({
    host:process.env.HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DATABASE
}).promise();

async function login(id,username,password,name,lastname){
    //Check for user

    const res = await connection.query("SELECT * FROM users WHERE id = ?",id)
    if(res[0].length==0){
        await registerUser(id,username,password,name,lastname)
    }else{
        console.log("LOG 'EM IN TEX!!!!")
    }
}

async function registerUser(id,username,password,name,lastname){
    const res=await connection.query("INSERT INTO users VALUES (?,?,?,?,?)",[id,username,password,name,lastname],function(err,result,fields){
        if (err){
            throw new Error("how did you mess up this badly man")
        }
        });
    console.log(res)
    return res;
}

module.exports = {registerUser,login};