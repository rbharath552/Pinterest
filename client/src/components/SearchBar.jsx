import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'

const categories = ['Art', 'Travel', 'Food', 'Style', 'Architecture', 'Nature', 'Technology']

const SearchBar = ({ value, onSearch, onSelectCategory }) => {
  const [query, setQuery] = useState(value || '')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch(query)
  }

  return (
    <section className="space-y-4">
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-3 rounded-3xl border border-slate-700 bg-slate-900/80 p-4 shadow-xl shadow-slate-950/10">
        <FiSearch className="h-5 w-5 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for pins, categories or people"
          className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
        />
        <button type="submit" className="rounded-2xl bg-slate-700 px-4 py-2 text-sm text-white transition hover:bg-slate-600">
          Search
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  )
}

export default SearchBar
