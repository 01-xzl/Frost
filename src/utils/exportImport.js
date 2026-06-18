export function downloadJSON(data, filename = 'todos.json') {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function parseImportedFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        // Accept both versioned object and plain array
        const todos = Array.isArray(data) ? data : (data.todos ?? [])
        if (!Array.isArray(todos)) {
          reject(new Error('Invalid format: expected an array of todos'))
          return
        }
        resolve(todos)
      } catch {
        reject(new Error('Could not parse JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
