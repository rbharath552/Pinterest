import { useState } from 'react'
import API from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { toast } from 'react-hot-toast'

const CreatePin = () => {
  const { user } = useAuth()
  const [form, setForm] = useState({ title: '', about: '', destination: '', category: '' })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!imageFile) return toast.error('Please upload an image for this pin')

    const data = new FormData()
    data.append('title', form.title)
    data.append('about', form.about)
    data.append('destination', form.destination)
    data.append('category', form.category)
    data.append('image', imageFile)

    try {
      setLoading(true)
      await API.post('/posts', data)
      toast.success('Pin uploaded successfully')
      setForm({ title: '', about: '', destination: '', category: '' })
      setImageFile(null)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-20 px-4 pb-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-4xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold">Create a new pin</h1>
        <p className="mt-2 text-slate-400">Share your latest ideas and images with the community.</p>

        {!user && <p className="mt-4 text-yellow-300">Login before uploading content.</p>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm text-slate-300">Title</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">About</span>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows="4"
              required
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm text-slate-300">Category</span>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Destination URL</span>
              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-slate-300">Upload image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="mt-2 w-full text-sm text-slate-300"
            />
          </label>

          <button
            type="submit"
            disabled={!user || loading}
            className="rounded-3xl bg-slate-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Uploading...' : 'Upload pin'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default CreatePin
