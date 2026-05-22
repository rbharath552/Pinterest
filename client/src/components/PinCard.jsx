import { Link } from 'react-router-dom'
import { FiHeart, FiBookmark } from 'react-icons/fi'

const PinCard = ({ pin }) => {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-950/80 shadow-xl shadow-slate-900/10 transition hover:-translate-y-1 hover:shadow-2xl">
      <Link to={`/pin/${pin._id}`} className="block">
        <img
          src={pin.image?.url}
          alt={pin.title}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 text-slate-100">
          <h3 className="text-lg font-semibold line-clamp-2">{pin.title}</h3>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-flex items-center gap-1 text-sm">
              <FiHeart /> {pin.likes?.length || 0}
            </span>
            <span className="inline-flex items-center gap-1 text-sm">
              <FiBookmark /> {pin.savedBy?.length || 0}
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-400 line-clamp-3">{pin.about}</p>
        <div className="flex items-center gap-3 pt-3">
          <img src={pin.postedBy?.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'} alt={pin.postedBy?.name} className="h-10 w-10 rounded-full object-cover" />
          <div>
            <p className="text-sm font-medium text-slate-100">{pin.postedBy?.name}</p>
            <p className="text-xs text-slate-500">{pin.category}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PinCard
