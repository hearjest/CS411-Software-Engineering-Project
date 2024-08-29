/*import {React,useEffect} from 'react';
import {useContext} from 'react';
import {IdContext} from './context.js';

function LibraryPage({children}){
    const {userId,setUserId, library, setLibrary} = useContext(IdContext);


    useEffect(() => {
        async function fetchData() {
            const response = await fetch('http://localhost:4000/api/get-saved-books/'+userId);
            const data = await response.json();
            console.log("helpplsplslsplspsl: " +library)
            console.log(data[1].book)
            console.log("PLEASEPLEASEGIVEME")
            setLibrary(data[1].book);
        }
         fetchData();
    }, [library, setLibrary,userId]);

    return (
        <div className="libraryContainer">
            <div id="libraryHeader">
                <h2>Library</h2>
            </div>
            <div id="libraryContent">
                <p>{library?"thing":"help"}</p>
                {
                library.map((bookStuff) => (
                    <div className = "bookAndPlaylist">
                        <div>
                            <p>"piss"</p>
                        {bookStuff.volumeInfo.title}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LibraryPage;*/

import React, { useEffect, useContext } from 'react';
import { IdContext } from './context.js';
import './LibraryPage.css';

function LibraryPage() {
    const { userId, library, setLibrary } = useContext(IdContext);

    useEffect(() => {
        async function fetchData() {
            if (userId!==-1&&userId!==null) {
                try {
                    console.log("Fetching data for user ID:", userId);
                    const response = await fetch(`http://localhost:4000/api/get-saved-books/`+userId);
                    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                    //console.log("Response:" + response);
                    const data = await response.json();
                    //console.log("Fetched data:", data);
                    const bookArray = Array.isArray(data) ? data : [data];
                    setLibrary(bookArray);
                    
                } catch (error) {
                    console.error("Failed to fetch data:", error);
                }
            }
        }
        fetchData();
    }, [userId, setLibrary]);

    return (
        <div className="libraryContainer">
            <div id="libraryHeader">
                <h2>Library</h2>
            </div>
            <div id="libraryContent">
                {
                library && library.length > 0 ? (
                    
                    library.map((bookStuff, index) => (
                        <div key={index} className="bookAndPlaylist">
                            <div class="card">
                                <button onClick={async ()=>{
                                    let res=await fetch('http://localhost:4000/api/remove-book/'+userId+'/'+bookStuff.book.id, {
                                        method:'POST',
                                        headers:{
                                            'Content-Type':'application/json'
                                        }
                                    }); console.log(bookStuff.book.id);let updatedBooks=await res.json(); setLibrary(updatedBooks);
                                }}>dw</button>
                                <div>{bookStuff.book.volumeInfo.title}</div>
                                <image src={bookStuff.book.volumeInfo.imageLinks.thumbnail} alt="book cover"/>
                                <div>By {bookStuff.book.volumeInfo.authors}</div>
                                <div> {bookStuff.book.id}</div>
                                <div>{bookStuff.book.volumeInfo.description}</div>
                                <div class="playlistNames">
                                    {bookStuff.pl.map((playlist) => {
                                        const key = Object.keys(playlist)[0];
                                        return (
                                            <div key={key}>{key}<button onClick={async ()=>{
                                                let res=await fetch('http://localhost:4000/api/remove-book-from-playlist/'+userId+'/'+key+'/'+bookStuff.book.id,{
                                                    method:'POST',
                                                    headers:{
                                                        'Content-Type':'application/json'
                                                    },
                                                    body: JSON.stringify({book:bookStuff.book.id})
                                                }); const updatedList=await res.json(); setLibrary(updatedList); 
                                            }}>Remove</button></div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No books found</p>
                )}
            </div>
        </div>
    );
}

export default LibraryPage;
