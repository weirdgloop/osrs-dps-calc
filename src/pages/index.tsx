import type { NextPage } from 'next'
import Head from 'next/head';
import BoxPlayerInputs from '../components/BoxPlayerInputs';
import BoxCombatAttributes from '../components/BoxCombatAttributes';
import BoxMonster from '../components/BoxMonster';
import ReactTooltip from 'react-tooltip';
import {useEffect, useState} from 'react';
import BoxResults from '@/components/BoxResults';

const Home: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Needed for rendering tooltips while using SSR
  useEffect(() => {
    setIsMounted(true);
  }, [])

  return (
    <div>
      <Head>
        <title>OSRS DPS Calculator</title>
      </Head>
      {/* Main container */}
      <div className={'max-w-7xl mx-auto mt-4'}>
        {/* Container for tiles */}
        <div className={'grid grid-cols-1 lg:grid-cols-5 gap-4'}>
          <BoxPlayerInputs />
          <BoxCombatAttributes />
          <BoxMonster />
        </div>
        <BoxResults />
      </div>
      {isMounted && <ReactTooltip place={'top'} effect={'solid'}  />}
    </div>
  )
}

export default Home;
