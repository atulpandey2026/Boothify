import React from 'react';

const mediaNames = [
  'UP 18 News',
  'KBK Times',
  'Dainik Jagran',
  'up-patrika',
  'Lucknow Digital',
  'newsdaddy',
  'Mint-Money',
  'Pink City Now',
  'Prakhar Jagaran',
  'DelhiMorning Tribune',
  'Hola Mumbai',
  'Delhi News Now',
  'MPGuardian',
  'Rajasthan Mirror',
  'MPNewsline',
  'rajasthanjournal',
  'AllahabadPost',
  'MadhyaPradeshMirror',
  'LiveJabalpur',
  'maharashtra 24x7',
  'Your Bangalore',
  'Rising Entrepreneurs',
  'Indore Pioneer',
  'Central Herald',
  'EveningPost',
  'National Insight',
  'Prevalent India',
  'TheIndian Influencer',
  'BusinessPoint',
  'DeccanExpress',
  'NorthWestNewsTimes',
  'TheCapitalNews',
  'TheDailyMetro',
  'GwaliorBuzz',
  'KhabareRajasthan',
  'udaipurdispatch',
  'BizzSight',
  'NewsTrackBhopal',
  'NagpurNewsToday',
  'SattaExpress',
  'TheDeccanMessenger',
  'Ncr-Chronicle',
  'DelhiNewsWatch',
  'MarudharChronicle',
  'jodhpurreporter',
  'ShekhawatiSamachar',
  'Nashik24',
  'RajasthanExpress',
  'LiveMumbai',
  'SikkimSamachar',
  'LankaExpress',
  'BhiwandiPost',
  'VaaniLive24',
  'SatyaBuzz',
  'VisakhapatnamToday',
  'VizagMirror',
  'konkanjournal',
  'vartaone',
  'ranchichronicle',
  'hyderabadinews',
  'ghaziabadtimes',
  'khabareludhiana',
  'agrasamachar',
  'SrinagarBulletin',
  'NavDhwani',
  'CalcuttaCurrent',
  'AwadhExpress',
  'deshdecoded',
  'KannadaChronicle',
  'KashiChronicle',
  'TheBuzzBharat',
  'BhubaneswarJournal',
  'DhanbadExpress',
  'GoaKhabar',
  'Guwahati Journal',
  'RepublicGoa',
  'NoidaExpress',
  'MadrasJournal',
  'PatnaPatrika',
  'DharmaDhwani',
  'VishvaSamvaad',
  'arthavarta',
  'rashtradeep',
  'rashtraved',
  'SwatantraVaani',
  'HaryanaHerald',
  'HyderabadSocial',
  'BengaloreBuzz',
  'TelaganaTalks',
  'KochiKhabar',
  'NagpurNote',
  'GlobalNewsIndex',
  'TypicalNews',
  'BanrasiNews',
  'NextNews',
  'RealEcho',
  'FastReport',
  'EraTimes',
  'TheIconicNews'
];

const mediaDouble = [...mediaNames, ...mediaNames];

export default function MediaMarquee() {
  return (
    <div className="bg-white border-b border-gray-100 py-2.5 overflow-hidden flex items-center shadow-sm">
      {/* Fixed label */}
      <div className="flex-shrink-0 flex items-center gap-3 px-5 border-r border-gray-100 h-full">
        <span className="text-[10px] font-800 uppercase tracking-[0.18em] text-violet-600 whitespace-nowrap">
          As Covered By
        </span>
      </div>
      {/* Scrolling names */}
      <div className="flex-1 marquee-wrapper">
        <div className="animate-marquee-left-fast flex items-center gap-0">
          {mediaDouble?.map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-6 text-[11px] font-700 tracking-widest uppercase whitespace-nowrap text-gray-400 hover:text-gray-700 transition-colors"
            >
              <span className="text-violet-400 text-base leading-none">◆</span>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
