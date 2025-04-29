import { doctors, users, type User, type InsertUser, type Doctor, type InsertDoctor, type FilterParams } from "@shared/schema";
import { db } from './db';
import { eq, desc, asc, and, or, like, gte, lte, inArray, isNull } from 'drizzle-orm';

// Storage interface for CRUD operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Doctor related methods
  addDoctor(doctor: InsertDoctor): Promise<Doctor>;
  getDoctorById(id: number): Promise<Doctor | undefined>;
  getDoctors(filters: FilterParams): Promise<{ doctors: Doctor[], total: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private doctorsData: Map<number, Doctor>;
  private userCurrentId: number;
  private doctorCurrentId: number;

  constructor() {
    this.users = new Map();
    this.doctorsData = new Map();
    this.userCurrentId = 1;
    this.doctorCurrentId = 1;
    
    // Add some sample doctors for testing
    this.seedDoctors();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async addDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = this.doctorCurrentId++;
    const doctor: Doctor = { 
      ...insertDoctor, 
      id,
      // Set defaults if not provided
      cashback: insertDoctor.cashback || 0,
      rating: insertDoctor.rating || 0,
      totalRatings: insertDoctor.totalRatings || 0,
      availableIn: insertDoctor.availableIn || 0,
      isHourDoctor: insertDoctor.isHourDoctor || false,
      internalMedicine: insertDoctor.internalMedicine || false,
      languages: insertDoctor.languages || [],
      modes: insertDoctor.modes || [],
    };
    this.doctorsData.set(id, doctor);
    return doctor;
  }

  async getDoctorById(id: number): Promise<Doctor | undefined> {
    return this.doctorsData.get(id);
  }

  async getDoctors(filters: FilterParams): Promise<{ doctors: Doctor[], total: number }> {
    let filteredDoctors = Array.from(this.doctorsData.values());
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchLower) || 
        doctor.specialization.toLowerCase().includes(searchLower) ||
        doctor.location.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply mode of consult filter
    if (filters.modes && filters.modes.length > 0) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        filters.modes!.some(mode => doctor.modes.includes(mode))
      );
    }
    
    // Apply experience range filter
    if (filters.experienceRange && filters.experienceRange.length > 0) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        filters.experienceRange!.some(range => 
          doctor.experience >= range[0] && doctor.experience <= range[1]
        )
      );
    }
    
    // Apply price range filter
    if (filters.priceRange && filters.priceRange.length > 0) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        filters.priceRange!.some(range => 
          doctor.price >= range[0] && doctor.price <= range[1]
        )
      );
    }
    
    // Apply languages filter
    if (filters.languages && filters.languages.length > 0) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        filters.languages!.some(lang => doctor.languages.includes(lang))
      );
    }
    
    // Apply facilities filter
    if (filters.facilities && filters.facilities.length > 0) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        filters.facilities!.includes(doctor.facility || "")
      );
    }
    
    // Apply sorting
    switch (filters.sort) {
      case "experience":
        filteredDoctors.sort((a, b) => b.experience - a.experience);
        break;
      case "price_low_to_high":
        filteredDoctors.sort((a, b) => a.price - b.price);
        break;
      case "price_high_to_low":
        filteredDoctors.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredDoctors.sort((a, b) => b.rating - a.rating);
        break;
      default: // relevance - doctors of the hour first
        filteredDoctors.sort((a, b) => {
          if (a.isHourDoctor && !b.isHourDoctor) return -1;
          if (!a.isHourDoctor && b.isHourDoctor) return 1;
          return 0;
        });
    }
    
    // Get total count for pagination
    const total = filteredDoctors.length;
    
    // Apply pagination
    const start = (filters.page - 1) * filters.limit;
    const end = start + filters.limit;
    filteredDoctors = filteredDoctors.slice(start, end);
    
    return { doctors: filteredDoctors, total };
  }

  private seedDoctors() {
    // Seed with sample doctors data
    const sampleDoctors: InsertDoctor[] = [
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

    // Add sample doctors to the storage
    sampleDoctors.forEach(doctor => {
      const id = this.doctorCurrentId++;
      this.doctorsData.set(id, { ...doctor, id });
    });
  }
}

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
    const conditions = [];
    
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
      // For array columns, we need to check if any of the modes in filter 
      // is in the doctor's modes array
      const modeConditions = filters.modes.map(mode => {
        return inArray(doctors.modes, [mode]);
      });
      if (modeConditions.length > 0) {
        conditions.push(or(...modeConditions));
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
      const languageConditions = filters.languages.map(language => {
        return inArray(doctors.languages, [language]);
      });
      if (languageConditions.length > 0) {
        conditions.push(or(...languageConditions));
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
    
    // Combine all conditions with AND
    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    // Count total rows for pagination
    const countQuery = await db.select({ count: doctors.id }).from(doctors)
      .where(whereCondition);
    const total = countQuery.length;
    
    // Determine sort order
    let orderBy = [];
    switch (filters.sort) {
      case 'experience':
        orderBy = [desc(doctors.experience)];
        break;
      case 'price_low_to_high':
        orderBy = [asc(doctors.price)];
        break;
      case 'price_high_to_low':
        orderBy = [desc(doctors.price)];
        break;
      case 'rating':
        orderBy = [desc(doctors.rating)];
        break;
      default:
        // Default relevance sorting - by isHourDoctor and rating
        orderBy = [desc(doctors.isHourDoctor), desc(doctors.rating)];
        break;
    }
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;
    
    // Execute the query with pagination and sorting
    let query = db.select().from(doctors);
    
    if (whereCondition) {
      query = query.where(whereCondition);
    }
    
    for (const order of orderBy) {
      query = query.orderBy(order);
    }
    
    const result = await query.limit(limit).offset(offset);
    
    return { doctors: result, total };
  }
  
  // Seed the database with initial data if needed
  async seedDoctors() {
    // Check if there are already doctors in the database
    const existingDoctors = await db.select().from(doctors).limit(1);
    
    if (existingDoctors.length === 0) {
      // Use the same sample doctors as in MemStorage
      const sampleDoctors: InsertDoctor[] = [
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
    }
  }
}

// Use the DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
