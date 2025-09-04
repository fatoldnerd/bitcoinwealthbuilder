import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wasabiQR from './WasabiTipJar.png';
import walletOfSatoshiQR from './WalletOfSatoshiTipJar.jpeg';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="container mx-auto p-4 md:p-8 max-w-7xl">
                {/* Navigation is handled by the global Navigation.js component, so it's not needed here */}

                <header className="text-center bg-slate-800/50 p-8 md:p-12 rounded-xl mb-16 hero-gradient">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Plan Your Bitcoin Future with Confidence</h1>
                    <p className="text-gray-400 max-w-3xl mx-auto">
                        Go beyond simple spreadsheets with a suite of interactive tools designed to help you visualize your long-term wealth, manage risk, and plan for retirement.
                    </p>
                </header>

                <main>
                    <section className="mb-16">
                         <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-4">Start Your Journey Here</h2>
                         <p className="text-center text-gray-400 max-w-2xl mx-auto mb-8">The Goal Planner is the perfect starting point for any specific, non-retirement savings goal. Create a plan, save it, and track your progress on your personal dashboard.</p>
                         <div className="max-w-2xl mx-auto bg-slate-800 p-6 rounded-xl border-t-4 border-purple-500 flex flex-col md:flex-row items-center gap-6">
                            <div className="mb-4 md:mb-0 bg-slate-700 w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flag text-purple-400"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <h3 className="text-xl font-semibold text-white mb-2">Goal Planner</h3>
                                <p className="text-sm text-gray-400">Set and track your financial goals for a house, car, or emergency fund to stay on target with your Bitcoin strategy.</p>
                            </div>
                            <button onClick={() => navigate('/goal-planner')} className="mt-4 md:mt-0 block w-full md:w-auto flex-shrink-0 text-center bg-purple-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-purple-600 transition-colors">LAUNCH PLANNER</button>
                        </div>
                    </section>

                    <section className="mb-16">
                         <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-4">Explore Our Core Tools</h2>
                         <p className="text-center text-gray-400 max-w-2xl mx-auto mb-8">Dive into our specialized calculators for sophisticated retirement planning, risk management, and long-term decision making.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-slate-800 p-6 rounded-xl border-t-4 border-orange-500 flex flex-col">
                                <div className="flex-grow">
                                    <div className="mb-4 bg-slate-700 w-12 h-12 rounded-lg flex items-center justify-center">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-umbrella text-orange-400"><path d="M22 12a10.06 10.06 1 0 0-20 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v1"/></svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Retirement Calculator</h3>
                                    <p className="text-sm text-gray-400">Plan your retirement with "Sell vs. Borrow" strategies and phase-based spending plans.</p>
                                </div>
                                <button onClick={() => navigate('/retirement')} className="mt-6 block w-full text-center bg-orange-500 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-600 transition-colors">Plan Retirement</button>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-xl border-t-4 border-green-500 flex flex-col">
                                <div className="flex-grow">
                                    <div className="mb-4 bg-slate-700 w-12 h-12 rounded-lg flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scale text-green-400"><path d="m16 16 3-8 3 8c-2 1-4 1-6 0"/><path d="M2 16l3-8 3 8c-2 1-4 1-6 0"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">LTV Risk Calculator</h3>
                                    <p className="text-sm text-gray-400">Understand borrowing risks and calculate safe loan amounts to avoid liquidation.</p>
                                </div>
                                <button onClick={() => navigate('/ltv')} className="mt-6 block w-full text-center bg-green-500 text-white font-semibold py-2.5 rounded-lg hover:bg-green-600 transition-colors">Analyze Risk</button>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-xl border-t-4 border-blue-500 flex flex-col">
                                <div className="flex-grow">
                                     <div className="mb-4 bg-slate-700 w-12 h-12 rounded-lg flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-git-fork text-blue-400"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/></svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Opportunity Cost</h3>
                                    <p className="text-sm text-gray-400">See the potential future value of money you're considering spending today.</p>
                                </div>
                                <button onClick={() => navigate('/opportunity-cost')} className="mt-6 block w-full text-center bg-blue-500 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-600 transition-colors">Calculate Cost</button>
                            </div>
                        </div>
                    </section>
                    
                    <section className="bg-slate-800/50 p-8 rounded-xl mb-16">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check text-green-400 mb-2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                                <h3 className="font-semibold text-white">Privacy First</h3>
                                <p className="text-xs text-gray-400">All calculations happen in your browser. No data is stored or transmitted.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-line-chart text-blue-400 mb-2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                                <h3 className="font-semibold text-white">Real-Time Data</h3>
                                <p className="text-xs text-gray-400">Live Bitcoin prices from CoinGecko API for accurate, up-to-date calculations.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-marked text-orange-400 mb-2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="m10 12.5-2-2 2-2"/></svg>
                                <h3 className="font-semibold text-white">Comprehensive Guide</h3>
                                <p className="text-xs text-gray-400">Detailed documentation and examples to help you make informed decisions.</p>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-slate-800/50 p-8 md:p-12 rounded-xl text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Support This Project</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        If you find these tools valuable, please consider supporting their continued development. Thank you!
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        <div className="bg-slate-800 p-6 rounded-lg">
                            <h3 className="font-semibold text-white mb-4">On-Chain Bitcoin</h3>
                            <img src={wasabiQR} alt="On-Chain Bitcoin QR Code" className="mx-auto rounded-md" />
                        </div>
                        <div className="bg-slate-800 p-6 rounded-lg">
                            <h3 className="font-semibold text-white mb-4">Lightning</h3>
                            <img src={walletOfSatoshiQR} alt="Lightning QR Code" className="mx-auto rounded-md" />
                        </div>
                    </div>
                </footer>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md m-4 relative border border-slate-700">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <h2 className="text-2xl font-bold text-white text-center mb-6">Welcome Back</h2>
                        
                        <div className="space-y-4 mb-6">
                            <button className="w-full bg-slate-700 text-white font-semibold py-2.5 rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center">
                                {/* Google SVG */}
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.657-3.444-11.28-8.161l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.011,35.188,44,30.013,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                                Continue with Google
                            </button>
                             <button className="w-full bg-slate-700 text-white font-semibold py-2.5 rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center">
                                {/* GitHub SVG */}
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                                Continue with GitHub
                            </button>
                        </div>
                        
                        <div className="flex items-center my-4">
                            <hr className="w-full border-slate-600" />
                            <span className="px-2 text-xs text-gray-500 uppercase">Or sign in with email</span>
                            <hr className="w-full border-slate-600" />
                        </div>

                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-4">
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input type="email" id="email" name="email" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="you@example.com" />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input type="password" id="password" name="password" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="••••••••" />
                            </div>
                            <button type="submit" className="w-full bg-orange-500 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-600 transition-colors mb-4">
                                Login
                            </button>
                        </form>
                        
                        <p className="text-center text-sm text-gray-400 mt-6">
                            Don't have an account? <a href="#" onClick={(e) => e.preventDefault()} className="text-orange-400 hover:underline font-semibold">Sign Up</a>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default LandingPage;