import Navbar from './Navbar';
import Footer from './Footer';

function Surgeries() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-violet-100 rounded-full mb-6">
                            <svg className="w-10 h-10 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Surgeries</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Safe and trusted surgeries with top surgeons. Get end-to-end care with dedicated support throughout your journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Surgeons</h3>
                            <p className="text-gray-600">Handpicked surgeons with 10+ years of experience and thousands of successful surgeries.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Top Hospitals</h3>
                            <p className="text-gray-600">Partnered with NABH-accredited hospitals for the best surgical care.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Care</h3>
                            <p className="text-gray-600">From pre-surgery consultation to post-op recovery — dedicated care coordinator throughout.</p>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <button className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-3.5 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-200">
                            Explore Surgeries
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Surgeries;
