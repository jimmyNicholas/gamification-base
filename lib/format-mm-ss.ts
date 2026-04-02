/** m:ss for match/leaderboard display (floor seconds, same as timed-match completion view). */
export function formatMmSs(ms: number) {
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${min}:${String(sec).padStart(2, "0")}`
}
