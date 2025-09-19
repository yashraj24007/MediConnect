import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "@/data/doctors";

export interface DoctorProfile {
  id: string;
  profile_id: string;
  specialty: string;
  license_number: string | null;
  years_experience: number | null;
  bio: string | null;
  consultation_fee: number | null;
  created_at: string;
  profiles: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    email: string | null;
    created_at: string;
  };
}

export class DoctorService {
  /**
   * Fetch all doctors from Supabase database
   */
  static async getAllDoctors(): Promise<Doctor[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          profiles (
            id,
            first_name,
            last_name,
            phone,
            email,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching doctors:', error);
        throw error;
      }

      // Transform Supabase data to match our Doctor interface
      return this.transformToDoctors(data as any[]);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      return [];
    }
  }

  /**
   * Fetch a single doctor by ID
   */
  static async getDoctorById(id: string): Promise<Doctor | null> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          profiles (
            id,
            first_name,
            last_name,
            phone,
            email,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching doctor:', error);
        return null;
      }

      const doctors = this.transformToDoctors([data as any]);
      return doctors[0] || null;
    } catch (error) {
      console.error('Failed to fetch doctor:', error);
      return null;
    }
  }

  /**
   * Add a new doctor to the database
   */
  static async addDoctor(doctorData: {
    profile_id: string;
    specialty: string;
    license_number?: string;
    years_experience?: number;
    bio?: string;
    consultation_fee?: number;
  }) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .insert([doctorData])
        .select(`
          *,
          profiles (
            id,
            first_name,
            last_name,
            phone,
            email,
            created_at
          )
        `)
        .single();

      if (error) {
        console.error('Error adding doctor:', error);
        throw error;
      }

      return this.transformToDoctors([data as any])[0];
    } catch (error) {
      console.error('Failed to add doctor:', error);
      throw error;
    }
  }

  /**
   * Update doctor information
   */
  static async updateDoctor(id: string, updates: Partial<{
    specialty: string;
    license_number: string;
    years_experience: number;
    bio: string;
    consultation_fee: number;
  }>) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profiles (
            id,
            first_name,
            last_name,
            phone,
            email,
            created_at
          )
        `)
        .single();

      if (error) {
        console.error('Error updating doctor:', error);
        throw error;
      }

      return this.transformToDoctors([data as any])[0];
    } catch (error) {
      console.error('Failed to update doctor:', error);
      throw error;
    }
  }

  /**
   * Delete a doctor from the database
   */
  static async deleteDoctor(id: string) {
    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting doctor:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete doctor:', error);
      throw error;
    }
  }

  /**
   * Search doctors by specialty or name
   */
  static async searchDoctors(query: string): Promise<Doctor[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          profiles (
            id,
            first_name,
            last_name,
            phone,
            email,
            created_at
          )
        `)
        .or(`specialty.ilike.%${query}%,profiles.first_name.ilike.%${query}%,profiles.last_name.ilike.%${query}%`);

      if (error) {
        console.error('Error searching doctors:', error);
        throw error;
      }

      return this.transformToDoctors(data as any[]);
    } catch (error) {
      console.error('Failed to search doctors:', error);
      return [];
    }
  }

  /**
   * Transform Supabase data to match our Doctor interface
   */
  private static transformToDoctors(data: any[]): Doctor[] {
    return data.map(doctor => ({
      id: doctor.id,
      name: `${doctor.profiles?.first_name || ''} ${doctor.profiles?.last_name || ''}`.trim() || 'Unknown Doctor',
      specialty: doctor.specialty,
      hospital: 'Hospital Name', // You might want to add hospital relation
      experience: doctor.years_experience || 0,
      qualification: doctor.license_number || 'Medical License',
      phone: doctor.profiles?.phone || 'Not provided',
      email: doctor.profiles?.email || 'Not provided',
      image: '/placeholder.svg', // You might want to add avatar support
      about: doctor.bio || 'Professional medical practitioner',
      expertise: [doctor.specialty], // You might want to add an expertise table
      consultationFee: doctor.consultation_fee || 0,
      availability: {
        "Monday": "9:00 AM - 5:00 PM",
        "Tuesday": "9:00 AM - 5:00 PM",
        "Wednesday": "9:00 AM - 5:00 PM",
        "Thursday": "9:00 AM - 5:00 PM",
        "Friday": "9:00 AM - 5:00 PM",
        "Saturday": "9:00 AM - 1:00 PM"
      }, // You might want to add an availability table
      languages: ["English"] // You might want to add a languages table
    }));
  }
}