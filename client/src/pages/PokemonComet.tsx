import React, { useState } from 'react';
import { Link } from 'wouter';

const PokemonComet: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');

  const pages = [
    { id: 'home', name: 'Home', path: '/' },
    { id: 'battle', name: 'Battle', path: '/battle' },
    { id: 'forums', name: 'Forums', path: '/forums' },
    { id: 'rankings', name: 'Rankings', path: '/rankings' },
    { id: 'pokedex', name: 'Pokedex', path: '/pokedex' }
  ];

  // Mock content for each section
  const pageContent = {
    home: {
      title: 'Welcome to Pokémon Comet',
      content: 'The greatest Pokémon adventure awaits! Join thousands of trainers online in this massive multiplayer experience.',
      features: ['Catch over 800 Pokémon', 'Battle against other players', 'Join tournaments', 'Trade with friends'],
      stats: { online: 1337, regions: 6, pokemon: 802, trainers: 124598 }
    },
    battle: {
      title: 'Battle Arena',
      content: 'Test your skills against trainers from around the world!',
      modes: ['PvP Battles', 'Gym Leader Challenge', 'Elite Four Tournament', 'Battle Tower']
    },
    forums: {
      title: 'Community Forums',
      topics: [
        { title: 'New Legendary Event!', replies: 42, author: 'AshKetchum99' },
        { title: 'Trading: Looking for Gengar', replies: 7, author: 'PikaLover' },
        { title: 'Best team for Elite Four?', replies: 23, author: 'DragonMaster' },
        { title: 'Bug in Safari Zone?', replies: 12, author: 'BugCatcher' }
      ]
    },
    rankings: {
      title: 'Top Trainers',
      trainers: [
        { rank: 1, name: 'Red', wins: 583, losses: 27 },
        { rank: 2, name: 'Blue', wins: 571, losses: 42 },
        { rank: 3, name: 'Cynthia', wins: 562, losses: 31 },
        { rank: 4, name: 'Lance', wins: 559, losses: 48 },
        { rank: 5, name: 'Steven', wins: 548, losses: 52 }
      ]
    },
    pokedex: {
      title: 'Pokédex',
      recentDiscoveries: ['Mimikyu', 'Toxtricity', 'Corviknight'],
      regions: ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos']
    }
  };

  // Render content based on current page
  const renderPageContent = () => {
    switch(currentPage) {
      case 'home':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{pageContent.home.title}</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <div className="mb-4 font-semibold text-lg">{pageContent.home.content}</div>
                <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">FEATURES:</h3>
                  <ul className="list-disc pl-5">
                    {pageContent.home.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 bg-blue-100 border-2 border-blue-400 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">LATEST NEWS:</h3>
                  <p>New event starting next week! Catch rare Pokémon in the Safari Zone!</p>
                  <button className="mt-2 px-4 py-1 bg-blue-500 text-white font-bold rounded">Read More</button>
                </div>
              </div>
              <div className="md:w-1/3 bg-white border-2 border-gray-300 rounded-lg p-3">
                <h3 className="text-center font-bold border-b-2 border-gray-300 pb-1 mb-2">GAME STATS</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col items-center bg-gray-100 p-2 rounded">
                    <span className="font-bold text-blue-600">{pageContent.home.stats.online}</span>
                    <span>Players Online</span>
                  </div>
                  <div className="flex flex-col items-center bg-gray-100 p-2 rounded">
                    <span className="font-bold text-blue-600">{pageContent.home.stats.regions}</span>
                    <span>Regions</span>
                  </div>
                  <div className="flex flex-col items-center bg-gray-100 p-2 rounded">
                    <span className="font-bold text-blue-600">{pageContent.home.stats.pokemon}</span>
                    <span>Pokémon</span>
                  </div>
                  <div className="flex flex-col items-center bg-gray-100 p-2 rounded">
                    <span className="font-bold text-blue-600">{pageContent.home.stats.trainers.toLocaleString()}</span>
                    <span>Trainers</span>
                  </div>
                </div>
                <div className="mt-3 bg-green-100 border border-green-500 rounded p-2 text-center">
                  <div className="text-green-700 font-bold">Server Status: ONLINE</div>
                  <div className="text-xs mt-1">Last updated: 5 minutes ago</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'battle':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{pageContent.battle.title}</h2>
            <p className="mb-4">{pageContent.battle.content}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {pageContent.battle.modes.map((mode, index) => (
                <div key={index} className="bg-red-100 border-2 border-red-400 p-4 rounded-lg hover:bg-red-200 cursor-pointer transition-colors">
                  <h3 className="font-bold text-lg">{mode}</h3>
                  <p className="text-sm mt-2">Challenge other trainers and earn badges!</p>
                  <button className="mt-3 px-3 py-1 bg-red-500 text-white rounded-full text-sm">Enter</button>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <h3 className="font-bold mb-2">CURRENT TOURNAMENT:</h3>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Kanto Cup</div>
                  <div className="text-sm">Only Gen 1 Pokémon allowed</div>
                </div>
                <button className="px-4 py-2 bg-yellow-500 text-white font-bold rounded">Join Now</button>
              </div>
            </div>
          </div>
        );
      
      case 'forums':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{pageContent.forums.title}</h2>
            <div className="mb-4 flex justify-between">
              <button className="px-4 py-2 bg-blue-500 text-white font-bold rounded">New Topic</button>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-200 border border-gray-300 rounded">Sort by Date</button>
                <button className="px-4 py-2 bg-gray-200 border border-gray-300 rounded">Search</button>
              </div>
            </div>
            <div className="border-2 border-blue-300 rounded-lg overflow-hidden">
              <div className="bg-blue-100 p-2 font-bold grid grid-cols-12">
                <div className="col-span-8">Topic</div>
                <div className="col-span-2 text-center">Replies</div>
                <div className="col-span-2 text-center">Author</div>
              </div>
              {pageContent.forums.topics.map((topic, index) => (
                <div key={index} className={`p-3 grid grid-cols-12 items-center ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 cursor-pointer`}>
                  <div className="col-span-8 font-semibold text-blue-600">{topic.title}</div>
                  <div className="col-span-2 text-center">{topic.replies}</div>
                  <div className="col-span-2 text-center text-sm">{topic.author}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <button className="px-3 py-1 bg-gray-200 border border-gray-300 rounded">Previous</button>
              <button className="px-3 py-1 bg-blue-500 text-white font-bold rounded">1</button>
              <button className="px-3 py-1 bg-gray-200 border border-gray-300 rounded">2</button>
              <button className="px-3 py-1 bg-gray-200 border border-gray-300 rounded">3</button>
              <button className="px-3 py-1 bg-gray-200 border border-gray-300 rounded">Next</button>
            </div>
          </div>
        );
      
      case 'rankings':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{pageContent.rankings.title}</h2>
            <div className="overflow-hidden rounded-lg border-2 border-green-400">
              <table className="w-full">
                <thead className="bg-green-100">
                  <tr>
                    <th className="p-2 text-left">Rank</th>
                    <th className="p-2 text-left">Trainer</th>
                    <th className="p-2 text-right">Wins</th>
                    <th className="p-2 text-right">Losses</th>
                    <th className="p-2 text-right">Win %</th>
                  </tr>
                </thead>
                <tbody>
                  {pageContent.rankings.trainers.map((trainer, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50`}>
                      <td className="p-2 font-bold">{trainer.rank}</td>
                      <td className="p-2 text-blue-600 font-semibold">{trainer.name}</td>
                      <td className="p-2 text-right text-green-600">{trainer.wins}</td>
                      <td className="p-2 text-right text-red-600">{trainer.losses}</td>
                      <td className="p-2 text-right font-bold">
                        {((trainer.wins / (trainer.wins + trainer.losses)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border-2 border-blue-300 p-3 rounded-lg">
                <h3 className="font-bold mb-2">Weekly Tournament</h3>
                <p>Join our weekly tournament every Saturday at 3 PM!</p>
                <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">Register</button>
              </div>
              <div className="bg-purple-50 border-2 border-purple-300 p-3 rounded-lg">
                <h3 className="font-bold mb-2">Hall of Fame</h3>
                <p>Check out the greatest trainers of all time</p>
                <button className="mt-2 px-3 py-1 bg-purple-500 text-white rounded">View</button>
              </div>
            </div>
          </div>
        );
      
      case 'pokedex':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{pageContent.pokedex.title}</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/3">
                <div className="bg-red-100 border-2 border-red-400 p-3 rounded-lg mb-4">
                  <h3 className="font-bold mb-2">Search Pokédex</h3>
                  <input type="text" placeholder="Enter Pokémon name..." className="w-full p-2 border border-gray-300 rounded mb-2" />
                  <button className="w-full py-2 bg-red-500 text-white font-bold rounded">Search</button>
                </div>
                <div className="bg-blue-100 border-2 border-blue-400 p-3 rounded-lg">
                  <h3 className="font-bold mb-2">Regions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {pageContent.pokedex.regions.map((region, index) => (
                      <button key={index} className="py-1 bg-white border border-blue-300 rounded hover:bg-blue-50">
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="bg-yellow-100 border-2 border-yellow-400 p-3 rounded-lg mb-4">
                  <h3 className="font-bold mb-2">Recent Discoveries</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {pageContent.pokedex.recentDiscoveries.map((pokemon, index) => (
                      <div key={index} className="bg-white border border-gray-300 rounded-lg p-2 text-center hover:bg-yellow-50 cursor-pointer">
                        <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="material-icons">catching_pokemon</span>
                        </div>
                        <div className="font-semibold">{pokemon}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-green-100 border-2 border-green-400 p-3 rounded-lg">
                  <h3 className="font-bold mb-2">Pokédex Completion</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div className="bg-green-500 h-4 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="text-center">523/802 Pokémon caught (65%)</div>
                  <div className="mt-3 text-sm text-center">
                    <span className="font-bold">Tip:</span> Visit the Safari Zone to find rare Pokémon!
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-800 to-blue-900">
      {/* Header with logo */}
      <header className="bg-blue-700 border-b-4 border-yellow-400 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-300 drop-shadow-md">
            Pokémon Comet Portal
          </h1>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-xs text-white">
              <div>Online players: 1,337</div>
              <div>Server status: <span className="text-green-400">ONLINE</span></div>
            </div>
            <Link href="/search">
              <a className="px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-white rounded text-sm font-bold">
                Search Portal
              </a>
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-600 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-1">
          {pages.map((page) => (
            <button 
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`px-4 py-1 text-white font-bold rounded-t-lg transition-all ${
                currentPage === page.id 
                  ? 'bg-blue-400 border-2 border-b-0 border-yellow-300' 
                  : 'bg-blue-500 hover:bg-blue-400 border-2 border-yellow-200 opacity-80 hover:opacity-100'
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow p-4 flex justify-center">
        <div className="max-w-7xl w-full bg-white rounded-lg border-4 border-yellow-300 shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-gray-200 border-b-2 border-gray-400 p-2 flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="mx-auto text-sm text-gray-700 font-mono">
              https://pokemon-comet.net{pages.find(p => p.id === currentPage)?.path || ''}
            </div>
          </div>
          <div className="flex-grow p-1 bg-gray-100 overflow-auto">
            {renderPageContent()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-700 border-t-4 border-yellow-400 text-white p-4 text-center text-xs">
        <p>© 2025 Pokémon Comet Portal - Not affiliated with Nintendo or The Pokémon Company</p>
        <p className="mt-1">Best viewed with Internet Explorer 6.0 or Netscape Navigator 4.0 at 800x600 resolution</p>
        <div className="mt-2 flex justify-center space-x-2">
          <button className="px-2 py-1 bg-blue-500 hover:bg-blue-400 border border-blue-300 rounded text-xs">
            Add to Favorites
          </button>
          <button className="px-2 py-1 bg-blue-500 hover:bg-blue-400 border border-blue-300 rounded text-xs">
            Set as Homepage
          </button>
          <button className="px-2 py-1 bg-blue-500 hover:bg-blue-400 border border-blue-300 rounded text-xs">
            Tell a Friend
          </button>
        </div>
        <div className="mt-3 flex justify-center items-center gap-3">
          <a href="#" className="hover:text-yellow-300">About</a>
          <span>•</span>
          <a href="#" className="hover:text-yellow-300">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:text-yellow-300">Terms</a>
          <span>•</span>
          <a href="#" className="hover:text-yellow-300">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default PokemonComet;