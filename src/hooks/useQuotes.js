import { useState, useCallback, useEffect } from 'react'

const QUOTES = [
  // English
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Do the hard jobs first. The easy jobs will take care of themselves.', author: 'Dale Carnegie' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'The key is not to prioritize what\'s on your schedule, but to schedule your priorities.', author: 'Stephen Covey' },
  { text: 'You don\'t have to be great to start, but you have to start to be great.', author: 'Zig Ziglar' },
  { text: 'Small daily improvements over time lead to stunning results.', author: 'Robin Sharma' },
  { text: 'What gets measured gets managed.', author: 'Peter Drucker' },
  { text: 'Amateurs sit and wait for inspiration. The rest of us just get up and go to work.', author: 'Stephen King' },
  { text: 'The best way to get something done is to begin.', author: 'Unknown' },
  { text: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
  { text: 'Your future is created by what you do today, not tomorrow.', author: 'Robert Kiyosaki' },
  { text: 'Stop waiting for the perfect moment. Take the moment and make it perfect.', author: 'Unknown' },
  { text: 'Productivity is never an accident. It is the result of commitment to excellence.', author: 'Paul J. Meyer' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
  { text: 'It\'s not about having enough time. It\'s about making enough time.', author: 'Unknown' },
  { text: 'One day or day one. You decide.', author: 'Unknown' },
  { text: 'The difference between try and triumph is a little "umph".', author: 'Marvin Phillips' },
  { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle' },
  // Chinese
  { text: '千里之行，始于足下。', author: '老子' },
  { text: '不积跬步，无以至千里。', author: '荀子' },
  { text: '今日事，今日毕。', author: '谚语' },
  { text: '业精于勤，荒于嬉。', author: '韩愈' },
  { text: '滴水穿石，非一日之功。', author: '谚语' },
  { text: '凡事预则立，不预则废。', author: '《中庸》' },
  { text: '知行合一。', author: '王阳明' },
  { text: '只要功夫深，铁杵磨成针。', author: '谚语' },
  { text: '天行健，君子以自强不息。', author: '《周易》' },
  { text: '路漫漫其修远兮，吾将上下而求索。', author: '屈原' },
  { text: '工欲善其事，必先利其器。', author: '孔子' },
  { text: '学而不思则罔，思而不学则殆。', author: '孔子' },
  { text: '志当存高远。', author: '诸葛亮' },
  { text: '莫等闲，白了少年头，空悲切。', author: '岳飞' },
  { text: '世上无难事，只怕有心人。', author: '谚语' },
  { text: '一分耕耘，一分收获。', author: '谚语' },
  { text: '逆水行舟，不进则退。', author: '谚语' },
  { text: '宝剑锋从磨砺出，梅花香自苦寒来。', author: '谚语' },
  { text: '静以修身，俭以养德。', author: '诸葛亮' },
  { text: '人生在勤，不索何获。', author: '张衡' },
]

const STORAGE_KEY = 'frost-quote-of-day'
const MS_PER_DAY = 86400000

function getToday() {
  return new Date().toDateString()
}

export default function useQuotes() {
  const [quote, setQuote] = useState(() => {
    // Pick quote for today — try stored QOTD first
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
      if (stored && stored.date === getToday()) {
        // Today's quote already chosen — use it
        return stored.quote
      }
    } catch {}
    // Pick a fresh quote for today
    const fresh = QUOTES[Math.floor(Math.random() * QUOTES.length)]
    const payload = { date: getToday(), quote: fresh }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return fresh
  })

  const refresh = useCallback(() => {
    // Pick a new quote (overwrite today's)
    const fresh = QUOTES[Math.floor(Math.random() * QUOTES.length)]
    const payload = { date: getToday(), quote: fresh }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    setQuote(fresh)
  }, [])

  return { quote, refresh }
}
