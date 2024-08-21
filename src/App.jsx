import {useState} from 'react'

import './App.css'

function Logo() {
    return <h1>🏝️ Far away 🧳</h1>
}

function Form({onAddItems}) {

    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState(1)


    function handleSubmit(e) {
        e.preventDefault()


        if (!description) return

        const newItem = {description, quantity, packed: false, id: Date.now()}
        onAddItems(newItem)

        setDescription('')
        setQuantity(1)
    }

    return <form onSubmit={handleSubmit}>
        <h3>Что нужно для 😍 поездки?</h3>
        <select value={quantity} onChange={(e) => {
            setQuantity(+e.target.value)
        }}>
            {Array.from({length: 20},
                (_, i) => i + 1)
                .map(num => <option key={num} value={num}>{num}</option>)}

        </select>
        <input type='text'
               placeholder='Что берем?'
               value={description}
               onChange={(e) => setDescription(e.target.value)}/>
        <button>Добавить</button>
    </form>
}

function Item({item, onDeleteItem, onToggleItem}) {
    return <div>
        <li>
            <input type='checkbox' value={item.packed} onChange={() => onToggleItem(item.id)}/>
            < span style={item.packed ? {textDecoration: 'line-through'} : {}}>
                    {item.packed}
                {item.quantity} {item.description}
                </span>
            <button onClick={() => onDeleteItem(item.id)}>❌</button>
        </li>
    </div>
}

function PackingList({items, onDeleteItem, onToggleItem, onClearList}) {
    const [sortBy, setSortBy] = useState('input')

    let sortedItems;

    if (sortBy === 'input') sortedItems = items
    if (sortBy === 'description') sortedItems = items.slice().sort((a, b) => a.description.localeCompare(b.description))
    if (sortBy === 'packed') sortedItems = items.slice().sort((a, b) => Number(a.packed) - Number(b.packed))

    return <>
        <ul>
            {sortedItems.map(item => <Item
                item={item}
                key={item.id}
                onDeleteItem={onDeleteItem}
                onToggleItem={onToggleItem}
            />)}

        </ul>

        <div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value='input'>Сортировать по порядку</option>
                <option value='description'>Сортировать по описанию</option>
                <option value='packed'>Сортировать по статусу упакованно</option>
            </select>
            <button onClick={onClearList}>Очистить список
            </button>
        </div>
    </>
}

function Stats({items}) {

    if (!items.length) return <footer><em>
        Погнали собирать вещички 🚀
    </em></footer>

    const numItems = items.length
    const numPacked = items.filter(item => item.packed).length
    const percentage = Math.round(numPacked / numItems * 100)

    return <footer>
        <em>
            {percentage === 100 ? `У тебя все готово. Полетели ✈️` :
                `Нужно собрать ${numItems} вещей, и уже собранно ${numPacked} (${percentage}%)`
            }
        </em>
    </footer>

}

function App() {

    function handleAddItems(item) {
        setItems((items) => [...items, item])
    }

    function handleDeleteItem(id) {
        setItems((items) => items.filter(item => item.id !== id))
    }

    function handleToggleItem(id) {
        setItems((items) => items.map(item => item.id === id ?
            {...item, packed: !item.packed} : item))
    }

    function handleClearList() {
        const confirmed = window.confirm('Очистить весь список?')
        if (confirmed) setItems([])
    }

    const [items, setItems] = useState([])

    return (
        <>
            <Logo/>
            <Form onAddItems={handleAddItems}/>
            <PackingList items={items}
                         onDeleteItem={handleDeleteItem}
                         onToggleItem={handleToggleItem}
                         onClearList={handleClearList}
            />
            <Stats items={items}/>
        </>)
}

export default App
