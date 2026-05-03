import { IconBrandDiscord } from '@tabler/icons-react';
import React from 'react';

const DiscordInvite: React.FC = () => (
  <a
    href="https://discord.gg/JXeUnR9stP"
    target="_blank"
    className="transition-all hover:scale-105 no-underline text-white border border-transparent bg-[#5865F2] py-1.5 px-2.5 rounded-md flex items-center gap-1"
  >
    <IconBrandDiscord size={20} aria-label="Discord" />
    <div className="hidden md:block">Feedback? Join Discord!</div>
  </a>
);

export default DiscordInvite;
