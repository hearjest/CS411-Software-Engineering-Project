const mysql=require('mysql2');

const connection=mysql.createPool({
    host:process.env.HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DATABASE
}).promise();

async function login(id,username,password,name,lastname){
    const res = await connection.query("SELECT * FROM users WHERE id = ?",id)
    if(res[0].length==0){
        try{
            const res2= await registerUser(id,username,password,name,lastname)
            res2.status(200).json(result);
            return id;
          }catch{
            res2.status(400).json({err: err.message})
          }
    }else{
        console.log("LOG 'EM IN TEX!!!!")
        return id;
    }
}

async function registerUser(id,username,password,name,lastname){
    const res=await connection.query("INSERT INTO users VALUES (?,?,?,?,?,?)",[id,username,password,name,lastname,JSON.stringify([])],function(err,result,fields){
        if (err){
            throw new Error("how did you mess up this badly man")
        }
        });
    //console.log(res)
    return res;
}

async function getUser(id){
    const res=await connection.query("SELECT * FROM users WHERE id = ?",id)
    return res;
}

async function getSavedBooks(id){
    //const res=await connection.query("SELECT * FROM users (?) WHERE id = ?",["booksAndPlaylists",id])
    console.log("id=" + id)
    const [rows]=await connection.query("SELECT * FROM users WHERE id = ?",[id])
    //console.log("res1=", res[0].id)
    if (rows.length > 0) {
        //console.log(rows[0][0].booksAndPlaylists);
        console.log("got saved books")
        //console.log(rows[0].booksAndPlaylists)
        return rows[0].booksAndPlaylists;
      } else {
        return null;
      }
}

async function removeBookFromPlaylist(userId,playlist,bookId){
    const res1 = await getSavedBooks(userId);
    const res2=res1
    //console.log("res2=",res2 )
    console.log("testing 1 2 3 ")
   res2.forEach((booksAndPlaylists,index) => {
        //console.log("from removeBook " +JSON.stringify(booksAndPlaylists))
        if (booksAndPlaylists.book.id==bookId){
            const pl=booksAndPlaylists.pl;
            pl.forEach((song,index) => {
                if (song[playlist]){
                    console.log("Deleting song: "+playlist+" from book: "+bookId)
                    console.log(pl[index][playlist])
                    delete pl[index][playlist];
                    booksAndPlaylists.pl=booksAndPlaylists.pl.filter(songObject=>Object.keys(songObject).length > 0)
                }
            })
        }
})

/*console.log("res length" + res2[6])
    for(let i=0;i<res2.length;i++){
        if(res2[i].book.id==bookId){
            const pl=res2[i].pl;
            if(pl[playlist]){
                delete pl[playlist];
                res2.splice(i,1);
                i--;
                console.log("res2",JSON.stringify(res2))
            }
        }
    }*/


//console.log("res2=", res2)
    /*for (let booksAndPlaylists in res1[0]){
        console.log("from removeBook " +booksAndPlaylists)
        if (booksAndPlaylists.book.id==bookId){
            console.log("Deleting book with song: "+playlist+" from book: "+bookId)
            delete booksAndPlaylists.pl[playlist];
            break;
        }
    }*/
    console.log("Deleted song: "+playlist+" from book: "+id)
    const resUpdate2=await connection.query("UPDATE users SET booksAndPlaylists = ? WHERE id = ?",[JSON.stringify(res2),id])
    //console.log("RES2 " + JSON.stringify(res2))
    return res2;
}

async function removeBook(id,bookId){
    const res1 = await getSavedBooks(id);
    const res2=res1
    console.log("HELPPPP1111111")
    res2.forEach((booksAndPlaylists,index) => {
        if (booksAndPlaylists.book.id==bookId){
            res2.splice(index,1);
        }
    });
    console.log(JSON.stringify(res2))
    const resUpdate=await connection.query("UPDATE users SET booksAndPlaylists = ? WHERE id = ?",[JSON.stringify(res2),id])
    return res2;
}

/*{} show up with remove buttons. Why does enchanted not get removed? */
async function saveBook(id,playlist){
    const res1 = await getSavedBooks(id);
    const booksAndPlaylists=res1
    //console.log("books = " + booksAndPlaylists);
    //console.log(playlist)
    //playlist.pl.replace("/","-")
    booksAndPlaylists.push(playlist);
    const resUpdate=await connection.query("UPDATE users SET booksAndPlaylists = ? WHERE id = ?",[JSON.stringify(booksAndPlaylists),id])
    //console.log("resUpdate=", resUpdate)
    //const res=await connection.query("INSERT INTO users (?) VALUES (?) WHERE id = ?",["booksAndPlaylists",booksAndPlaylists,id])
    return booksAndPlaylists
    //return resUpdate;
}





module.exports = {registerUser,login,getSavedBooks,saveBook,getUser,removeBookFromPlaylist,removeBook};