import { useRef, useState } from 'react';
import './App.css';

const post = (title, body) => {
  return fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
      title,
      body,
      userId: crypto.randomUUID(),
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then(response => response.json());
};

function handleErrors(title, body, setError) {
  const errors = {};

  if (!title) {
    errors.title = 'Add a title';
  }

  if (!body) {
    errors.body = 'Add a body';
  }

  setError(errors);
  return Boolean(Object.keys(errors).length);
}

function App() {
  const [data, setData] = useState(0);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState({});

  const formRef = useRef(null);

  const handleSubmit = async event => {
    // prevent default behavior
    event.preventDefault();
    // reset state
    setData(0);

    const [title, body] = [
      event.target.elements.title.value,
      event.target.elements.body.value,
    ];

    const hasErrors = handleErrors(title, body, setError);
    if (hasErrors) return;

    // start the submit
    setPosting(true);

    const { id } = await post(title, body);

    // just clear form (we're not handling errors)
    formRef.current.reset();

    // finish the submit and update state
    setPosting(false);
    setData(id);
  };

  return (
    <div className='App App-header'>
      <div>{data === 0 ? 'Not Submitted' : `ID is ${data}`}</div>

      <form ref={formRef} className='form' onSubmit={handleSubmit}>
        <input name='title' id='title' type='text' placeholder='title' />
        {error.title && <label for='title'>{error.title}</label>}

        <input name='body' id='body' type='text' placeholder='body' />
        {error.body && <label for='body'>{error.body}</label>}

        <button type='submit' disabled={posting}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
