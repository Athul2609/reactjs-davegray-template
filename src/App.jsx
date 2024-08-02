import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import { useState, useEffect } from 'react';

function App() {
  const API_URL = 'http://localhost:3500/items'

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('')
  const [search, setSearch] = useState('')
  const [fetchError,setFetchError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    
    const fetchData = async () => {
      try
      {      
        const response = await fetch(API_URL);
        if(!response.ok) throw new Error("Couldn't fetch data");
        const listItems = await response.json();
        setItems(listItems)
        setIsLoaded(true)
      }
      catch (err)
      {
        setFetchError(err.message)
        setIsLoaded(true)
      }
    }

    setTimeout(fetchData,2000)
  }, [])

  const addItem = (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);
  }

  const handleCheck = (id) => {
    const listItems = items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(listItems);
  }

  const handleDelete = (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewItem('');
  }

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
      <main>
        {!isLoaded && <p>Loading...</p>}
        {isLoaded && (() => {
          // Outer IIFE
          const errorContent = (() => {
            // Inner IIFE for handling fetchError
            if (fetchError) {
              return <p>Error Fetching your data</p>;
            }
            return null; // Return null if there's no error
          })();

          const content = (() => {
            // Inner IIFE for handling successful fetch
            if (!fetchError) {
              return (
                <Content
                  items={items.filter(item => item.item.toLowerCase().includes(search.toLowerCase()))}
                  handleCheck={handleCheck}
                  handleDelete={handleDelete}
                />
              );
            }
            return null; // Return null if there's an error
          })();

          return (
            <>
              {errorContent}
              {content}
            </>
          );
        })()}

      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;
