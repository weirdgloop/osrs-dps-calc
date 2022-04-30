import type { NextPage } from 'next'
import Head from 'next/head';
import BoxPlayerInputs from '../components/BoxPlayerInputs';
import BoxCombatAttributes from '../components/BoxCombatAttributes';
import BoxMonster from '../components/BoxMonster';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>OSRS DPS Calculator</title>
      </Head>
      {/* Main container */}
      <div className={'max-w-7xl mx-auto mt-4'}>
        {/* Container for tiles */}
        <div className={'flex gap-4 flex-row'}>
          <BoxPlayerInputs />
          <BoxCombatAttributes />
          <BoxMonster />
        </div>
      </div>
    </div>
  )
}

export default Home;
