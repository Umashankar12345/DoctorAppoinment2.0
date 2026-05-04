import React from 'react';

const FeaturesRoadmap = () => {
    const stats = [
        { count: '15', label: 'Core Features', icon: '✨' },
        { count: '4', label: 'User Roles', icon: '👥' },
        { count: '7', label: 'Hospital Modules', icon: '🏥' },
        { count: '10', label: 'Interview Q&As', icon: '💬' },
    ];

    const categories = [
        {
            title: 'PATIENT SIDE',
            subtitle: 'what patients can do',
            color: 'bg-blue-50 border-blue-200',
            headerColor: 'text-blue-800',
            badgeBg: 'bg-blue-100 text-blue-700',
            icon: '🧑‍⚕️',
            features: [
                { id: '01', name: 'Doctor search & filter', tag: 'Core' },
                { id: '02', name: 'Online appointment booking', tag: 'Core' },
                { id: '03', name: 'Appointment management', tag: 'Core' },
                { id: '04', name: 'Online payment', tag: 'Revenue' },
                { id: '05', name: 'Video consultation', tag: 'Digital' },
                { id: '06', name: 'Digital prescription download', tag: 'Records' },
                { id: '07', name: 'Lab test booking & results', tag: 'Lab' },
                { id: '08', name: 'Medical history / health records', tag: 'Records' },
            ]
        },
        {
            title: 'DOCTOR SIDE',
            subtitle: 'what doctors can do',
            color: 'bg-green-50 border-green-200',
            headerColor: 'text-green-800',
            badgeBg: 'bg-green-100 text-green-700',
            icon: '🩺',
            features: [
                { id: '09', name: 'Doctor schedule dashboard', tag: 'Doctor' },
                { id: '10', name: 'Availability slot management', tag: 'Doctor' },
                { id: '11', name: 'Patient history before consult', tag: 'Doctor' },
            ]
        },
        {
            title: 'ADMIN SIDE',
            subtitle: 'what admin manages',
            color: 'bg-gray-50 border-gray-200',
            headerColor: 'text-gray-800',
            badgeBg: 'bg-gray-200 text-gray-700',
            icon: '⚙️',
            features: [
                { id: '12', name: 'Admin dashboard with analytics', tag: 'Admin' },
                { id: '13', name: 'Doctor verification & management', tag: 'Admin' },
            ]
        },
        {
            title: 'AI FEATURES',
            subtitle: 'what makes it rank #1',
            color: 'bg-purple-50 border-purple-200',
            headerColor: 'text-purple-800',
            badgeBg: 'bg-purple-200 text-purple-800 font-bold',
            icon: '🤖',
            features: [
                { id: '14', name: 'AI symptom checker (Claude API)', tag: 'AI — Most Special' },
                { id: '15', name: 'AI post-visit summary', tag: 'AI' },
            ]
        }
    ];

    return (
        <section className="py-16 px-10 bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Platform Capabilities & Roadmap</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">A comprehensive overview of the modules, roles, and AI-driven features that power the Bihar Healthcare platform.</p>
                </div>

                {/* Top Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                            <span className="text-3xl mb-2">{stat.icon}</span>
                            <span className="text-4xl font-black text-blue-600 tracking-tighter">{stat.count}</span>
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-1 text-center">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Feature Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {categories.map((cat, idx) => (
                        <div key={idx} className={`rounded-2xl border ${cat.color} overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300`}>
                            <div className={`px-6 py-5 border-b ${cat.color.replace('bg-', 'border-')} flex items-center gap-4 bg-white/50 backdrop-blur-sm`}>
                                <div className="text-3xl">{cat.icon}</div>
                                <div>
                                    <h3 className={`text-lg font-bold tracking-tight ${cat.headerColor}`}>{cat.title}</h3>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{cat.subtitle}</p>
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                {cat.features.map(feat => (
                                    <div key={feat.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-white hover:border-gray-200 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-gray-300 group-hover:text-gray-400 transition-colors w-5">{feat.id}</span>
                                            <span className="text-sm font-semibold text-gray-700">{feat.name}</span>
                                        </div>
                                        <span className={`text-[10px] px-2.5 py-1 rounded-md tracking-wide ${cat.badgeBg}`}>
                                            {feat.tag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesRoadmap;
