import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import API from '../services/api.js'
import Loader from '../components/Loader.jsx'
import PinCard from '../components/PinCard.jsx'
import { toast } from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(user)
  const [pins, setPins] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', image: user?.image || '' })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const response = await API.get(`/users/${user._id}`)
        setProfile(response.data)
        const posts = await API.get('/posts', { params: { user: user._id, limit: 12 } })
        setPins(posts.data.posts)
      } catch (error) {
        toast.error('Unable to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (user) loadProfile()
  }, [user])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const updated = await updateUser(user._id, form)
      setProfile((prev) => ({ ...prev, ...updated }))
      setEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Profile update failed')
    } finally {
      setLoading(false)
    }
  }

  if (!profile) return <Loader />

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-20 px-4 pb-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-4xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <img src={profile.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'} alt={profile.name} className="h-24 w-24 rounded-full object-cover border border-slate-700" />
              <div>
                <h1 className="text-3xl font-semibold">{profile.name}</h1>
                <p className="mt-1 text-slate-400">{profile.bio || 'Curating beautiful inspiration every day.'}</p>
                <p className="mt-2 text-sm text-slate-500">{profile.email}</p>
              </div>
            </div>
            <button
              onClick={() => setEditing((prev) => !prev)}
              className="rounded-full border border-slate-700 bg-slate-800 px-5 py-3 text-sm text-white transition hover:bg-slate-700"
            >
              {editing ? 'Cancel edit' : 'Edit profile'}
            </button>
          </div>

          {editing && (
            <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-300">Name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-300">Avatar URL</span>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                />
              </label>
              <label className="md:col-span-2 block">
                <span className="text-sm text-slate-300">Bio</span>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows="4"
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 rounded-3xl bg-slate-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-600 disabled:opacity-60"
              >
                Save profile
              </button>
            </form>
          )}
        </div>

        <div className="rounded-4xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
          <h2 className="text-2xl font-semibold">Your Pins</h2>
          <p className="mt-2 text-slate-500">A collection of posts you created.</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <Loader />
            ) : pins.length ? (
              pins.map((pin) => <PinCard key={pin._id} pin={pin} />)
            ) : (
              <p className="text-slate-400">No posts yet. Create inspiration to get started.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Profile
