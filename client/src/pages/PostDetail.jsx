import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Loader from '../components/Loader.jsx'
import { toast } from 'react-hot-toast'

const PostDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await API.get(`/posts/${id}`)
      setPost(response.data)
    } catch (error) {
      toast.error('Unable to load pin')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [id])

  const handleLike = async () => {
    if (!user) return toast.error('Sign in to like pins')
    try {
      const response = await API.patch(`/posts/${id}/like`)
      setPost(response.data)
    } catch (error) {
      toast.error('Unable to update like')
    }
  }

  const handleSave = async () => {
    if (!user) return toast.error('Sign in to save pins')
    try {
      const response = await API.patch(`/posts/${id}/save`)
      setPost(response.data)
      toast.success(response.data.savedBy.some((id) => id.toString() === user._id) ? 'Saved to your board' : 'Removed from saved')
    } catch (error) {
      toast.error('Unable to update save')
    }
  }

  const handleComment = async (event) => {
    event.preventDefault()
    if (!commentText.trim()) return
    try {
      const response = await API.post(`/posts/${id}/comment`, { text: commentText })
      setPost(response.data)
      setCommentText('')
    } catch (error) {
      toast.error('Unable to add comment')
    }
  }

  if (loading || !post) return <Loader />

  const isSaved = user ? post.savedBy.some((id) => id.toString() === user._id) : false

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-20 px-4 pb-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="overflow-hidden rounded-4xl border border-slate-700/60 bg-slate-900/80 shadow-2xl shadow-slate-950/20">
          <img src={post.image.url} alt={post.title} className="w-full object-cover" />
          <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-semibold">{post.title}</h1>
                <p className="mt-2 text-slate-400">{post.about}</p>
                <span className="mt-3 inline-flex rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">{post.category}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={handleLike} className="rounded-full bg-slate-700 px-5 py-3 text-sm text-white transition hover:bg-slate-600">
                  {post.likes.length} Likes
                </button>
                <button onClick={handleSave} className="rounded-full border border-slate-700 px-5 py-3 text-sm text-slate-100 transition hover:border-slate-500">
                  {isSaved ? 'Unsave' : 'Save'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl bg-slate-950/70 p-4 sm:p-5">
              <img src={post.postedBy.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'} alt={post.postedBy.name} className="h-16 w-16 rounded-full object-cover" />
              <div>
                <p className="text-sm text-slate-400">Posted by</p>
                <p className="text-lg font-medium">{post.postedBy.name}</p>
              </div>
            </div>

            <div className="rounded-4xl border border-slate-700/50 bg-slate-950/80 p-6">
              <h2 className="text-2xl font-semibold">Comments</h2>
              <div className="mt-6 space-y-4">
                {post.comments.length ? (
                  post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3 rounded-3xl border border-slate-700/50 bg-slate-900 p-4">
                      <img src={comment.postedBy.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'} alt={comment.postedBy.name} className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium text-slate-100">{comment.postedBy.name}</p>
                        <p className="mt-1 text-sm text-slate-400">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No comments yet. Be the first to share your thoughts.</p>
                )}
              </div>

              {user ? (
                <form onSubmit={handleComment} className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="min-h-14 flex-1 rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                  />
                  <button className="rounded-3xl bg-slate-700 px-5 py-3 text-sm text-white transition hover:bg-slate-600" type="submit">
                    Post comment
                  </button>
                </form>
              ) : (
                <p className="mt-6 text-sm text-slate-500">Login to add a comment or save this pin.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PostDetail
