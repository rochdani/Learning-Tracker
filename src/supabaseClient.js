// src/supabaseClient.js
// Supabase client configuration and API functions

import { createClient } from '@supabase/supabase-js';

// ============================================
// CONFIGURATION
// ============================================
// TODO: Replace with your actual Supabase credentials
// Find these in: Supabase Dashboard -> Settings -> API

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://mowsgzixhdkwecxhnbsr.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_GsYIXMChKrGLGDYuxTTplw_ODMB4Fiw';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// USER SETTINGS API
// ============================================

/**
 * Get user's start date
 */
export const getStartDate = async (userId = 'roch') => {
    try {
        const { data, error } = await supabase
            .from('user_settings')
            .select('start_date')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw error;
        }

        return data?.start_date || null;
    } catch (error) {
        console.error('Error getting start date:', error);
        return null;
    }
};

/**
 * Set user's start date
 */
export const setStartDate = async (userId = 'roch', startDate) => {
    try {
        const { error } = await supabase
            .from('user_settings')
            .upsert(
                { user_id: userId, start_date: startDate },
                { onConflict: 'user_id' }
            );

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error setting start date:', error);
        return false;
    }
};

// ============================================
// LEARNING DAYS API
// ============================================

/**
 * Get all learning days for a user
 */
export const getAllDays = async (userId = 'roch') => {
    try {
        const { data, error } = await supabase
            .from('learning_days')
            .select('*')
            .eq('user_id', userId)
            .order('day_number', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error getting all days:', error);
        return [];
    }
};

/**
 * Get a specific day
 */
export const getDay = async (userId = 'roch', dayNumber) => {
    try {
        const { data, error } = await supabase
            .from('learning_days')
            .select('*')
            .eq('user_id', userId)
            .eq('day_number', dayNumber)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error getting day:', error);
        return null;
    }
};

/**
 * Save or update a learning day
 */
export const saveDay = async (userId = 'roch', dayData) => {
    try {
        const payload = {
            user_id: userId,
            day_number: dayData.day,
            date: dayData.date,
            topic: dayData.topic || '',
            hours_spent: dayData.hoursSpent || 0,
            resources: dayData.resources || '',
            notes: dayData.notes || '',
            project_work: dayData.projectWork || '',
            completed: dayData.completed || false
        };

        const { data, error } = await supabase
            .from('learning_days')
            .upsert(payload, {
                onConflict: 'user_id,day_number',
                ignoreDuplicates: false
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving day:', error);
        return null;
    }
};

/**
 * Initialize all 100 days for a user
 */
export const initializeDays = async (userId = 'roch') => {
    try {
        const existingDays = await getAllDays(userId);
        if (existingDays.length > 0) {
            console.log('Days already initialized');
            return true;
        }

        const days = Array.from({ length: 100 }, (_, i) => ({
            user_id: userId,
            day_number: i + 1,
            hours_spent: 0,
            completed: false
        }));

        const { error } = await supabase
            .from('learning_days')
            .insert(days);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error initializing days:', error);
        return false;
    }
};

/**
 * Delete a specific day
 */
export const deleteDay = async (userId = 'roch', dayNumber) => {
    try {
        const { error } = await supabase
            .from('learning_days')
            .delete()
            .eq('user_id', userId)
            .eq('day_number', dayNumber);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting day:', error);
        return false;
    }
};

/**
 * Reset all data for a user
 */
export const resetAllData = async (userId = 'roch') => {
    try {
        const { error: daysError } = await supabase
            .from('learning_days')
            .delete()
            .eq('user_id', userId);

        if (daysError) throw daysError;

        const { error: settingsError } = await supabase
            .from('user_settings')
            .delete()
            .eq('user_id', userId);

        if (settingsError) throw settingsError;

        return true;
    } catch (error) {
        console.error('Error resetting data:', error);
        return false;
    }
};

// ============================================
// STATISTICS API
// ============================================

/**
 * Get user statistics
 */
export const getStats = async (userId = 'roch') => {
    try {
        const days = await getAllDays(userId);

        const completed = days.filter(d => d.completed).length;
        const totalHours = days.reduce((sum, d) => sum + (parseFloat(d.hours_spent) || 0), 0);
        const avgHours = completed > 0 ? (totalHours / completed).toFixed(1) : '0.0';

        return {
            completed,
            totalHours: totalHours.toFixed(1),
            avgHours,
            progressPercentage: ((completed / 100) * 100).toFixed(1)
        };
    } catch (error) {
        console.error('Error getting stats:', error);
        return {
            completed: 0,
            totalHours: '0.0',
            avgHours: '0.0',
            progressPercentage: '0.0'
        };
    }
};

/**
 * Get current month statistics
 */
export const getCurrentMonthStats = async (userId = 'roch', startDate) => {
    try {
        if (!startDate) {
            return { completed: 0, total: 0, hours: 0 };
        }

        const days = await getAllDays(userId);
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const currentMonthDays = days.filter(day => {
            if (!day.date) return false;
            const dayDate = new Date(day.date);
            return dayDate.getMonth() === currentMonth && dayDate.getFullYear() === currentYear;
        });

        const completed = currentMonthDays.filter(d => d.completed).length;
        const hours = currentMonthDays.reduce((sum, d) => sum + (parseFloat(d.hours_spent) || 0), 0);

        return {
            completed,
            total: currentMonthDays.length,
            hours: hours.toFixed(1)
        };
    } catch (error) {
        console.error('Error getting current month stats:', error);
        return { completed: 0, total: 0, hours: 0 };
    }
};

// ============================================
// EXPORT FUNCTIONALITY
// ============================================

/**
 * Export all days to CSV format
 */
export const exportToCSV = async (userId = 'roch') => {
    try {
        const days = await getAllDays(userId);

        const headers = ['Day', 'Date', 'Topic', 'Hours', 'Resources', 'Notes', 'Project Work', 'Completed'];
        const rows = days.map(d => [
            d.day_number,
            d.date || '',
            d.topic || '',
            d.hours_spent || 0,
            d.resources || '',
            d.notes || '',
            d.project_work || '',
            d.completed ? 'Yes' : 'No'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        return csvContent;
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        return '';
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Test database connection
 */
export const testConnection = async () => {
    try {
        const { data, error } = await supabase
            .from('learning_days')
            .select('count')
            .limit(1);

        if (error) throw error;
        console.log('✅ Supabase connection successful!');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection failed:', error);
        return false;
    }
};