
import { useState,useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

const toDoItems = [
  {
    key: uuidv4(),
    label: "Have fun",
  },
  {
    key: uuidv4(),
    label: "Spread Empathy",
  },
  {
    key: uuidv4(),
    label: "Generate Value",
  },
];

// helpful links:
// useState crash => https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
function App() {
  
  const [itemToAdd, setItemToAdd] = useState("");
  //arrow declaration => expensive computation ex: API calls
  const [items, setItems] = useState(window.localStorage.getItem('items') ? JSON.parse(window.localStorage.getItem('items')) : () => toDoItems);
  const [searchItem, setSearchItem] = useState([]);
  const [filterType, setFilterType] = useState("all");
  useEffect(() => {
    
    window.localStorage.setItem('items', JSON.stringify(items));
    console.log("Local storage updated: ", JSON.parse(window.localStorage.getItem('items')))

    }, [items])
  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };
  const handleSearchItem = (e) => {
    if(e.target.value == ""){
      setFilterType("all");
    }
    setFilterType("search");
    const newItems = [...items];
    let filter = e.target.value.toLowerCase()

    let searchItems = newItems.filter((e) => {
      let dataFilter = e.label.toLowerCase()
      return dataFilter.indexOf(filter) !== -1
    })
    
    setSearchItem(searchItems)
    // setItems((prevItems) => {
    //   prevItems.filter((e) => {
    //     let dataFilter = e.label.toLowerCase()
    //     return dataFilter.indexOf(lower) !== -1
    //   })
    // })
  }

 
  const handleAddItem = () => {
    // mutating !WRONG!
    // const oldItems = items;
    // oldItems.push({ label: itemToAdd, key: uuidv4() });
    // setItems(oldItems);

    // not mutating !CORRECT!

    setItems((prevItems) => [
      { label: itemToAdd, key: uuidv4() },
      ...prevItems,
    ]);
    setTimeout(() => console.log(items), 5000);
    
    setItemToAdd("");
  };
  const removeItem = ({key}) => {
    if(filterType === "search"){
      const newTodos = [...items];
      const index = items.findIndex((item) => item.key === key);
      newTodos.splice(index, 1);
      setSearchItem(newTodos);
    }
    const newTodos = [...items];
    const index = items.findIndex((item) => item.key === key);
    newTodos.splice(index, 1);
    setItems(newTodos);
    
  }
  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };
  const handleItemImportant = ({key}) => {
    if(filterType === "search"){
      setSearchItem((prevItems) =>
        prevItems.map((item) => {
          if (item.key === key) {
            return { ...item, important: !item.important };
          } else return item;
        })
      );
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, important: !item.important };
        } else return item;
      })
    );
  }
  
  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const filteredItems =
    !filterType || filterType === "search" ? searchItem: 
     filterType === "all"
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleSearchItem}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredItems.length > 0 &&
          filteredItems.map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item ${item.done ? " done" : ""} ${item.important ? "important" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                  onClick={() => handleItemImportant(item)}
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => removeItem(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
