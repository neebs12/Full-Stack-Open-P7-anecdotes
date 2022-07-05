import { useState } from 'react'

import { 
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'

import { useField } from './hooks/index'

// ---> navigation
const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={padding} to='/'>anecdotes</Link>
      <Link style={padding} to='/create'>create new</Link>
      <Link style={padding} to='/about'>about</Link>
    </div>
  )
}

// ---> a component to be routed
const AnecdoteList = ({ anecdotes }) => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote => {
          return (
            <li key={anecdote.id} >
              <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ---> a component to be routed
const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

// ---> footer
const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

// ---> a component to be routed
const CreateNew = (props) => {
  // const [content, setContent] = useState('')
  // const [author, setAuthor] = useState('')
  // const [info, setInfo] = useState('')
  
  const content = useField('content')
  const author = useField('author')
  const info = useField('info')

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          {/* <input name='content' value={content} onChange={(e) => setContent(e.target.value)} /> */}
          <input {...content}/>
        </div>
        <div>
          author
          {/* <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} /> */}
          <input {...author}/>
        </div>
        <div>
          url for more info
          {/* <input name='info' value={info} onChange={(e)=> setInfo(e.target.value)} /> */}
          <input {...info}/>
        </div>
        <button>create</button>
      </form>
    </div>
  )

}

const Anecdote = ({anecdote}) => {
  // Shape of the object received
  // {
  //   content: 'If it hurts, do it more often',
  //   author: 'Jez Humble',
  //   info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
  //   votes: 0,
  //   id: 1
  // }

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

// ---> APP Component
const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')
  const [messageTimeout, setmessageTimeout] = useState(null)
  const navigate =  useNavigate()

  const match = useMatch('/anecdotes/:id')
  const anecdote = match ? 
    anecdotes.find(a => a.id === +match.params.id) : null

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))

    // add notification here too!
    const msg = `a new anecdote: ${anecdote.content}, is created!`
    setNotification(msg)

    const timeoutId = setTimeout(() => {
      setNotification(null) // <--- reset notif
      setmessageTimeout(null) // <--- timeout cleared anyway
    }, 5000)

    if (messageTimeout) clearTimeout(messageTimeout)
    // <--- clears previous timeout

    setmessageTimeout(timeoutId)
    // <--- sets a new one

    navigate('/')
    // <--- redir
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      {notification || null}
      <Routes>
        <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />}/>
        <Route path='/create' element={<CreateNew addNew={addNew} />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/anecdotes/:id' element={<Anecdote anecdote={anecdote}/>}/>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
