import { useState } from 'react'

// Create custom hooks here
export const useField = (type) => {
  const [value, setValue] = useState('')
  
  const onChange = (e) => {
    const value = e.target.value
    setValue(value)
  }

  if (type === 'reset') {
    return { type }
  } else {
    return {
      type, value, onChange,
    }
  }


}