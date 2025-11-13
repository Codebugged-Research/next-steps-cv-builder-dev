import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import ProjectHeader from '../../../components/Common/ProjectHeader';
import ConferenceTabs from './ConferenceTabs';
import api from '../../../services/api';

const Conferences = ({ onBack }) => {
    const [conferences, setConferences] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        available: 0,
        registered: 0
    });

    const fetchConferences = async () => {
        try {
            setLoading(true);
            const response = await api.get('/conferences');
            
            if (response.data.success) {
                setConferences(response.data.data);
                setStats(prev => ({
                    ...prev,
                    available: response.data.data.length
                }));
            }
        } catch (error) {
            console.error('Error fetching conferences:', error);
            toast.error('Failed to load conferences');
        } finally {
            setLoading(false);
        }
    };

    const fetchRegistrations = async () => {
        try {
            const response = await api.get('/conferences/registrations');
            if (response.data.success) {
                setRegistrations(response.data.data);
                setStats(prev => ({
                    ...prev,
                    registered: response.data.data.length
                }));
            }
        } catch (error) {
            console.error('Error fetching registrations:', error);
            setRegistrations([]);
            setStats(prev => ({
                ...prev,
                registered: 0
            }));
        }
    };

    useEffect(() => {
        fetchConferences();
        fetchRegistrations();
    }, []);

    const getAvailableConferences = () => {
        const registeredConferenceIds = registrations.map(reg => {
            if (typeof reg.conference === 'string') {
                return reg.conference;
            }
            if (reg.conference?._id) {
                return reg.conference._id;
            }
            return null;
        }).filter(id => id !== null);


        const available = conferences.filter(conf => !registeredConferenceIds.includes(conf._id));
        
        
        return available;
    };

    const availableConferences = getAvailableConferences();

    const headerConfig = {
        backgroundImage: '/conferences.jpg',  
        icon: BookOpen,
        title: 'Conferences & Events',
        subtitle: 'Find below the list of upcoming conferences and events',
        stats: [
            { value: availableConferences.length.toString(), label: 'Available Conferences' },
            { value: stats.registered.toString(), label: 'Your Registrations' },
        ]
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-12">
                        <Loader className="h-8 w-8 text-[#169AB4] animate-spin mr-3" />
                        <span className="text-lg text-[#04445E]">Loading conferences...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProjectHeader {...headerConfig} />
                <ConferenceTabs
                    upcomingConferences={availableConferences}
                    registrations={registrations}
                    onRefreshRegistrations={fetchRegistrations}
                />
            </div>
        </div>
    );
};

export default Conferences;