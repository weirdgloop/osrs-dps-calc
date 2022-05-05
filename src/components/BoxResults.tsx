export default function BoxResults() {
  return (
    <div className={'mt-4'}>
      <div className={'mt-2'}>
        <div className={'flex justify-center items-center gap-12 text-center flex-wrap p-1 rounded bg-gray-700 border-gray-200 p-6 shadow text-white'}>
          <div>
            <h3 className={'font-semibold'}>Max hit</h3>
            <p>43</p>
          </div>
          <div>
            <h3 className={'font-semibold'}>Accuracy</h3>
            <p>82.75%</p>
          </div>
          <div>
            <h3 className={'font-semibold'}>Damage per second (DPS)</h3>
            <p>5.9304</p>
          </div>
          <div>
            <h3 className={'font-semibold'}>Average time-to-kill (TTK)</h3>
            <p>56.25 seconds</p>
          </div>
          <div>
            <h3 className={'font-semibold'}>Average damage taken</h3>
            <p>18.71</p>
          </div>
        </div>
      </div>
    </div>
  )
}