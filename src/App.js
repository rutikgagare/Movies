import React, { useEffect, useState } from 'react';
import AddMovie from './components/AddMovie';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState(null);

  // using promises

  // function fetchMovies(){
  //   setisLoading(true);
  //
  //   fetch('https://swapi.dev/api/films/').then((response)=>{
  //     return response.json();  // convert to javascript object
  //   }).then((data)=>{
  //     // instead af returning array with all the properties we will change array with object of required properties
  //     const transformedData = data.results.map((movieData)=>{
  //       return {
  //         id:movieData.episode_id,
  //         title:movieData.title,
  //         releaseDate:movieData.release_date,
  //         openingText:movieData.opening_crawl
  //       }
  //     })
  //     setMovies(transformedData);
  //     setisLoading(false);
  //   })
  // }

  useEffect(()=>{
    fetchMoviesHandler();
  },[]);

  async function addMovieHandler(movie){
    await fetch('https://react-http-7b244-default-rtdb.firebaseio.com/movies.json',{
      method:'POST',
      body: JSON.stringify(movie), // converting object to json
      headers:{
        'Content-Type':'application/json'
      }
    });
    fetchMoviesHandler();
  }

  // using async await
  // async function fetchMoviesHandler() {

  //   setisLoading(true);
  //   setError(null);

  //   try {
  //     const response = await fetch('https://swapi.py4e.com/api/films');

  //     if (!response.ok) {
  //       throw new Error("Something went wrong");
  //     }

  //     const data = await response.json();

  //     const transformedData = data.results.map((movieData) => {
  //       return {
  //         id: movieData.episode_id,
  //         title: movieData.title,
  //         releaseDate: movieData.release_date,
  //         openingText: movieData.opening_crawl
  //       }
  //     });
  //     setMovies(transformedData);
  //     setisLoading(false)

  //   } catch (error) {
  //     setError(error.message);
  //   }
  //   setisLoading(false);
  // }

  async function fetchMoviesHandler() {

    setisLoading(true);
    setError(null);

    try {
      const response = await fetch('https://react-http-7b244-default-rtdb.firebaseio.com/movies.json');

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      const loadedMovies = [];

      for(const key in data){
        loadedMovies.push({
          id:key,
          title:data[key].title,
          releaseDate:data[key].releaseDate,
          openingText:data[key].openingText,
        })
      }

      setMovies(loadedMovies);
      setisLoading(false)

    } catch (error) {
      setError(error.message);
    }
    setisLoading(false);
  }

  let content = <p>Found No Movies</p>;

  if(movies.length > 0) {
    content = <MoviesList movies={movies}/>;
  }

  if(error) {
    content = {error};
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}></AddMovie>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
       {content}
      </section>
    </React.Fragment>
  );
}

export default App;
