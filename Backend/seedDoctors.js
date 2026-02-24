const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const Clinic = require('./models/clinicModel');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Maps clinic name → state for linking
const clinicMap = {};

const doctors = [
    // ─── Karnataka ──────────────────────────
    { name: 'Dr. Arun Kumar', email: 'dr.arun@hospital.com', specialization: 'Cardiologist', qualifications: 'MBBS, MD (Cardiology), DM', experience: 22, rating: 4.9, phone: '+91 9876543210', state: 'Karnataka', district: 'Bangalore Urban', fees: 800, about: 'Senior Cardiologist at Narayana Health. Specializes in interventional cardiology and heart failure management.', coordinates: [77.5946, 12.9716], languages: ['English', 'Hindi', 'Kannada'], consultationModes: ['in-person', 'video'], clinicName: 'Narayana Health City', gender: 'male' },
    { name: 'Dr. Kavita Nair', email: 'dr.kavita@hospital.com', specialization: 'Ophthalmologist', qualifications: 'MBBS, MS (Ophthalmology)', experience: 14, rating: 4.8, phone: '+91 9876543211', state: 'Karnataka', district: 'Mysore', fees: 650, about: 'Eye specialist at Apollo Hospital Mysore. Expert in cataract surgery and LASIK procedures.', coordinates: [76.6394, 12.2958], languages: ['English', 'Malayalam', 'Kannada'], consultationModes: ['in-person'], clinicName: 'Apollo Hospital Mysore', gender: 'female' },
    { name: 'Dr. Ramesh Hegde', email: 'dr.ramesh.h@hospital.com', specialization: 'General Physician', qualifications: 'MBBS, MD (Internal Medicine)', experience: 18, rating: 4.7, phone: '+91 9876543250', state: 'Karnataka', district: 'Bangalore Urban', fees: 500, about: 'Senior physician at Narayana Health. Expert in managing chronic diseases - diabetes, hypertension, thyroid.', coordinates: [77.6100, 12.9800], languages: ['English', 'Hindi', 'Kannada', 'Telugu'], consultationModes: ['in-person', 'video', 'chat'], clinicName: 'Narayana Health City', gender: 'male' },

    // ─── Maharashtra ────────────────────────
    { name: 'Dr. Priya Sharma', email: 'dr.priya@hospital.com', specialization: 'Dermatologist', qualifications: 'MBBS, MD (Dermatology)', experience: 15, rating: 4.9, phone: '+91 9876543212', state: 'Maharashtra', district: 'Mumbai', fees: 1000, about: 'Consultant Dermatologist at Kokilaben Hospital. Expert in cosmetic dermatology and hair transplant.', coordinates: [72.8777, 19.0760], languages: ['English', 'Hindi', 'Marathi'], consultationModes: ['in-person', 'video'], clinicName: 'Kokilaben Dhirubhai Ambani Hospital', gender: 'female' },
    { name: 'Dr. Nisha Agarwal', email: 'dr.nisha@hospital.com', specialization: 'Oncologist', qualifications: 'MBBS, MD (Oncology), DNB', experience: 20, rating: 4.9, phone: '+91 9876543213', state: 'Maharashtra', district: 'Mumbai', fees: 1500, about: 'Senior Oncologist at Tata Memorial Hospital. 20+ years in cancer treatment and research.', coordinates: [72.8420, 19.0050], languages: ['English', 'Hindi', 'Marathi'], consultationModes: ['in-person'], clinicName: 'Tata Memorial Hospital', gender: 'female' },
    { name: 'Dr. Aditya Joshi', email: 'dr.aditya.j@hospital.com', specialization: 'Cardiologist', qualifications: 'MBBS, MD (Medicine), DM (Cardiology)', experience: 16, rating: 4.8, phone: '+91 9876543251', state: 'Maharashtra', district: 'Pune', fees: 900, about: 'Interventional Cardiologist at Ruby Hall Clinic. Expert in angioplasty and cardiac catheterization.', coordinates: [73.8800, 18.5300], languages: ['English', 'Hindi', 'Marathi'], consultationModes: ['in-person', 'video'], clinicName: 'Ruby Hall Clinic', gender: 'male' },
    { name: 'Dr. Swati Kulkarni', email: 'dr.swati.k@hospital.com', specialization: 'Gynecologist', qualifications: 'MBBS, MS (OBG), DNB', experience: 12, rating: 4.7, phone: '+91 9876543252', state: 'Maharashtra', district: 'Pune', fees: 700, about: 'Consultant Obstetrician & Gynecologist at Ruby Hall. Expert in high-risk pregnancies and laparoscopic surgery.', coordinates: [73.8567, 18.5200], languages: ['English', 'Hindi', 'Marathi'], consultationModes: ['in-person', 'video', 'chat'], clinicName: 'Ruby Hall Clinic', gender: 'female' },

    // ─── Delhi ──────────────────────────────
    { name: 'Dr. Rajesh Gupta', email: 'dr.rajesh@hospital.com', specialization: 'Orthopedic', qualifications: 'MBBS, MS (Ortho), Fellowship UK', experience: 28, rating: 4.8, phone: '+91 9876543214', state: 'Delhi', district: 'New Delhi', fees: 1200, about: 'HOD Orthopedics at AIIMS Delhi. Expert in joint replacement and sports injuries.', coordinates: [77.2090, 28.6139], languages: ['English', 'Hindi'], consultationModes: ['in-person'], clinicName: 'AIIMS New Delhi', gender: 'male' },
    { name: 'Dr. Amit Verma', email: 'dr.amit@hospital.com', specialization: 'Gastroenterologist', qualifications: 'MBBS, MD (Medicine), DM (Gastro)', experience: 21, rating: 4.7, phone: '+91 9876543215', state: 'Delhi', district: 'South Delhi', fees: 900, about: 'Senior Gastroenterologist at Sir Ganga Ram Hospital. Specializes in endoscopy and liver diseases.', coordinates: [77.2273, 28.5382], languages: ['English', 'Hindi', 'Punjabi'], consultationModes: ['in-person', 'video'], clinicName: 'Sir Ganga Ram Hospital', gender: 'male' },
    { name: 'Dr. Neelam Saxena', email: 'dr.neelam.s@hospital.com', specialization: 'Pediatrician', qualifications: 'MBBS, MD (Pediatrics), Fellowship Neonatology', experience: 19, rating: 4.8, phone: '+91 9876543253', state: 'Delhi', district: 'South Delhi', fees: 800, about: 'Pediatrician at Max Super Speciality Hospital. Expert in neonatal care and childhood allergies.', coordinates: [77.2200, 28.5250], languages: ['English', 'Hindi'], consultationModes: ['in-person', 'video', 'chat'], clinicName: 'Max Super Speciality Hospital', gender: 'female' },
    { name: 'Dr. Vivek Tandon', email: 'dr.vivek.t@hospital.com', specialization: 'Psychiatrist', qualifications: 'MBBS, MD (Psychiatry)', experience: 15, rating: 4.6, phone: '+91 9876543254', state: 'Delhi', district: 'New Delhi', fees: 1100, about: 'Consultant Psychiatrist at AIIMS. Expert in anxiety, depression, OCD and addiction medicine.', coordinates: [77.2100, 28.5700], languages: ['English', 'Hindi'], consultationModes: ['in-person', 'video', 'chat'], clinicName: 'AIIMS New Delhi', gender: 'male' },

    // ─── Tamil Nadu ─────────────────────────
    { name: 'Dr. Sneha Reddy', email: 'dr.sneha@hospital.com', specialization: 'Gynecologist', qualifications: 'MBBS, MS (OBG), Fellowship Reproductive Medicine', experience: 18, rating: 4.9, phone: '+91 9876543216', state: 'Tamil Nadu', district: 'Chennai', fees: 700, about: 'Consultant Gynecologist at Apollo Hospital Chennai. Expert in IVF and fertility treatments.', coordinates: [80.2707, 13.0827], languages: ['English', 'Hindi', 'Tamil', 'Telugu'], consultationModes: ['in-person', 'video'], clinicName: 'Apollo Hospitals Chennai', gender: 'female' },
    { name: 'Dr. Karthik Rajan', email: 'dr.karthik@hospital.com', specialization: 'Urologist', qualifications: 'MBBS, MS (Surgery), MCh (Urology)', experience: 24, rating: 4.8, phone: '+91 9876543217', state: 'Tamil Nadu', district: 'Coimbatore', fees: 1100, about: 'Senior Urologist at KMCH. Expert in kidney stone removal, prostate surgery, and urological oncology.', coordinates: [76.9558, 11.0168], languages: ['English', 'Tamil'], consultationModes: ['in-person'], clinicName: 'KMCH Hospital', gender: 'male' },
    { name: 'Dr. Lakshmi Subramanian', email: 'dr.lakshmi.s@hospital.com', specialization: 'Dermatologist', qualifications: 'MBBS, MD (Dermatology), Fellowship Cosmetology', experience: 10, rating: 4.7, phone: '+91 9876543255', state: 'Tamil Nadu', district: 'Chennai', fees: 600, about: 'Cosmetic Dermatologist at Apollo Hospitals. Expert in laser treatments, chemical peels, and skin rejuvenation.', coordinates: [80.2550, 13.0600], languages: ['English', 'Tamil', 'Hindi'], consultationModes: ['in-person', 'video', 'chat'], clinicName: 'Apollo Hospitals Chennai', gender: 'female' },

    // ─── Telangana ──────────────────────────
    { name: 'Dr. Vikram Singh', email: 'dr.vikram@hospital.com', specialization: 'Neurologist', qualifications: 'MBBS, MD (Medicine), DM (Neurology)', experience: 20, rating: 4.8, phone: '+91 9876543218', state: 'Telangana', district: 'Hyderabad', fees: 900, about: 'Senior Neurologist at KIMS Hospital. Expert in epilepsy, stroke management, and headache disorders.', coordinates: [78.4867, 17.3850], languages: ['English', 'Hindi', 'Telugu'], consultationModes: ['in-person', 'video'], clinicName: 'KIMS Hospitals', gender: 'male' },
    { name: 'Dr. Harish Rao', email: 'dr.harish@hospital.com', specialization: 'Radiologist', qualifications: 'MBBS, DMRD, DNB (Radiology)', experience: 18, rating: 4.6, phone: '+91 9876543219', state: 'Telangana', district: 'Warangal', fees: 700, about: 'Consultant Radiologist at MGM Hospital. Expert in MRI, CT diagnostics, and interventional radiology.', coordinates: [79.5941, 17.9784], languages: ['English', 'Hindi', 'Telugu'], consultationModes: ['in-person'], clinicName: 'MGM Hospital Warangal', gender: 'male' },
    { name: 'Dr. Ananya Reddy', email: 'dr.ananya.r@hospital.com', specialization: 'ENT Specialist', qualifications: 'MBBS, MS (ENT)', experience: 11, rating: 4.7, phone: '+91 9876543256', state: 'Telangana', district: 'Hyderabad', fees: 600, about: 'ENT Specialist at KIMS. Expert in sinus surgery, tonsillectomy, and hearing implants.', coordinates: [78.5000, 17.4400], languages: ['English', 'Telugu', 'Hindi'], consultationModes: ['in-person', 'video'], clinicName: 'KIMS Hospitals', gender: 'female' },

    // ─── Kerala ─────────────────────────────
    { name: 'Dr. Deepa Menon', email: 'dr.deepa@hospital.com', specialization: 'General Physician', qualifications: 'MBBS, MD (Internal Medicine)', experience: 12, rating: 4.7, phone: '+91 9876543220', state: 'Kerala', district: 'Kochi', fees: 400, about: 'General Physician at Amrita Hospital Kochi. 12 years of clinical practice in internal medicine.', coordinates: [76.2673, 9.9312], languages: ['English', 'Malayalam', 'Hindi'], consultationModes: ['in-person', 'video', 'chat'], clinicName: 'Amrita Hospital Kochi', gender: 'female' },
    { name: 'Dr. Lakshmi Pillai', email: 'dr.lakshmi@hospital.com', specialization: 'Ayurveda', qualifications: 'BAMS, MD (Ayurveda)', experience: 30, rating: 4.9, phone: '+91 9876543221', state: 'Kerala', district: 'Thiruvananthapuram', fees: 350, about: 'Senior Ayurvedic Physician. 30 years of traditional healing experience in Panchakarma and chronic disease management.', coordinates: [76.9366, 8.5241], languages: ['English', 'Malayalam', 'Tamil', 'Hindi'], consultationModes: ['in-person'], clinicName: 'Sree Chitra Tirunal Hospital', gender: 'female' },
    { name: 'Dr. Thomas Mathew', email: 'dr.thomas.m@hospital.com', specialization: 'Cardiologist', qualifications: 'MBBS, MD, DM (Cardiology)', experience: 22, rating: 4.8, phone: '+91 9876543257', state: 'Kerala', district: 'Kochi', fees: 850, about: 'Senior Cardiologist at Amrita Hospital. Expert in echocardiography, angioplasty, and cardiac rehabilitation.', coordinates: [76.2900, 10.0300], languages: ['English', 'Malayalam', 'Hindi'], consultationModes: ['in-person', 'video'], clinicName: 'Amrita Hospital Kochi', gender: 'male' },

    // ─── Gujarat ────────────────────────────
    { name: 'Dr. Suresh Patel', email: 'dr.suresh@hospital.com', specialization: 'ENT Specialist', qualifications: 'MBBS, MS (ENT), Fellowship Cochlear Implant', experience: 25, rating: 4.7, phone: '+91 9876543222', state: 'Gujarat', district: 'Ahmedabad', fees: 600, about: 'Senior ENT Surgeon at Sterling Hospital. Expert in sinus surgery and cochlear implants.', coordinates: [72.5714, 23.0225], languages: ['English', 'Hindi', 'Gujarati'], consultationModes: ['in-person'], clinicName: 'Sterling Hospital', gender: 'male' },
    { name: 'Dr. Hetal Shah', email: 'dr.hetal.s@hospital.com', specialization: 'Gynecologist', qualifications: 'MBBS, MS (OBG), DNB', experience: 14, rating: 4.7, phone: '+91 9876543258', state: 'Gujarat', district: 'Ahmedabad', fees: 700, about: 'Consultant Gynecologist at Sterling Hospital. Expert in minimally invasive gynecological surgery.', coordinates: [72.5500, 23.0400], languages: ['English', 'Hindi', 'Gujarati'], consultationModes: ['in-person', 'video'], clinicName: 'Sterling Hospital', gender: 'female' },

    // ─── West Bengal ────────────────────────
    { name: 'Dr. Anita Desai', email: 'dr.anita@hospital.com', specialization: 'Pediatrician', qualifications: 'MBBS, MD (Pediatrics)', experience: 16, rating: 4.9, phone: '+91 9876543223', state: 'West Bengal', district: 'Kolkata', fees: 500, about: 'Consultant Pediatrician at AMRI Hospital. Expert in child nutrition, vaccination, and developmental disorders.', coordinates: [88.3639, 22.5726], languages: ['English', 'Hindi', 'Bengali'], consultationModes: ['in-person', 'video', 'chat'], clinicName: 'AMRI Hospital Kolkata', gender: 'female' },
    { name: 'Dr. Soumya Banerjee', email: 'dr.soumya.b@hospital.com', specialization: 'Neurologist', qualifications: 'MBBS, MD, DM (Neurology)', experience: 17, rating: 4.7, phone: '+91 9876543259', state: 'West Bengal', district: 'Kolkata', fees: 900, about: 'Neurologist at AMRI Hospital Kolkata. Specializes in movement disorders, multiple sclerosis, and dementia.', coordinates: [88.3700, 22.5100], languages: ['English', 'Hindi', 'Bengali'], consultationModes: ['in-person', 'video'], clinicName: 'AMRI Hospital Kolkata', gender: 'male' },

    // ─── Rajasthan ──────────────────────────
    { name: 'Dr. Manish Joshi', email: 'dr.manish@hospital.com', specialization: 'Psychiatrist', qualifications: 'MBBS, MD (Psychiatry)', experience: 19, rating: 4.9, phone: '+91 9876543224', state: 'Rajasthan', district: 'Jaipur', fees: 1200, about: 'Senior Psychiatrist at SMS Hospital Jaipur. Expert in anxiety, depression and addiction medicine.', coordinates: [75.7873, 26.9124], languages: ['English', 'Hindi', 'Rajasthani'], consultationModes: ['in-person', 'video', 'chat'], clinicName: 'SMS Hospital Jaipur', gender: 'male' },
    { name: 'Dr. Pallavi Meena', email: 'dr.pallavi.m@hospital.com', specialization: 'Dentist', qualifications: 'BDS, MDS (Orthodontics)', experience: 8, rating: 4.6, phone: '+91 9876543260', state: 'Rajasthan', district: 'Jaipur', fees: 400, about: 'Orthodontist at SMS Hospital. Expert in braces, aligners, and smile corrections.', coordinates: [75.8000, 26.9200], languages: ['English', 'Hindi'], consultationModes: ['in-person'], clinicName: 'SMS Hospital Jaipur', gender: 'female' },

    // ─── Uttar Pradesh ──────────────────────
    { name: 'Dr. Ravi Shankar', email: 'dr.ravi@hospital.com', specialization: 'Pulmonologist', qualifications: 'MBBS, MD (Medicine), DM (Pulmonary Medicine)', experience: 23, rating: 4.8, phone: '+91 9876543225', state: 'Uttar Pradesh', district: 'Lucknow', fees: 750, about: 'Senior Pulmonologist at KGMU. Expert in asthma, COPD, TB treatment, and sleep disorders.', coordinates: [80.9462, 26.8467], languages: ['English', 'Hindi', 'Urdu'], consultationModes: ['in-person', 'video'], clinicName: 'KGMU Hospital', gender: 'male' },
    { name: 'Dr. Alka Srivastava', email: 'dr.alka.s@hospital.com', specialization: 'Endocrinologist', qualifications: 'MBBS, MD, DM (Endocrinology)', experience: 14, rating: 4.7, phone: '+91 9876543261', state: 'Uttar Pradesh', district: 'Lucknow', fees: 800, about: 'Endocrinologist at KGMU. Expert in diabetes management, thyroid disorders, and PCOS.', coordinates: [80.9500, 26.8500], languages: ['English', 'Hindi'], consultationModes: ['in-person', 'video', 'chat'], clinicName: 'KGMU Hospital', gender: 'female' },

    // ─── Punjab ─────────────────────────────
    { name: 'Dr. Shalini Kapoor', email: 'dr.shalini@hospital.com', specialization: 'Dentist', qualifications: 'BDS, MDS (Orthodontics)', experience: 11, rating: 4.8, phone: '+91 9876543226', state: 'Punjab', district: 'Ludhiana', fees: 500, about: 'Orthodontist at DMC Ludhiana. Expert in braces, invisalign, and dental implants.', coordinates: [75.8573, 30.9010], languages: ['English', 'Hindi', 'Punjabi'], consultationModes: ['in-person'], clinicName: 'DMC Hospital', gender: 'female' },
    { name: 'Dr. Harjeet Gill', email: 'dr.harjeet.g@hospital.com', specialization: 'Orthopedic', qualifications: 'MBBS, MS (Ortho), Fellowship Joint Replacement', experience: 20, rating: 4.7, phone: '+91 9876543262', state: 'Punjab', district: 'Ludhiana', fees: 800, about: 'Senior Orthopedic Surgeon at DMC Hospital. Expert in knee and hip replacement surgery.', coordinates: [75.8600, 30.9100], languages: ['English', 'Hindi', 'Punjabi'], consultationModes: ['in-person'], clinicName: 'DMC Hospital', gender: 'male' },

    // ─── Madhya Pradesh ─────────────────────
    { name: 'Dr. Meera Iyer', email: 'dr.meera@hospital.com', specialization: 'Endocrinologist', qualifications: 'MBBS, MD, DM (Endocrinology)', experience: 17, rating: 4.9, phone: '+91 9876543227', state: 'Madhya Pradesh', district: 'Bhopal', fees: 850, about: 'Consultant Endocrinologist at Bansal Hospital. Expert in diabetes, thyroid disorders, and hormonal imbalances.', coordinates: [77.4126, 23.2599], languages: ['English', 'Hindi'], consultationModes: ['in-person', 'video'], clinicName: 'Bansal Hospital', gender: 'female' },

    // ─── Bihar ──────────────────────────────
    { name: 'Dr. Sanjay Mehta', email: 'dr.sanjay@hospital.com', specialization: 'Nephrologist', qualifications: 'MBBS, MD (Medicine), DM (Nephrology)', experience: 26, rating: 4.7, phone: '+91 9876543228', state: 'Bihar', district: 'Patna', fees: 950, about: 'Senior Nephrologist at PMCH. Expert in dialysis, kidney transplant, and chronic kidney disease management.', coordinates: [85.1376, 25.6093], languages: ['English', 'Hindi', 'Bhojpuri'], consultationModes: ['in-person'], clinicName: 'PMCH Patna', gender: 'male' },
    { name: 'Dr. Priya Kumari', email: 'dr.priya.k@hospital.com', specialization: 'General Physician', qualifications: 'MBBS, MD (Internal Medicine)', experience: 10, rating: 4.5, phone: '+91 9876543263', state: 'Bihar', district: 'Patna', fees: 350, about: 'General Physician at PMCH Patna. Specializes in fever, infections, and preventive medicine.', coordinates: [85.1400, 25.6200], languages: ['English', 'Hindi', 'Bhojpuri', 'Maithili'], consultationModes: ['in-person', 'video', 'chat'], clinicName: 'PMCH Patna', gender: 'female' },

    // ─── Haryana ────────────────────────────
    { name: 'Dr. Pooja Saxena', email: 'dr.pooja@hospital.com', specialization: 'Physiotherapist', qualifications: 'BPT, MPT (Sports Physiotherapy)', experience: 10, rating: 4.8, phone: '+91 9876543229', state: 'Haryana', district: 'Gurugram', fees: 400, about: 'Sports Physiotherapist at Fortis Memorial Hospital. Expert in sports injuries, post-surgical rehab, and spine care.', coordinates: [77.0266, 28.4595], languages: ['English', 'Hindi'], consultationModes: ['in-person', 'video'], clinicName: 'Fortis Memorial Hospital', gender: 'female' },
    { name: 'Dr. Rohit Malhotra', email: 'dr.rohit.m@hospital.com', specialization: 'Cardiologist', qualifications: 'MBBS, MD, DM (Cardiology)', experience: 24, rating: 4.9, phone: '+91 9876543264', state: 'Haryana', district: 'Gurugram', fees: 1200, about: 'Director of Cardiology at Fortis Memorial. Expert in complex angioplasty, TAVR, and cardiac electrophysiology.', coordinates: [77.0300, 28.4500], languages: ['English', 'Hindi', 'Punjabi'], consultationModes: ['in-person', 'video'], clinicName: 'Fortis Memorial Hospital', gender: 'male' },

    // ─── Odisha ─────────────────────────────
    { name: 'Dr. Sarita Mohanty', email: 'dr.sarita@hospital.com', specialization: 'General Physician', qualifications: 'MBBS, MD (Internal Medicine)', experience: 15, rating: 4.6, phone: '+91 9876543230', state: 'Odisha', district: 'Bhubaneswar', fees: 350, about: 'General Physician at AIIMS Bhubaneswar. 15 years of clinical experience in internal medicine.', coordinates: [85.8245, 20.2961], languages: ['English', 'Hindi', 'Odia'], consultationModes: ['in-person', 'video'], clinicName: 'AIIMS Bhubaneswar', gender: 'female' },

    // ─── Assam ──────────────────────────────
    { name: 'Dr. Bhaskar Dutta', email: 'dr.bhaskar@hospital.com', specialization: 'Cardiologist', qualifications: 'MBBS, MD (Medicine), DM (Cardiology)', experience: 19, rating: 4.7, phone: '+91 9876543231', state: 'Assam', district: 'Guwahati', fees: 700, about: 'Consultant Cardiologist at GNRC Hospital. Expert in angioplasty, pacemaker implant, and echocardiography.', coordinates: [91.7362, 26.1445], languages: ['English', 'Hindi', 'Assamese', 'Bengali'], consultationModes: ['in-person', 'video'], clinicName: 'GNRC Hospital', gender: 'male' },

    // ─── Jharkhand ──────────────────────────
    { name: 'Dr. Sunita Kumari', email: 'dr.sunita@hospital.com', specialization: 'Gynecologist', qualifications: 'MBBS, MS (OBG)', experience: 13, rating: 4.6, phone: '+91 9876543232', state: 'Jharkhand', district: 'Ranchi', fees: 500, about: 'Consultant OBG at Medica Hospital Ranchi. Expert in high-risk pregnancies and minimally invasive surgery.', coordinates: [85.3096, 23.3441], languages: ['English', 'Hindi'], consultationModes: ['in-person'], clinicName: 'Medica Superspecialty Hospital', gender: 'female' },

    // ─── Chhattisgarh ───────────────────────
    { name: 'Dr. Rakesh Tiwari', email: 'dr.rakesh@hospital.com', specialization: 'Orthopedic', qualifications: 'MBBS, MS (Ortho)', experience: 16, rating: 4.5, phone: '+91 9876543233', state: 'Chhattisgarh', district: 'Raipur', fees: 600, about: 'Orthopedic Surgeon at Ramkrishna Care Hospital. Expert in fracture management and arthroscopy.', coordinates: [81.6296, 21.2514], languages: ['English', 'Hindi', 'Chhattisgarhi'], consultationModes: ['in-person'], clinicName: 'Ramkrishna Care Hospital', gender: 'male' },

    // ─── Uttarakhand ────────────────────────
    { name: 'Dr. Neha Rawat', email: 'dr.neha@hospital.com', specialization: 'Dermatologist', qualifications: 'MBBS, MD (Dermatology)', experience: 9, rating: 4.7, phone: '+91 9876543234', state: 'Uttarakhand', district: 'Dehradun', fees: 500, about: 'Dermatologist at Max Hospital Dehradun. Expert in acne treatment, skin rejuvenation, and laser therapy.', coordinates: [78.0322, 30.3165], languages: ['English', 'Hindi'], consultationModes: ['in-person', 'video'], clinicName: 'Max Hospital Dehradun', gender: 'female' },

    // ─── Himachal Pradesh ───────────────────
    { name: 'Dr. Aman Thakur', email: 'dr.aman@hospital.com', specialization: 'General Physician', qualifications: 'MBBS, MD (Medicine)', experience: 14, rating: 4.6, phone: '+91 9876543235', state: 'Himachal Pradesh', district: 'Shimla', fees: 400, about: 'General Physician at IGMC Shimla. 14 years serving in hill regions. Expert in altitude-related health issues.', coordinates: [77.1734, 31.1048], languages: ['English', 'Hindi', 'Pahari'], consultationModes: ['in-person', 'video', 'chat'], clinicName: 'IGMC Shimla', gender: 'male' },

    // ─── Jammu and Kashmir ──────────────────
    { name: 'Dr. Faisal Ahmad', email: 'dr.faisal@hospital.com', specialization: 'Pediatrician', qualifications: 'MBBS, MD (Pediatrics)', experience: 12, rating: 4.7, phone: '+91 9876543236', state: 'Jammu and Kashmir', district: 'Srinagar', fees: 500, about: 'Consultant Pediatrician at SKIMS Srinagar. Expert in neonatal care, child health, and vaccination counseling.', coordinates: [74.7973, 34.0837], languages: ['English', 'Hindi', 'Urdu', 'Kashmiri'], consultationModes: ['in-person', 'video'], clinicName: 'SKIMS Srinagar', gender: 'male' },

    // ─── Goa ────────────────────────────────
    { name: 'Dr. Carlos Fernandes', email: 'dr.carlos@hospital.com', specialization: 'Dentist', qualifications: 'BDS, MDS (Prosthodontics)', experience: 20, rating: 4.8, phone: '+91 9876543237', state: 'Goa', district: 'North Goa', fees: 550, about: 'Senior Dental Surgeon at Goa Medical College. Expert in dental implants, smile design, and full-mouth rehabilitation.', coordinates: [73.8278, 15.4909], languages: ['English', 'Hindi', 'Konkani', 'Portuguese'], consultationModes: ['in-person'], clinicName: 'Goa Medical College', gender: 'male' },

    // ─── Chandigarh ─────────────────────────
    { name: 'Dr. Gurpreet Kaur', email: 'dr.gurpreet@hospital.com', specialization: 'Neurologist', qualifications: 'MBBS, MD, DM (Neurology)', experience: 17, rating: 4.8, phone: '+91 9876543238', state: 'Chandigarh', district: 'Chandigarh', fees: 1000, about: 'Neurologist at PGI Chandigarh. Expert in stroke, Parkinson\'s disease, headache disorders, and neuroimmunology.', coordinates: [76.7794, 30.7333], languages: ['English', 'Hindi', 'Punjabi'], consultationModes: ['in-person', 'video'], clinicName: 'PGI Chandigarh', gender: 'female' },
    { name: 'Dr. Navdeep Singh', email: 'dr.navdeep.s@hospital.com', specialization: 'Gastroenterologist', qualifications: 'MBBS, MD, DM (Gastroenterology)', experience: 15, rating: 4.7, phone: '+91 9876543265', state: 'Chandigarh', district: 'Chandigarh', fees: 900, about: 'Gastroenterologist at PGI Chandigarh. Expert in endoscopy, liver transplant evaluation, and IBD management.', coordinates: [76.7800, 30.7600], languages: ['English', 'Hindi', 'Punjabi'], consultationModes: ['in-person', 'video'], clinicName: 'PGI Chandigarh', gender: 'male' },

    // ─── Additional Doctors for Coverage ─────
    { name: 'Dr. Rekha Verma', email: 'dr.rekha.v@hospital.com', specialization: 'Dermatologist', qualifications: 'MBBS, MD (Dermatology)', experience: 13, rating: 4.6, phone: '+91 9876543266', state: 'Maharashtra', district: 'Mumbai', fees: 800, about: 'Dermatologist at Kokilaben Hospital. Expert in vitiligo, psoriasis, and cosmetic procedures.', coordinates: [72.8350, 19.1300], languages: ['English', 'Hindi', 'Marathi'], consultationModes: ['in-person', 'video', 'chat'], clinicName: 'Kokilaben Dhirubhai Ambani Hospital', gender: 'female' },
    { name: 'Dr. Siddharth Jain', email: 'dr.siddharth.j@hospital.com', specialization: 'Ophthalmologist', qualifications: 'MBBS, MS (Ophthalmology), Fellowship Retina', experience: 16, rating: 4.8, phone: '+91 9876543267', state: 'Delhi', district: 'New Delhi', fees: 1000, about: 'Retina Specialist at AIIMS. Expert in diabetic retinopathy, retinal detachment surgery, and macular degeneration.', coordinates: [77.2100, 28.5672], languages: ['English', 'Hindi'], consultationModes: ['in-person'], clinicName: 'AIIMS New Delhi', gender: 'male' },
    { name: 'Dr. Divya Prakash', email: 'dr.divya.p@hospital.com', specialization: 'Pulmonologist', qualifications: 'MBBS, MD, DM (Pulmonary Medicine)', experience: 12, rating: 4.7, phone: '+91 9876543268', state: 'Karnataka', district: 'Bangalore Urban', fees: 700, about: 'Pulmonologist at Narayana Health. Expert in interventional pulmonology, sleep medicine, and allergy management.', coordinates: [77.6500, 12.8500], languages: ['English', 'Hindi', 'Kannada'], consultationModes: ['in-person', 'video'], clinicName: 'Narayana Health City', gender: 'female' },
    { name: 'Dr. Ashok Kumar', email: 'dr.ashok.k@hospital.com', specialization: 'Oncologist', qualifications: 'MBBS, MD (Oncology), DM (Medical Oncology)', experience: 22, rating: 4.8, phone: '+91 9876543269', state: 'Tamil Nadu', district: 'Chennai', fees: 1400, about: 'Senior Medical Oncologist at Apollo Chennai. Expert in chemotherapy, immunotherapy, and precision oncology.', coordinates: [80.2550, 13.0600], languages: ['English', 'Hindi', 'Tamil'], consultationModes: ['in-person', 'video'], clinicName: 'Apollo Hospitals Chennai', gender: 'male' },
    { name: 'Dr. Isha Bhatt', email: 'dr.isha.b@hospital.com', specialization: 'Physiotherapist', qualifications: 'BPT, MPT (Neurology)', experience: 7, rating: 4.5, phone: '+91 9876543270', state: 'Delhi', district: 'South Delhi', fees: 500, about: 'Neuro Physiotherapist at Max Hospital Saket. Expert in stroke rehabilitation, spinal cord injury, and balance training.', coordinates: [77.2200, 28.5250], languages: ['English', 'Hindi'], consultationModes: ['in-person', 'video', 'chat'], clinicName: 'Max Super Speciality Hospital', gender: 'female' },
];

const seedDoctors = async () => {
    await connectDB();

    try {
        // Build clinic map: name → _id
        const allClinics = await Clinic.find({});
        for (const c of allClinics) {
            clinicMap[c.name] = c._id;
        }
        console.log(`📋 Found ${allClinics.length} clinics in DB for linking\n`);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('doctor123', salt);

        // Clear existing seed doctors
        await User.deleteMany({ role: 'doctor', email: { $regex: /@hospital\.com$/ } });
        console.log('🗑️  Cleared previous seeded doctors\n');

        let created = 0;

        for (const doc of doctors) {
            const clinicId = clinicMap[doc.clinicName] || null;

            await User.create({
                name: doc.name,
                email: doc.email,
                password: hashedPassword,
                role: 'doctor',
                specialization: doc.specialization,
                qualifications: doc.qualifications,
                experience: doc.experience,
                rating: doc.rating,
                phone: doc.phone,
                state: doc.state,
                district: doc.district,
                fees: doc.fees,
                about: doc.about,
                languages: doc.languages,
                consultationModes: doc.consultationModes,
                clinic: clinicId,
                isVerified: true,
                image: `https://randomuser.me/api/portraits/${doc.gender === 'female' ? 'women' : 'men'}/${10 + created}.jpg`,
                location: {
                    type: 'Point',
                    coordinates: doc.coordinates,
                },
                availableSlots: [
                    { day: 'Monday', startTime: '09:00', endTime: '13:00' },
                    { day: 'Tuesday', startTime: '09:00', endTime: '13:00' },
                    { day: 'Wednesday', startTime: '14:00', endTime: '18:00' },
                    { day: 'Thursday', startTime: '09:00', endTime: '13:00' },
                    { day: 'Friday', startTime: '09:00', endTime: '17:00' },
                    { day: 'Saturday', startTime: '10:00', endTime: '14:00' },
                ],
            });
            created++;
            console.log(`✅ Created: ${doc.name} (${doc.specialization}) - ${doc.district}, ${doc.state}${clinicId ? ' → ' + doc.clinicName : ''}`);
        }

        // Link doctors to clinics
        console.log('\n🔗 Linking doctors to clinics...');
        for (const clinic of allClinics) {
            const clinicDoctors = await User.find({ clinic: clinic._id, role: 'doctor' }).select('_id');
            clinic.doctors = clinicDoctors.map(d => d._id);
            await clinic.save();
            if (clinicDoctors.length > 0) {
                console.log(`   🏥 ${clinic.name}: ${clinicDoctors.length} doctors linked`);
            }
        }

        console.log(`\n🎉 Seeding complete! Created: ${created} doctors`);
        console.log(`📊 Total doctors in DB: ${await User.countDocuments({ role: 'doctor' })}`);
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDoctors();
