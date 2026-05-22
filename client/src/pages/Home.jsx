import { useEffect, useState } from 'react'
import API from '../services/api.js'
import PinCard from '../components/PinCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Loader from '../components/Loader.jsx'
import { toast } from 'react-hot-toast'

const Home = () => {
  const [pins, setPins] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchPins = async (reset = false, targetPage = page) => {
    try {
      setLoading(true)
      const response = await API.get('/posts', {
        params: { search, category, page: targetPage, limit: 12 },
      })
      const newPins = response.data.posts || []
      setPins((prev) => (reset ? newPins : [...prev, ...newPins]))
      setHasMore(newPins.length === 12)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load pins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchPins(true, 1)
  }, [search, category])

  useEffect(() => {
    if (page === 1) return
    fetchPins()
  }, [page])

  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !loading) {
        setPage((prev) => prev + 1)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [hasMore, loading])

  const handleSearch = (value) => {
    setSearch(value)
    setCategory('')
  }

  const handleCategory = (value) => {
    setCategory(value)
    setSearch('')
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-20 px-4 pb-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-4xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-md">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Discover inspiration from stunning pins.</h1>
          <p className="mt-3 text-slate-400">Browse trending content, save your favorites, and share your own ideas with the community.</p>
          <SearchBar value={search} onSearch={handleSearch} onSelectCategory={handleCategory} />
        </div>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pins.map((pin) => (
            <PinCard key={pin._id} pin={pin} />
          ))}
        </section>

        {loading && <Loader />}
        {!loading && pins.length === 0 && <p className="text-center text-slate-400">No pins found. Try another search or category.</p>}
      </section>
    </main>
  )
}

export default Home
