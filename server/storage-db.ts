import { db } from './db';
import { users, doctors, type User, type InsertUser, type Doctor, type InsertDoctor, type FilterParams } from '@shared/schema';
import { eq, like, and, or, gte, lte, desc, asc, SQL, sql } from 'drizzle-orm';
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results.length > 0 ? results[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async addDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const [doctor] = await db.insert(doctors).values(insertDoctor).returning();
    return doctor;
  }

  async getDoctorById(id: number): Promise<Doctor | undefined> {
    const results = await db.select().from(doctors).where(eq(doctors.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getDoctors(filters: FilterParams): Promise<{ doctors: Doctor[], total: number }> {
    // Start building the WHERE conditions
    const conditions: SQL[] = [];
    
    // Search filter
    if (filters.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          like(doctors.name, searchTerm),
          like(doctors.specialization, searchTerm),
          like(doctors.hospital, searchTerm),
          like(doctors.location, searchTerm)
        )
      );
    }
    
    // Modes filter
    if (filters.modes && filters.modes.length > 0) {
      // For each consultation mode, check if it's in the modes array column
      const modeConditions = filters.modes.map(mode => 
        sql`${mode} = ANY(${doctors.modes})`
      );
      // Combine with OR (doctor has any of the selected modes)
      if (modeConditions.length > 0) {
        conditions.push(sql`(${sql.join(modeConditions, sql` OR `)})`);
      }
    }
    
    // Experience range filter
    if (filters.experienceRange && filters.experienceRange.length > 0) {
      const experienceConditions = filters.experienceRange.map(range => {
        const [min, max] = range;
        return and(
          gte(doctors.experience, min),
          lte(doctors.experience, max)
        );
      });
      if (experienceConditions.length > 0) {
        conditions.push(or(...experienceConditions));
      }
    }
    
    // Price range filter
    if (filters.priceRange && filters.priceRange.length > 0) {
      const priceConditions = filters.priceRange.map(range => {
        const [min, max] = range;
        return and(
          gte(doctors.price, min),
          lte(doctors.price, max)
        );
      });
      if (priceConditions.length > 0) {
        conditions.push(or(...priceConditions));
      }
    }
    
    // Languages filter
    if (filters.languages && filters.languages.length > 0) {
      // For each language, check if it's in the languages array column
      const languageConditions = filters.languages.map(language => 
        sql`${language} = ANY(${doctors.languages})`
      );
      // Combine with OR (doctor speaks any of the selected languages)
      if (languageConditions.length > 0) {
        conditions.push(sql`(${sql.join(languageConditions, sql` OR `)})`);
      }
    }
    
    // Facilities filter
    if (filters.facilities && filters.facilities.length > 0) {
      const facilityConditions = filters.facilities.map(facility => {
        return eq(doctors.facility, facility);
      });
      if (facilityConditions.length > 0) {
        conditions.push(or(...facilityConditions));
      }
    }
    
    // Build the final query
    let query = db.select().from(doctors);
    
    // Add WHERE conditions if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Count total results for pagination
    const countResult = await db.select({ count: sql`count(*)` }).from(doctors);
    const total = countResult[0].count ? Number(countResult[0].count) : 0;
    
    // Apply sorting
    switch (filters.sort) {
      case 'experience':
        query = query.orderBy(desc(doctors.experience));
        break;
      case 'price_low_to_high':
        query = query.orderBy(asc(doctors.price));
        break;
      case 'price_high_to_low':
        query = query.orderBy(desc(doctors.price));
        break;
      case 'rating':
        query = query.orderBy(desc(doctors.rating));
        break;
      default:
        // Default sorting by rating
        query = query.orderBy(desc(doctors.rating));
        break;
    }
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;
    
    query = query.limit(limit).offset(offset);
    
    // Execute the query
    const doctorResults = await query;
    
    return { 
      doctors: doctorResults, 
      total 
    };
  }
  
  // Method to seed initial data
  async seedDoctors() {
    // Check if there are already doctors in the database
    const existingDoctors = await db.select().from(doctors).limit(1);
    
    if (existingDoctors.length === 0) {
      // Sample doctors data for seeding
      const sampleDoctors = [
        {
          name: "Dr. Suraja Nutulapat",
          image: "https://randomuser.me/api/portraits/women/76.jpg",
          specialization: "General Physician | Internal Medicine Specialist",
          internalMedicine: true,
          experience: 10,
          qualification: "MBBS, MD (INTERNAL MEDICINE)",
          location: "Hyderabad",
          hospital: "Apollo 24|7 Virtual Clinic • Telangana Hyderabad",
          price: 499,
          cashback: 75,
          languages: ["English", "Hindi", "Telugu"],
          rating: 95,
          totalRatings: 120,
          availableIn: 0,
          isHourDoctor: true,
          modes: ["online", "hospital"],
          facility: "Apollo Hospital"
        },
        {
          name: "Dr. Lakshmi Sindhura Kakani",
          image: "https://randomuser.me/api/portraits/women/65.jpg",
          specialization: "General Physician | Internal Medicine Specialist",
          internalMedicine: true,
          experience: 10,
          qualification: "MBBS, MD (GENERAL MEDICINE)",
          location: "Visakhapatnam",
          hospital: "Apollo 24|7 Virtual Clinic • Andhra Pradesh, Visakhapatnam",
          price: 499,
          cashback: 75,
          languages: ["English", "Telugu"],
          rating: 90,
          totalRatings: 80,
          availableIn: 3,
          isHourDoctor: false,
          modes: ["online"],
          facility: "Other Clinics"
        },
        {
          name: "Dr. Lakshmi Sanjitha Kakani",
          image: "https://randomuser.me/api/portraits/women/45.jpg",
          specialization: "General Physician | Internal Medicine Specialist",
          internalMedicine: true,
          experience: 6,
          qualification: "MBBS, MD (GENERAL MEDICINE)",
          location: "Visakhapatnam",
          hospital: "Apollo 24|7 Virtual Clinic • Andhra Pradesh, Visakhapatnam",
          price: 499,
          cashback: 75,
          languages: ["English", "Telugu", "Hindi"],
          rating: 92,
          totalRatings: 45,
          availableIn: 5,
          isHourDoctor: false,
          modes: ["online", "hospital"],
          facility: "Apollo Hospital"
        },
        {
          name: "Dr. J T Hema Pratima",
          image: "https://randomuser.me/api/portraits/women/28.jpg",
          specialization: "General Physician",
          internalMedicine: false,
          experience: 9,
          qualification: "MBBS",
          location: "Chennai",
          hospital: "Apollo 24|7 Virtual Clinic • Tamilnadu, Chennai",
          price: 499,
          cashback: 75,
          languages: ["English", "Tamil"],
          rating: 95,
          totalRatings: 100,
          availableIn: 3,
          isHourDoctor: false,
          modes: ["online"],
          facility: "Other Clinics"
        },
        {
          name: "Dr. Siri Nallapu",
          image: "https://randomuser.me/api/portraits/women/32.jpg",
          specialization: "General Physician | Internal Medicine Specialist",
          internalMedicine: true,
          experience: 7,
          qualification: "MBBS, MD (INTERNAL MEDICINE)",
          location: "Bangalore",
          hospital: "Apollo 24|7 Virtual Clinic • Karnataka, Bangalore",
          price: 599,
          cashback: 80,
          languages: ["English", "Kannada", "Hindi"],
          rating: 88,
          totalRatings: 60,
          availableIn: 10,
          isHourDoctor: false,
          modes: ["online", "hospital"],
          facility: "Apollo Hospital"
        }
      ];
      
      // Insert all sample doctors
      await db.insert(doctors).values(sampleDoctors);
      console.log('Database seeded with sample doctors');
    }
  }
}