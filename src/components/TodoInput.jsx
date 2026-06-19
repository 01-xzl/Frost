import { forwardRef, useState } from 'react'
import PrioritySelector from './PrioritySelector'
import useLocale from '../hooks/useLocale'
import { CATEGORIES } from '../utils/defaults'

const TodoInput = forwardRef(function TodoInput({ onAdd }, ref) {
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('Other')
  const { t } = useLocale()

  const handleSubmit = (e) => {
    e.preventDefault()
    const input = e.target.elements.todoText
    onAdd(input.value, { priority, category })
    input.value = ''
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2 mb-2">
        <input
          ref={ref}
          name="todoText"
          type="text"
          placeholder={t('placeholder')}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20
                     text-white placeholder-white/50 outline-none
                     focus:border-white/40 focus:bg-white/15 transition-all text-sm"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-white/20 border border-white/25
                     hover:bg-white/30 active:scale-95 transition-all text-sm font-medium cursor-pointer"
        >
          ＋
        </button>
      </div>

      <div className="flex items-center gap-3 px-1">
        <PrioritySelector value={priority} onChange={setPriority} compact />
        <div className="flex gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-2 py-0.5 rounded-full text-[10px] transition-all cursor-pointer
                ${category === cat
                  ? 'bg-white/25 text-white'
                  : 'bg-white/8 text-white/50 hover:bg-white/15'
                }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>
      </div>
    </form>
  )
})

export default TodoInput
