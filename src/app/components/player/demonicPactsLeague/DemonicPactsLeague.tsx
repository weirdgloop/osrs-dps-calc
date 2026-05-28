import React from 'react';
import { observer } from 'mobx-react-lite';
import UnimplementedPactsWarning from '@/app/components/player/demonicPactsLeague/UnimplementedPactsWarning';
import PactsExtraOptions from '@/app/components/player/demonicPactsLeague/PactsExtraOptions';
import CurrentEffects from '@/app/components/player/demonicPactsLeague/pactSelector/CurrentEffects';

const DemonicPactsLeague: React.FC = observer(() => (
  <>
    <UnimplementedPactsWarning />
    <div className="px-6 mb-4">
      {/* <DemonicPactsContainer /> */}
      <PactsExtraOptions />
    </div>
    <CurrentEffects />
  </>
));

export default DemonicPactsLeague;
